import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          break;
        case HTTP_STATUS.FORBIDDEN:
          // Show access denied
          break;
        case HTTP_STATUS.NOT_FOUND:
          // Show not found
          break;
        case HTTP_STATUS.UNPROCESSABLE_ENTITY:
          // Handle validation errors
          break;
        default:
        // Generic error
      }

      error.message = data.error || ERROR_MESSAGES.GENERIC;
    } else {
      error.message = ERROR_MESSAGES.NETWORK;
    }
  },
);
