import Cookie from "js-cookie";
import axios from "axios";
import axiosRetry from "axios-retry";
import { ALREADY_AUTHENTICATED_COOKIE_NAME } from "$lib/constants";
import { singleflightGetToken, singleflightRefreshToken } from "$lib/apis/authApi";

const theAxios = axios.create({
  baseURL: "/",
  paramsSerializer: {
    indexes: null,
  },
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

theAxios.interceptors.request.use(async (config) => {
  const isAuthenticated = Cookie.get(ALREADY_AUTHENTICATED_COOKIE_NAME) === "true";

  if (!isAuthenticated) {
    await singleflightGetToken();
  }

  return config;
});

axiosRetry(theAxios, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: async (error) => {
    const isAuthToken = error.config?.url === "/api/auth/token";
    const isAuthTokenRefresh = error.config?.url?.startsWith?.("/api/auth/token/refresh");

    if (isAuthToken || isAuthTokenRefresh) {
      return axiosRetry.isNetworkError(error) || error.code === "ECONNABORTED";
    }

    if (error.response?.status !== 401) {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED";
    }

    const refreshTokenData = await singleflightRefreshToken();

    if (!refreshTokenData?.data?.accessToken) return false;

    return true;
  },
});

export { theAxios };
