import "$lib/env.server";
import { json } from "@sveltejs/kit";
import { verify } from "paseto-ts/v4";
import { env } from "$lib/env.server";
import { responseServerError } from "$lib/utils";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Check if the request is to an API endpoint
  const isApiRequest = event.url.pathname.startsWith("/api");

  // Exclude specific token related endpoints
  const isAuthToken = event.url.pathname === "/api/auth/token";
  const isAuthTokenRefresh = event.url.pathname.startsWith("/api/auth/token/refresh");

  // If it's an API request and not one of the excluded endpoints
  if (isApiRequest && !isAuthToken && !isAuthTokenRefresh) {
    let token: string | null | undefined;

    token = event.cookies.get("accessToken");
    token ||= event.request.headers.get("Authorization");
    token ||= event.request.headers.get("x-access-token");
    token = token?.replace?.("Bearer ", "");

    if (!token) {
      return json(responseServerError("Unauthorized"), { status: 401 });
    }

    let verifiedToken: ReturnType<typeof verify> | undefined;

    try {
      verifiedToken = verify(env.ACCESS_TOKEN_PUBLIC_KEY, token);
    } catch (error) {
      return json(responseServerError("Unauthorized"), { status: 401 });
    }

    event.locals.userID = verifiedToken?.payload?.sub;
  }

  return await resolve(event);
};
