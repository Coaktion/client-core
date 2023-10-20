import axios, { AxiosError, AxiosInstance } from 'axios';

import { ZendeskRequestError } from './exceptions';
import { AuthBasic } from './interfaces';
import { AuthOptions, AuthOptionsZendesk } from './types';
import { getNestedProperty } from './utils';

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
        auth: {
          username: this.authOptions.username,
          password: this.authOptions.password
        },
        data: this.authOptions.bearer.data,
        params: this.authOptions.bearer.params || {},
        headers: this.authOptions.bearer.headers || {}
      });
      return 'Bearer ' + response.data.access_token;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
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

export class BearerAuthZendesk implements AuthBasic {
  authOptions: AuthOptionsZendesk;
  client: any;

  constructor(authOptions: AuthOptionsZendesk) {
    this.authOptions = authOptions;
    this.client = authOptions.zafClient;
  }

  async getBearerToken(): Promise<string> {
    try {
      const response = await this.client.request({
        type: 'POST',
        url: `${this.authOptions.baseUrl}${this.authOptions.endpoint}`,
        secure: this.authOptions.secure || false,
        dataType: this.authOptions.dataType || 'json',
        httpCompleteResponse: true,
        contentType:
          this.authOptions.contentType || 'application/x-www-form-urlencoded',
        data: JSON.stringify(this.authOptions.bearer.data),
        headers: this.authOptions.bearer.headers || {},
        timeout: this.authOptions.timeout || 5000
      });
      return (
        'Bearer ' +
        (this.authOptions.bearerTokenProperty
          ? getNestedProperty(
              response.responseJSON,
              this.authOptions.bearerTokenProperty
            )
          : response.responseJSON.access_token)
      );
    } catch (error) {
      const instanceError = new ZendeskRequestError({
        status: error.status,
        message: error.responseJSON.message
      });

      throw instanceError.response;
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
