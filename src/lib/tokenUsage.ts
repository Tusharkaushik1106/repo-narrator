import { Pool } from "pg";
import { config } from "@/lib/config";

const databaseUrl = config.database.url;
let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!databaseUrl) return null;
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

export function estimateTokens(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const codePattern = /[{}[\]();,=<>]/g;
  const codeMatches = (text.match(codePattern) || []).length;
  const codeRatio = Math.min(codeMatches / text.length, 0.5);
  
  const avgCharsPerToken = 3.5 + (1 - codeRatio) * 1.5;
  
  return Math.ceil(text.length / avgCharsPerToken);
}
export async function recordActualUsage(
  userId: string,
  actualTokens: number
): Promise<void> {
  const client = getPool();
  if (!client) {
    console.warn("No database connection - cannot record actual token usage");
    return;
  }

  try {
    await ensureTable();
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const result = await client.query(
      `SELECT tokens_used, last_reset FROM token_usage WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      await client.query(
        `INSERT INTO token_usage (user_id, tokens_used, request_count, last_reset, rate_limit_window_start) 
         VALUES ($1, $2, 1, $3, $3)`,
        [userId, actualTokens, today]
      );
      return;
    }

    const record = result.rows[0];
    const lastReset = new Date(record.last_reset);

    if (lastReset < today) {
      await client.query(
        `UPDATE token_usage 
         SET tokens_used = $1, request_count = 1, last_reset = $2, rate_limit_window_start = $2, rate_limit_count = 1
         WHERE user_id = $3`,
        [actualTokens, today, userId]
      );
    } else {
      await client.query(
        `UPDATE token_usage 
         SET tokens_used = tokens_used + $1
         WHERE user_id = $2`,
        [actualTokens, userId]
      );
    }
  } catch (error) {
    console.warn("Failed to record actual token usage:", error instanceof Error ? error.message : String(error));
  }
}

interface TokenUsage {
  userId: string;
  tokensUsed: number;
  requestCount: number;
  lastReset: Date;
}

const DAILY_TOKEN_LIMIT = 50000;
const DAILY_REQUEST_LIMIT = 100;
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_REQUESTS = 10;

async function ensureTable(): Promise<void> {
  const client = getPool();
  if (!client) return;
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS token_usage (
        user_id text NOT NULL,
        tokens_used integer NOT NULL DEFAULT 0,
        request_count integer NOT NULL DEFAULT 0,
        last_reset timestamptz NOT NULL DEFAULT now(),
        last_request timestamptz,
        rate_limit_window_start timestamptz,
        rate_limit_count integer NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id)
      );
    `);
  } catch (error) {
    console.warn("Failed to ensure token_usage table:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export async function checkAndRecordUsage(
  userId: string,
  estimatedTokens: number
): Promise<{ allowed: boolean; reason?: string; retryAfter?: number }> {
  const client = getPool();
  if (!client) {
    console.warn("No database connection - token limits not enforced");
    return { allowed: true };
  }

  try {
    await ensureTable();
  } catch (error) {
    console.warn("Database unavailable - token limits not enforced:", error instanceof Error ? error.message : String(error));
    return { allowed: true };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let usage;
  try {
    usage = await client.query(
      `SELECT tokens_used, request_count, last_reset, last_request, rate_limit_window_start, rate_limit_count 
       FROM token_usage WHERE user_id = $1`,
      [userId]
    );

    if (usage.rows.length === 0) {
      await client.query(
        `INSERT INTO token_usage (user_id, tokens_used, request_count, last_reset, rate_limit_window_start) 
         VALUES ($1, 0, 0, $2, $2)`,
        [userId, today]
      );
      usage = await client.query(
        `SELECT tokens_used, request_count, last_reset, last_request, rate_limit_window_start, rate_limit_count 
         FROM token_usage WHERE user_id = $1`,
        [userId]
      );
    }
  } catch (error) {
    console.warn("Database query failed - allowing request:", error instanceof Error ? error.message : String(error));
    return { allowed: true };
  }

  const record = usage.rows[0];
  const lastReset = new Date(record.last_reset);

  try {
    if (lastReset < today) {
      await client.query(
        `UPDATE token_usage 
         SET tokens_used = 0, request_count = 0, last_reset = $1, rate_limit_window_start = $1, rate_limit_count = 0 
         WHERE user_id = $2`,
        [today, userId]
      );
    }

    const windowStart = record.rate_limit_window_start 
      ? new Date(record.rate_limit_window_start) 
      : new Date(now.getTime() - RATE_LIMIT_WINDOW * 1000);
    
    const windowAge = (now.getTime() - windowStart.getTime()) / 1000;
    
    if (windowAge > RATE_LIMIT_WINDOW) {
      await client.query(
        `UPDATE token_usage SET rate_limit_window_start = $1, rate_limit_count = 0 WHERE user_id = $2`,
        [now, userId]
      );
    } else if (record.rate_limit_count >= RATE_LIMIT_REQUESTS) {
      const retryAfter = Math.ceil(RATE_LIMIT_WINDOW - windowAge);
      return {
        allowed: false,
        reason: `Rate limit exceeded. Maximum ${RATE_LIMIT_REQUESTS} requests per ${RATE_LIMIT_WINDOW} seconds.`,
        retryAfter,
      };
    }

    const currentTokens = record.tokens_used || 0;
    if (currentTokens + estimatedTokens > DAILY_TOKEN_LIMIT) {
      return {
        allowed: false,
        reason: `Daily token limit exceeded. You've used ${currentTokens}/${DAILY_TOKEN_LIMIT} tokens today.`,
      };
    }

    const currentRequests = record.request_count || 0;
    if (currentRequests >= DAILY_REQUEST_LIMIT) {
      return {
        allowed: false,
        reason: `Daily request limit exceeded. You've made ${currentRequests}/${DAILY_REQUEST_LIMIT} requests today.`,
      };
    }

    await client.query(
      `UPDATE token_usage 
       SET tokens_used = tokens_used + $1, 
           request_count = request_count + 1,
           last_request = $2,
           rate_limit_count = rate_limit_count + 1
       WHERE user_id = $3`,
      [estimatedTokens, now, userId]
    );

    return { allowed: true };
  } catch (error) {
    console.warn("Database operation failed - allowing request:", error instanceof Error ? error.message : String(error));
    return { allowed: true };
  }
}

export async function getUserUsage(userId: string): Promise<{
  tokensUsed: number;
  tokensRemaining: number;
  requestCount: number;
  requestsRemaining: number;
}> {
  const client = getPool();
  if (!client) {
    return {
      tokensUsed: 0,
      tokensRemaining: DAILY_TOKEN_LIMIT,
      requestCount: 0,
      requestsRemaining: DAILY_REQUEST_LIMIT,
    };
  }

  try {
    await ensureTable();

    const result = await client.query(
      `SELECT tokens_used, request_count, last_reset FROM token_usage WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return {
        tokensUsed: 0,
        tokensRemaining: DAILY_TOKEN_LIMIT,
        requestCount: 0,
        requestsRemaining: DAILY_REQUEST_LIMIT,
      };
    }

    const record = result.rows[0];
    const lastReset = new Date(record.last_reset);
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    if (lastReset < today) {
      return {
        tokensUsed: 0,
        tokensRemaining: DAILY_TOKEN_LIMIT,
        requestCount: 0,
        requestsRemaining: DAILY_REQUEST_LIMIT,
      };
    }

    return {
      tokensUsed: record.tokens_used || 0,
      tokensRemaining: Math.max(0, DAILY_TOKEN_LIMIT - (record.tokens_used || 0)),
      requestCount: record.request_count || 0,
      requestsRemaining: Math.max(0, DAILY_REQUEST_LIMIT - (record.request_count || 0)),
    };
  } catch (error) {
    console.warn("Failed to get user usage:", error instanceof Error ? error.message : String(error));
    return {
      tokensUsed: 0,
      tokensRemaining: DAILY_TOKEN_LIMIT,
      requestCount: 0,
      requestsRemaining: DAILY_REQUEST_LIMIT,
    };
  }
}

