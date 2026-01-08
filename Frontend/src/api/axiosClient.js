import axios from "axios";

/**
 * Shared Axios client configured for the backend API.
 * Use this instead of creating new axios instances to inherit interceptors and base URL.
 * @module api/axiosClient
 * @category API
 */
const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: { Accept: "application/json" },
});
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isCancel?.(error) ||               
      error?.code === "ERR_CANCELED" ||
      error?.name === "CanceledError" ||
      error?.message === "canceled"
    ) {
      return Promise.reject(error);
    }

    console.error("API Error:", {
      message: error.message,
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method,
    });

    return Promise.reject(error);
  }
);

export default axiosClient;
