import { Context, MiddlewareHandler, Next } from "hono";

export default async function CustomLogger(
  context: Context,
  next: Next
): Promise<void> {
  await next();
  console.log(
    `${context.req.method.toUpperCase()} ${context.req.url} -> ${
      context.res.status
    }`
  );
}
