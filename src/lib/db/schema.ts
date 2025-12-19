import { Pool } from "pg";
import { config } from "@/lib/config";

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const databaseUrl = config.database.url;
  if (!databaseUrl) return null;
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

export async function ensureSummaryCacheTable(existingPool?: Pool | null): Promise<void> {
  const client = existingPool ?? getDbPool();
  if (!client) return;

  await client.query(`
    CREATE TABLE IF NOT EXISTS summary_cache (
      file_hash text PRIMARY KEY,
      summary_markdown text,
      diagram_code text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

