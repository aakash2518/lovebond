type EnvKey =
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_STORAGE_BUCKET"
  | "VITE_FIREBASE_MESSAGING_SENDER_ID"
  | "VITE_FIREBASE_APP_ID"
  | "VITE_SUPABASE_URL"
  | "VITE_SUPABASE_PUBLISHABLE_KEY";

function readEnv(key: EnvKey): string | undefined {
  // Vite exposes env vars on import.meta.env at build/runtime
  return (import.meta.env as Record<string, string | undefined>)[key];
}

export function optionalEnv(key: EnvKey): string | undefined {
  const value = readEnv(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function requireEnv(key: EnvKey): string {
  const value = optionalEnv(key);
  if (value) return value;

  // Keep message actionable for both local dev and CI
  throw new Error(
    [
      `Missing required environment variable: ${key}`,
      `Add it to your .env / .env.production (must start with VITE_) and rebuild.`,
    ].join("\n"),
  );
}

