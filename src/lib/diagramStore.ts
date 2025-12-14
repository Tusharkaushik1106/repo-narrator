import { Pool } from "pg";
import { config } from "@/lib/config";
import type { DiagramPayload } from "./diagramCache";

const databaseUrl = config.database.url;
let pool: Pool | null = null;
let tableReadyPromise: Promise<void> | null = null;

function getPool(): Pool | null {
  if (!databaseUrl) {
    return null;
  }
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

async function ensureTable(): Promise<void> {
  const client = getPool();
  if (!client) return;
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagram_cache (
        user_id text NOT NULL,
        repo_owner text NOT NULL,
        repo_name text NOT NULL,
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT diagram_cache_pk PRIMARY KEY (user_id, repo_owner, repo_name)
      );
    `);
  } catch (error) {
    console.warn("Failed to ensure diagram_cache table:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

async function ensureReady() {
  if (!tableReadyPromise) {
    tableReadyPromise = ensureTable().catch((error) => {
      tableReadyPromise = null;
      throw error;
    });
  }
  return tableReadyPromise;
}

export async function fetchDiagram(
  userId: string,
  owner: string,
  name: string
): Promise<DiagramPayload | undefined> {
  const client = getPool();
  if (!client) return undefined;

  try {
    await ensureReady();

    const result = await client.query(
      `SELECT payload FROM diagram_cache WHERE user_id = $1 AND repo_owner = $2 AND repo_name = $3 LIMIT 1`,
      [userId, owner, name]
    );

    return result.rows?.[0]?.payload as DiagramPayload | undefined;
  } catch (error) {
    console.warn("Failed to fetch diagram from database:", error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

export async function saveDiagram(
  userId: string,
  owner: string,
  name: string,
  payload: DiagramPayload
): Promise<void> {
  const client = getPool();
  if (!client) return;

  try {
    await ensureReady();

    await client.query(
      `
      INSERT INTO diagram_cache (user_id, repo_owner, repo_name, payload)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, repo_owner, repo_name)
      DO UPDATE SET payload = EXCLUDED.payload, updated_at = now();
    `,
      [userId, owner, name, payload]
    );
  } catch (error) {
    console.warn("Failed to save diagram to database:", error instanceof Error ? error.message : String(error));
  }
}

