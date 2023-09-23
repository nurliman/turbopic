import { json } from "@sveltejs/kit";
import { sign, verify } from "paseto-ts/v4";
import { nanoid } from "nanoid";
import { env } from "$lib/env.server";
import { responseServer, responseServerError } from "$lib/utils";
import type { Credentials } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST = (async ({ cookies, request }) => {
  try {
    const requestBody = await request.json().catch(() => {});

    let refreshToken: string | undefined;
    refreshToken = cookies.get("refreshToken");
    refreshToken ||= requestBody?.refreshToken;

    if (!refreshToken) {
      return json(responseServerError("refreshToken is required"), { status: 400 });
    }

    let verifiedRefreshToken: ReturnType<typeof verify> | undefined;

    try {
      verifiedRefreshToken = verify(env.REFRESH_TOKEN_PUBLIC_KEY, refreshToken);
    } catch (error) {
      return json(responseServerError("refreshToken is not valid"), { status: 400 });
    }

    const guestID = verifiedRefreshToken?.payload?.sub || nanoid();

    const newAccessToken = sign(env.ACCESS_TOKEN_SECRET_KEY, {
      sub: guestID,
      name: "Guest",
      exp: env.ACCESS_TOKEN_EXPIRATION,
    });
    const newRefreshToken = sign(env.REFRESH_TOKEN_SECRET_KEY, {
      sub: guestID,
      name: "Guest",
      exp: env.REFRESH_TOKEN_EXPIRATION,
    });

    cookies.set("accessToken", newAccessToken, {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    cookies.set("refreshToken", newRefreshToken, {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return json(
      responseServer<Credentials>({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }),
    );
  } catch (error) {
    console.error(error);
    return json(responseServerError("Something went wrong"), { status: 500 });
  }
}) satisfies RequestHandler;
