export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL ?? "models/gemini-1.5-flash-002",
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  vectorStore: {
    url: process.env.VECTOR_DB_URL,
    apiKey: process.env.VECTOR_DB_KEY,
    provider: process.env.VECTOR_DB_PROVIDER,
  },
};


