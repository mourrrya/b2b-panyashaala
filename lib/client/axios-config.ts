import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          break;
        case 403:
          // Show access denied
          break;
        case 404:
          // Show not found
          break;
        case 422:
          // Handle validation errors
          break;
        default:
        // Generic error
      }

      error.message = data.error || "Something went wrong";
    } else {
      error.message = "Network error";
    }
  }
);
