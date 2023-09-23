import { json } from "@sveltejs/kit";
import { sign, verify } from "paseto-ts/v4";
import { nanoid } from "nanoid";
import { env } from "$lib/env.server";
import { theSeconds } from "$lib/theSeconds";
import { responseServer, responseServerError } from "$lib/utils";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ALREADY_AUTHENTICATED_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "$lib/constants";
import type { Credentials } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST = (({ cookies }) => {
  try {
    let guestID: string;

    // try to get the guestID from the refreshToken if it exists
    const oldRefreshToken = cookies.get(REFRESH_TOKEN_COOKIE_NAME);
    if (oldRefreshToken) {
      let verifiedRefreshToken: ReturnType<typeof verify> | undefined;

      try {
        verifiedRefreshToken = verify(env.REFRESH_TOKEN_PUBLIC_KEY, oldRefreshToken);
      } catch (error) {
        return json(responseServerError("Unauthorized"), { status: 401 });
      }

      guestID = verifiedRefreshToken?.payload?.sub!;
    }

    guestID ||= nanoid();

    const accessToken = sign(env.ACCESS_TOKEN_SECRET_KEY, {
      sub: guestID,
      name: "Guest",
      exp: env.ACCESS_TOKEN_EXPIRATION,
    });
    const refreshToken = sign(env.REFRESH_TOKEN_SECRET_KEY, {
      sub: guestID,
      name: "Guest",
      exp: env.REFRESH_TOKEN_EXPIRATION,
    });

    cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: theSeconds(env.ACCESS_TOKEN_EXPIRATION),
    });

    cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: theSeconds(env.REFRESH_TOKEN_EXPIRATION),
    });

    cookies.set(ALREADY_AUTHENTICATED_COOKIE_NAME, "true", {
      path: "/",
      httpOnly: false,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: theSeconds(env.REFRESH_TOKEN_EXPIRATION),
    });

    return json(
      responseServer<Credentials>({
        accessToken,
        refreshToken,
      }),
    );
  } catch (error) {
    console.error(error);
    return json(responseServerError("Something went wrong"), { status: 500 });
  }
}) satisfies RequestHandler;
