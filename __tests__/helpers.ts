import { NextRequest } from "next/server";

/**
 * Create a NextRequest for testing API routes.
 */
export function makeRequest(
  url: string,
  options?: { method?: string; body?: string; headers?: Record<string, string>; cookies?: Record<string, string> }
): NextRequest {
  const { method = "GET", body, headers = {}, cookies = {} } = options || {};

  const reqHeaders = new Headers(headers);
  // Add cookies as header
  const cookieStr = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  if (cookieStr) reqHeaders.set("cookie", cookieStr);

  const init: any = { method, headers: reqHeaders };
  if (body) init.body = body;

  return new NextRequest(new URL(url, "http://localhost:3000"), init);
}
