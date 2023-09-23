import axios from "axios";
import { theAxios } from "$lib/theAxios";
import { theSingleflight } from "$lib/theSingleflight";
import type { Credentials, ResponseServer, TokenCheckResponse } from "$lib/types";

export const getToken = async () => {
  const response = await axios.post<ResponseServer<Credentials>>("/api/auth/token");
  return response.data;
};

export const refreshToken = async (refreshTokenStr?: string) => {
  const response = await theAxios.post<ResponseServer<Credentials>>("/api/auth/token/refresh", {
    refreshToken: refreshTokenStr,
  });
  return response.data;
};

export const checkToken = async () => {
  const response = await theAxios.get<ResponseServer<TokenCheckResponse>>("/api/auth/token/check");
  return response.data;
};

export const singleflightGetToken = () => {
  return theSingleflight.do("getToken", getToken);
};

export const singleflightRefreshToken = (refreshTokenStr?: string) => {
  return theSingleflight.do("refreshToken", () => refreshToken(refreshTokenStr));
};

export const singleflightCheckToken = () => {
  return theSingleflight.do("checkToken", checkToken);
};
