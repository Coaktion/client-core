import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { AuthOptions, ClientOptions, DataOptions } from './types';

/**
 * AuthBasic interface
 * @description Interface for AuthBasic
 * @interface AuthBasic
 * @property {AuthOptions} authOptions - AuthOptions
 * @property {AxiosInstance} client - AxiosInstance
 * @property {Function} getToken - getToken
 * @returns {Promise<object>} - Promise
 * @example
 * import { AuthBasic } from './interfaces';
 * import { AuthOptions } from './types';
 *
 * export class AuthApiKey implements AuthBasic {
 *   authOptions: AuthOptions;
 *   constructor(authOptions: AuthOptions) {
 *     this.authOptions = authOptions;
 *   }
 *
 *   async getToken(): Promise<object> {
 *     const response = {};
 *     const key = this.authOptions.header
 *     response[key] = this.authOptions.apiKey;
 *     return response;
 *   }
 * }
 */
export interface AuthBasic {
  authOptions: AuthOptions;
  client?: AxiosInstance;
  getToken(): Promise<object>;
}

export interface ClientBasicInterface {
  clientOptions: ClientOptions;
  client: AxiosInstance;
  auth: object;
  makeRequest(
    methodName: string,
    endpoint: string,
    dataOptions?: DataOptions,
    headers?: object
  ): Promise<AxiosResponse>;
  retryDelay(retryCount: number, error: AxiosError): number;
  retryCondition(error: AxiosError): boolean;
  authentication(): object;
  search(params?: object): Promise<AxiosResponse>;
  fetch(id: string): Promise<AxiosResponse>;
  create(data: object): Promise<AxiosResponse>;
  update(id: string, data: object): Promise<AxiosResponse>;
  delete(id: string): Promise<AxiosResponse>;
}
