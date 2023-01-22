import axios, { AxiosError, AxiosInstance } from 'axios';

import { AuthBasic } from './interfaces';
import { AuthOptions } from './types';

export class AuthApiKey implements AuthBasic {
  authOptions: AuthOptions;
  constructor(authOptions: AuthOptions) {
    this.authOptions = authOptions;
  }

  async getToken(): Promise<object> {
    const response = {};
    const key = this.authOptions.headerKey || 'Authorization';
    response[key] = this.authOptions.apiKey;
    return response;
  }
}

export class BasicAuth implements AuthBasic {
  authOptions: AuthOptions;
  constructor(authOptions: AuthOptions) {
    this.authOptions = authOptions;
  }

  async getToken(): Promise<object> {
    const response = {};
    const key = this.authOptions.headerKey || 'Authorization';
    response[key] =
      'Basic ' +
      Buffer.from(
        this.authOptions.username + ':' + this.authOptions.password
      ).toString('base64');
    return response;
  }
}

export class BearerAuth implements AuthBasic {
  authOptions: AuthOptions;
  client: AxiosInstance;
  constructor(authOptions: AuthOptions) {
    this.authOptions = authOptions;
    this.client = axios.create({
      baseURL: this.authOptions.baseUrl
    });
  }

  async getBearerToken(): Promise<string> {
    try {
      const response = await this.client.request({
        method: 'post',
        url: this.authOptions.endpoint,
        data: this.authOptions.bearer.data || {},
        params: this.authOptions.bearer.params || {}
      });
      return 'Bearer ' + response.data.access_token;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async getToken(): Promise<object> {
    const response = {};
    const key = this.authOptions.headerKey || 'Authorization';
    response[key] = 'Bearer ' + this.authOptions.apiKey;
    if (this.authOptions.endpoint) {
      response[key] = await this.getBearerToken();
    }

    return response;
  }
}
