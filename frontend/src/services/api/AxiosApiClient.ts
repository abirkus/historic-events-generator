import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { ApiClient } from "./ApiClient";

/**
 * @name AxiosApiClient
 * @description simple http client using axios
 *  this implementation encapsulates Axios while conforming to ApiClient interface, allowing seamless swapping of HTTP clients.
 * some alternatives to this approach are:
 * react query: https://www.npmjs.com/package/@tanstack/react-query
 * axios hooks: https://www.npmjs.com/package/axios-hooks
 * */

export class AxiosApiClient implements ApiClient {
  private httpClient: AxiosInstance;

  constructor(baseURL: string) {
    this.httpClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // For basic API authentication
    // we can use request interceptor to add the token to the headers
    // before the request is sent to the server
    // this.httpClient.interceptors.request.use((config) => {
    //   const token = localStorage.getItem("authToken");
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    //   return config;
    // });

    // Clean way of handling API errors in case API does not provide enough information
    this.httpClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error(
            "API Error:",
            error.response.status,
            error.response.data
          );
          return Promise.reject({
            status: error.response.status,
            message:
              (error.response.data as { message?: string }).message ||
              "An error occurred",
          });
        } else if (error.request) {
          console.error("Network Error:", error.message);
          return Promise.reject({
            message: "Network error, please try again later.",
          });
        } else {
          return Promise.reject({ message: "Unexpected error occurred" });
        }
      }
    );
  }

  async get<T>(url: string, params = {}): Promise<T> {
    const response = await this.httpClient.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await this.httpClient.post<T>(url, body);
    return response.data;
  }

  async put<T>(url: string, body: any): Promise<T> {
    const response = await this.httpClient.put<T>(url, body);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.httpClient.delete<T>(url);
    return response.data;
  }
}
