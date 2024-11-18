import axios, { AxiosError, AxiosInstance } from 'axios';

import { ContentTypes, jsonContentTypes } from './enums';
import { ZendeskRequestError } from './exceptions';
import { AuthBasic } from './interfaces';
import { AuthOptions, AuthOptionsZendesk } from './types';
import { getHeaderContentType, getNestedProperty } from './utils';

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

class BaseBearerAuth {
  authOptions: AuthOptions | AuthOptionsZendesk;
  constructor(authOptions: AuthOptions | AuthOptionsZendesk) {
    this.authOptions = authOptions;
  }

  async getBearerToken(response: any) {
    return (
      'Bearer ' +
      (this.authOptions.bearerTokenProperty
        ? getNestedProperty(response, this.authOptions.bearerTokenProperty)
        : response.access_token)
    );
  }
}

export class BearerAuth extends BaseBearerAuth implements AuthBasic {
  authOptions: AuthOptions;
  client: AxiosInstance;

  constructor(authOptions: AuthOptions) {
    super(authOptions);
    this.authOptions = authOptions;
    this.client = axios.create({
      baseURL: this.authOptions.baseUrl,
      httpsAgent: this.authOptions.httpsAgent
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
      return super.getBearerToken(response.data);
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

export class BearerAuthZendesk extends BaseBearerAuth implements AuthBasic {
  authOptions: AuthOptionsZendesk;
  client: any;

  constructor(authOptions: AuthOptionsZendesk) {
    super(authOptions);
    this.authOptions = authOptions;
    this.client = authOptions.zafClient;
  }

  async getBearerToken(): Promise<string> {
    try {
      const contentType =
        getHeaderContentType(this.authOptions.bearer.headers) ||
        this.authOptions.contentType;

      const response = await this.client.request({
        type: 'POST',
        url: `${this.authOptions.baseUrl}${this.authOptions.endpoint}`,
        secure: this.authOptions.secure || false,
        dataType: this.authOptions.dataType || 'json',
        httpCompleteResponse: true,
        contentType: contentType || ContentTypes.X_URL_ENCODED,
        data: jsonContentTypes.includes(contentType as ContentTypes)
          ? JSON.stringify(this.authOptions.bearer.data)
          : this.authOptions.bearer.data,
        headers: this.authOptions.bearer.headers || {},
        timeout: this.authOptions.timeout || 5000
      });
      return super.getBearerToken(response.responseJSON);
    } catch (error) {
      const instanceError = new ZendeskRequestError({
        status: error.status,
        message: error.responseJSON.message ? error.responseJSON.message : null
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
