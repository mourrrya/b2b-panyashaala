import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

export const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or custom headers here if needed
    return config;
  },
  (error) => {
    console.error("[Axios] Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response) {
      const { status, data } = error.response;

      // Map HTTP status codes to user-friendly messages
      const errorMessages: Record<number, string> = {
        [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
        [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.AUTH.ACCESS_DENIED,
        [HTTP_STATUS.NOT_FOUND]: "Resource not found",
        [HTTP_STATUS.UNPROCESSABLE_ENTITY]:
          data?.error || ERROR_MESSAGES.VALIDATION.VALIDATION_FAILED,
      };

      error.message =
        data?.error ||
        data?.message ||
        errorMessages[status] ||
        ERROR_MESSAGES.GENERIC ||
        "An error occurred";
    } else if (error.request) {
      error.message = ERROR_MESSAGES.NETWORK || "Network error";
    }

    return Promise.reject(error);
  },
);

// =============================================================================
// TYPED API METHODS
// =============================================================================

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then((res) => res.data),
};

// =============================================================================
// SWR FETCHER (uses axios instance)
// =============================================================================

export const swrFetcher = <T>(url: string): Promise<T> => apiClient.get<T>(url);
