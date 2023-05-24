/**
 * ClientOptions type
 * @description Type for ClientOptions
 * @typedef ClientOptions
 * @property {string} [appName] - The name of the app using the client
 * @property {any} [authProvider] - The auth provider to use for authentication
 * @property {number} [timeout] - Timeout for requests
 * @property {number} [tries] - The number of times to retry before failing
 * @property {number} [retryDelay] - The number of seconds to wait between retries
 * @property {string} [rateLimitKey] - The key to use for rate limiting
 * @property {Endpoints} [endpoints] - The endpoints to use for the client
 * @example
 * import { ClientOptions } from './types';
 *
 * const clientOptions: ClientOptions = {
 *  appName: 'my-app',
 *  authProvider: new AuthProvider(),
 *  timeout: 10000,
 *  tries: 3,
 *  retryDelay: 10,
 *  rateLimitKey: 'Retry-After',
 *  endpoints: {
 *    search: 'resources/',
 *    fetch: 'resources/:id/',
 *    create: 'resources/',
 *    update: 'resources/:id/',
 *    delete: 'resources/:id/',
 *  }
 * }
 */
export type ClientOptions = {
  appName: string;
  authProvider?: any;
  forceAuth?: boolean;
  timeout?: number;
  tries?: number;
  retryDelay?: number;
  rateLimitKey?: string;
  endpoints?: Endpoints;
};

export type ClientOptionsZendesk = ClientOptions & {
  secure?: boolean;
  client: any;
};

export type ClientOptionsAxios = ClientOptions & {
  baseURL: string;
};

/**
 * Endpoints type
 * @description Type for Endpoints
 * @typedef Endpoints
 * @property {string} [search] - The endpoint to use for searching
 * @property {string} [fetch] - The endpoint to use for fetching
 * @property {string} [create] - The endpoint to use for creating
 * @property {string} [update] - The endpoint to use for updating
 * @property {string} [delete] - The endpoint to use for deleting
 * @example
 * import { Endpoints } from './types';
 *
 * const endpoints: Endpoints = {
 *   search: 'resources/',
 *   fetch: 'resources/:id/',
 *   create: 'resources/',
 *   update: 'resources/:id/',
 *   delete: 'resources/:id/',
 * }
 */
export type Endpoints = {
  search?: string;
  fetch?: string;
  create?: string;
  update?: string;
  delete?: string;
};

/**
 * DataOptions type
 * @description Type for DataOptions
 * @typedef DataOptions
 * @property {object} [data] - The data to use for the request
 * @property {object} [params] - The query params to use for the request
 * @example
 * import { DataOptions } from './types';
 *
 * const dataOptions: DataOptions = {
 *   data: { name: 'John Doe' },
 *   params: { name: 'John Doe' }
 * }
 */
export type DataOptions = {
  data?: object;
  params?: object;
};

/**
 * BearerAuthOptions type
 * @description Type for BearerAuthOptions
 * @typedef BearerAuthOptions
 * @property {object} [data] - The data to use for the request
 * @property {object} [params] - The query params to use for the request
 * @example
 * import { BearerAuthOptions } from './types';
 *
 * const bearerAuthOptions: BearerAuthOptions = {
 *   data: { name: 'John Doe' },
 *   params: { name: 'John Doe' }
 * }
 */
export type BearerAuthOptions = {
  data?: object;
  params?: object;
};

/**
 * AuthOptions type
 * @description Type for AuthOptions
 * @typedef AuthOptions
 * @property {string} [baseUrl] - The base url to use for the request
 * @property {string} [endpoint] - The endpoint to use for the request
 * @property {string} [headerKey] - The header key to use for the request
 * @property {string} [apiKey] - The api key to use for the request
 * @property {string} [username] - The username to use for the request
 * @property {string} [password] - The password to use for the request
 * @property {BearerAuthOptions} [bearer] - The bearer auth options to use for the request
 * @example
 * import { AuthOptions } from './types';
 *
 * const authOptions: AuthOptions = {
 *   baseUrl: 'https://api.example.com',
 *   endpoint: '/auth',
 *   headerKey: 'Authorization',
 *   apiKey: '123',
 *   username: 'john',
 *   password: 'abc',
 *   bearer: {
 *     data: { username: 'john', password: 'doe' },
 *     params: { grant_type: 'password' }
 *   }
 * }
 */
export type AuthOptions = {
  baseUrl?: string;
  endpoint?: string;
  headerKey?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  bearer?: BearerAuthOptions;
};

export type PayloadRequestZendesk = {
  url: string;
  method: string;
  pathParams?: object;
  queryParams?: object;
  data?: object;
  options?: object;
  headers?: object;
  retryCount?: number;
};

export type ModalProps = {
  modalName: string;
  modalUrl: string;
  size: {
    width: string;
    height: string;
  };
};
