import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

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

  async getBearerToken(response: AxiosResponse | AxiosError): Promise<string> {
    if (response instanceof AxiosError) {
      throw response;
    }
    return 'Bearer ' + response.data.access_token;
  }

  async getToken(): Promise<object> {
    const response = {};
    const key = this.authOptions.headerKey || 'Authorization';
    if (this.authOptions.endpoint) {
      const responseToken = await this.client.request({
        method: 'post',
        url: this.authOptions.endpoint,
        data: this.authOptions.bearer.data || {},
        params: this.authOptions.bearer.params || {}
      });

      response[key] = await this.getBearerToken(responseToken);
      return response;
    }

    response[key] = 'Bearer ' + this.authOptions.apiKey;
    return response;
  }
}
