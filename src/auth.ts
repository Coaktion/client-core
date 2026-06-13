import axios, { AxiosError, AxiosInstance } from 'axios';

import { ContentTypes, jsonContentTypes } from './enums';
import { InvalidAuthOptions, ZendeskRequestError } from './exceptions';
import { AuthBasic } from './interfaces';
import {
  AuthOptions,
  AuthOptionsZendesk,
  ClientCredentialsAuthOptions
} from './types';
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

class BaseOAuth {
  authOptions: ClientCredentialsAuthOptions;
  protected cachedToken: string | null;
  protected expiresAt: number;

  constructor(authOptions: ClientCredentialsAuthOptions) {
    this.authOptions = authOptions;
    this.cachedToken = null;
    this.expiresAt = 0;
  }

  protected get headerKey(): string {
    return this.authOptions.headerKey || 'Authorization';
  }

  /**
   * Returns the cached Bearer header while the token is still valid,
   * with a renewal margin (default 60s) so a token about to expire
   * is not reused. Returns null when a new token must be requested.
   */
  protected getCachedToken(): object | null {
    const renewMargin = this.authOptions.renewMarginMs ?? 60000;
    if (this.cachedToken && Date.now() < this.expiresAt - renewMargin)
      return { [this.headerKey]: 'Bearer ' + this.cachedToken };
    return null;
  }

  protected cacheToken(accessToken: string, expiresIn: number): object {
    this.cachedToken = accessToken;
    this.expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : 0;
    return { [this.headerKey]: 'Bearer ' + accessToken };
  }

  /**
   * Discards the cached token so the next getToken call requests a new
   * one. Called by BaseClient.authentication when a request got a 401.
   */
  invalidateToken(): void {
    this.cachedToken = null;
    this.expiresAt = 0;
  }

  protected tokenPayload(): object {
    return {
      grant_type: 'client_credentials',
      client_id: this.authOptions.clientId,
      client_secret: this.authOptions.clientSecret,
      scope: this.authOptions.scope,
      ...(this.authOptions.expiresIn && {
        expires_in: this.authOptions.expiresIn
      })
    };
  }
}

/**
 * Zendesk OAuth client_credentials provider
 * @description
 * Replaces Zendesk API Token authentication in server-to-server
 * integrations. Requests a token from POST /oauth/tokens (the grant-type
 * endpoint at the root, not the admin /api/v2/oauth/tokens) using
 * clientId + clientSecret, caches it in memory and renews it on demand —
 * client_credentials issues no refresh token.
 *
 * The request shape (JSON body, space-separated scope string, subdomain
 * based url) follows Zendesk's OAuth model, hence the Zendesk suffix.
 * @example
 * const authProvider = new ClientCredentialsAuthZendesk({
 *   subdomain: 'mycompany',
 *   clientId: 'my_integration',
 *   clientSecret: process.env.ZENDESK_CLIENT_SECRET,
 *   scope: 'tickets:read tickets:write'
 * });
 */
export class ClientCredentialsAuthZendesk
  extends BaseOAuth
  implements AuthBasic
{
  client: AxiosInstance;

  constructor(authOptions: ClientCredentialsAuthOptions) {
    super(authOptions);
    if (!authOptions.baseUrl && !authOptions.subdomain)
      throw new InvalidAuthOptions();

    this.client = axios.create({
      baseURL:
        authOptions.baseUrl || `https://${authOptions.subdomain}.zendesk.com`,
      httpsAgent: authOptions.httpsAgent
    });
  }

  async getToken(): Promise<object> {
    const cached = this.getCachedToken();
    if (cached) return cached;

    const response = await this.client.request({
      method: 'post',
      url: this.authOptions.endpoint || '/oauth/tokens',
      data: this.tokenPayload()
    });
    return this.cacheToken(
      response.data.access_token,
      response.data.expires_in
    );
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
