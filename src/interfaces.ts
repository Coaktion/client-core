import { AxiosInstance } from 'axios';

import { AuthOptions } from './types';

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
