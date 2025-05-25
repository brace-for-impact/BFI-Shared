import axios, { AxiosInstance } from 'axios';

interface ServiceClientOptions {
  baseURL: string;
  timeout?: number;
  contentType?:string,
  headers?: Record<string, string>;
}

export default function createAxiosInstance(options: ServiceClientOptions): AxiosInstance {
  return axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout || 5000,
    headers: {
      'Content-Type': options.contentType || 'application/json',
      ...options.headers,
    },
  });
}
