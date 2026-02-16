import { ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants";
import { API_CONFIG } from "@/lib/constants/routes";
import { addBreadcrumb, captureException } from "@/lib/sentry";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// =============================================================================
// AXIOS INSTANCE CONFIGURATION
// =============================================================================

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

api.interceptors.request.use(
  (config) => {
    addBreadcrumb(`${config.method?.toUpperCase()} ${config.url}`, "http", "info", {
      method: config.method,
      url: config.url,
    });
    return config;
  },
  (error) => {
    captureException(error, {
      tags: { layer: "axios", phase: "request" },
    });
    return Promise.reject(error);
  },
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

/** Status codes that are expected client errors — don't spam Sentry with these. */
const SILENT_STATUS_CODES = new Set([
  HTTP_STATUS.BAD_REQUEST,
  HTTP_STATUS.NOT_FOUND,
  HTTP_STATUS.UNPROCESSABLE_ENTITY,
  HTTP_STATUS.CONFLICT,
]);

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

      // Report server errors (5xx) and auth failures to Sentry
      const shouldReport =
        status >= 500 || status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN;

      if (shouldReport) {
        captureException(error, {
          level: status >= 500 ? "error" : "warning",
          tags: {
            layer: "axios",
            "http.status_code": String(status),
            "http.url": error.config?.url ?? "unknown",
          },
          extra: {
            method: error.config?.method,
            url: error.config?.url,
            responseData: data,
          },
        });
      }
    } else if (error.request) {
      // Network error — no response at all
      error.message = ERROR_MESSAGES.NETWORK || "Network error";
      captureException(error, {
        level: "warning",
        tags: { layer: "axios", errorClass: "network" },
        extra: { url: error.config?.url, method: error.config?.method },
      });
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
