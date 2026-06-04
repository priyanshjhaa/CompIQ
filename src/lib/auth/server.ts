import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

export const isNeonAuthConfigured = Boolean(
  baseUrl && cookieSecret && cookieSecret.length >= 32,
);

export const neonAuthMissingMessage =
  "Neon Auth is not configured. Add NEON_AUTH_BASE_URL and a 32+ character NEON_AUTH_COOKIE_SECRET.";

export const auth = createNeonAuth({
  baseUrl: baseUrl || "https://auth-not-configured.invalid",
  cookies: {
    secret: cookieSecret && cookieSecret.length >= 32 ? cookieSecret : "compiq-neon-auth-dev-placeholder-32",
    sessionDataTtl: 300,
  },
});

export function assertNeonAuthConfigured() {
  if (!isNeonAuthConfigured) {
    throw new Error(neonAuthMissingMessage);
  }
}
