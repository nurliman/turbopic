import { json } from "@sveltejs/kit";
import { responseServer, responseServerError } from "$lib/utils";
import type { RequestHandler } from "./$types";
import type { TokenCheckResponse } from "$lib/types";

export const GET = (({ locals }) => {
  if (!locals.userID) {
    return json(responseServerError("Unauthorized"), { status: 401 });
  }

  return json(
    responseServer<TokenCheckResponse>({
      userID: locals.userID,
      isAuthenticated: true,
    }),
  );
}) satisfies RequestHandler;
