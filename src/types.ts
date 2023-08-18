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
 * @property {string} [searchAllPages] - The endpoint to use for searching all pages
 * @property {string} [fetch] - The endpoint to use for fetching
 * @property {string} [create] - The endpoint to use for creating
 * @property {string} [update] - The endpoint to use for updating
 * @property {string} [delete] - The endpoint to use for deleting
 * @example
 * import { Endpoints } from './types';
 *
 * const endpoints: Endpoints = {
 *   search: 'resources/',
 *   searchAllPages: 'resources/',
 *   fetch: 'resources/:id/',
 *   create: 'resources/',
 *   update: 'resources/:id/',
 *   delete: 'resources/:id/',
 * }
 */
export type Endpoints = {
  search?: string;
  searchAllPages?: string;
  fetch?: string;
  create?: string;
  update?: string;
  delete?: string;
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

/**
 * Payload type
 * @description Type for Payload Request Base
 * @typedef Payload
 * @property {string} url - The url to use for the request
 * @property {string} method - The method to use for the request
 * @property {object} [headers] - The headers to use for the request
 * @property {object} [params] - The query params to use for the request
 * @property {object|string} [data] - The data to use for the request
 * @example
 * import { Payload } from './types';
 * const payload: Payload = {
 *  url: 'https://api.example.com',
 *  method: 'GET',
 *  headers: { 'Content-Type': 'application/json' },
 *  params: { name: 'John Doe' }
 * }
 */

export type Payload = {
  url: string;
  method: string;
  headers?: object;
  params?: object;
  data?: object | string;
};

/**
 * PayloadRequestZendesk type
 * @description Type for Payload Request Zendesk
 * @typedef PayloadRequestZendesk
 * @property {Payload} [payload] - The payload to use for the request
 * @property {object} [pathParams] - The path params to use for the request
 * @property {string} [contentType] - The content type to use for the request
 * @property {object} [options] - The options to use for the request
 * @property {number} [retryCount] - The retry count to use for the request
 */

export type PayloadRequestZendesk = Payload & {
  pathParams?: object;
  contentType?: string;
  options?: object;
  retryCount?: number;
};

/**
 * Zendesk ModalProps type
 * @description Type for Zendesk ModalProps
 * @typedef ModalProps
 * @property {string} modalName - The name of the Zendesk modal
 * @property {string} modalUrl - The url of the Zendesk modal
 * @property {object} size - The size of the Zendesk modal
 * @property {string} size.width - The width of the Zendesk modal
 * @property {string} size.height - The height of the Zendesk modal
 */

export type ModalProps = {
  modalName: string;
  modalUrl: string;
  size: {
    width: string;
    height: string;
  };
};

/**
 * PaginationConfigs type
 * @description Type for PaginationConfigs
 * @typedef PaginationConfigs
 * @property {boolean} [nextEndpoint] - The next endpoint to use for the request
 * @property {boolean} [nextCursor] - The next cursor to use for the request
 * @property {string} [cursorEndpointProperty] - The cursor endpoint property to use for the request
 * @property {string} recordProperty - The record property to use for the request
 */

export type PaginationConfigs = {
  nextEndpoint?: boolean;
  nextCursor?: boolean;
  cursorEndpointProperty?: string;
  recordProperty: string;
};

/**
 * SearchAllPagesProps type
 * @description Type for SearchAllPagesProps
 * @typedef SearchAllPagesProps
 * @property {string} strategy - The strategy to use for the request. 'cursor' | 'page' | 'offset'
 * @property {PaginationConfigs} [paginationConfigs] - The pagination configs to use for the request
 * @property {object} [params] - The params to use for the request
 */

export type SearchAllPagesProps = {
  strategy: 'cursor' | 'page' | 'offset';
  paginationConfigs?: PaginationConfigs;
  params?: any;
};

/**
 * SearchAllPagesResponse type
 * @description Type for SearchAllPagesResponse
 * @typedef SearchAllPagesResponse
 * @property {any[]} dataFetched - The data fetched to use for the request
 * @property {boolean} fullFetched - The full fetched to use for the request
 */

export type SearchAllPagesResponse = {
  dataFetched: any[];
  fullFetched: boolean;
};

/**
 * SearchAllStrategyProps type
 * @description Type for SearchAllStrategyProps
 * @typedef SearchAllStrategyProps
 * @property {any} data - The data to use for the request
 * @property {PaginationConfigs} paginationConfigs - The pagination configs to use for the request
 * @property {object} params - The params to use for the request
 * @property {string} recordProperty - The record property to use for the request
 * @property {string} endpoint - The endpoint to use for the request
 */

export type SearchAllStrategyProps = {
  data: any;
  paginationConfigs: PaginationConfigs;
  params: any;
  recordProperty: any;
  endpoint: string;
};

/**
 * SearchAllStrategyReturn type
 * @description Type for SearchAllStrategyReturn
 * @typedef SearchAllStrategyReturn
 * @property {string} endpoint - The endpoint to use for the request
 * @property {boolean} hasMore - The has more to use for the request
 * @property {object} paramsAux - The params aux to use for the request
 */

export type SearchAllStrategyReturn = {
  endpoint: string;
  hasMore: boolean;
  paramsAux: any;
};
