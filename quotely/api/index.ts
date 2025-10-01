import axios from "axios";
import {
  getRefreshTokenFromStorage,
  setTokens,
} from "../lib/auth/token-storage";
import { apiUrl } from "../constants";

const AUTH_BASE_URL = `${apiUrl}/auth"`;

export const refreshAuthToken = async () => {
  const refreshToken = await getRefreshTokenFromStorage();
  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  try {
    const response = await axios.get(AUTH_BASE_URL, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const newAccessToken = response.data.data.accessToken;

    await setTokens(newAccessToken, refreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("Refresh failed. User needs to re-authenticate.");
    throw error;
  }
};
