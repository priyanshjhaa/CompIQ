import { auth, assertNeonAuthConfigured } from "@/lib/auth/server";

const handlers = auth.handler();

function withAuthConfig<T extends (...args: Parameters<T>) => ReturnType<T>>(handler: T): T {
  return ((...args: Parameters<T>) => {
    assertNeonAuthConfigured();
    return handler(...args);
  }) as T;
}

export const GET = withAuthConfig(handlers.GET);
export const POST = withAuthConfig(handlers.POST);
export const PUT = withAuthConfig(handlers.PUT);
export const PATCH = withAuthConfig(handlers.PATCH);
export const DELETE = withAuthConfig(handlers.DELETE);
