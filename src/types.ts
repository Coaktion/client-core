export type ClientOptions = {
  /**
   * The name of the app using the client
   * @type {string}
   * @memberof clientOptions
   * @default 'unknown'
   * @example 'my-app'
   */
  appName: string;
  /**
   * The auth provider to use for authentication
   * @type {any}
   * @memberof clientOptions
   * @default null
   * @example new AuthProvider()
   */
  authProvider?: any;
  /**
   * Timeout for requests
   * @type {number}
   * @memberof clientOptions
   * @default 10000
   * @example 10000
   * @example 0
   */
  timeout?: number;
  /**
   * The number of times to retry before failing
   * @type {number}
   * @memberof clientOptions
   * @default 3
   * @example 3
   * @example 0
   */
  tries?: number;
  /**
   * The number of seconds to wait between retries
   * @type {number}
   * @memberof clientOptions
   * @default 3
   * @example 10
   */
  retryDelay?: number;
  /**
   * The key to use for rate limiting
   * @type {string}
   * @memberof clientOptions
   * @default 'Retry-After'
   */
  rateLimitKey?: string;
  /**
   * The endpoints to use for the client
   * @type {Endpoints}
   * @memberof clientOptions
   * @default {}
   * @example { search: '/resources', fetch: '/resources/:id' }
   * @example { search: '/resources', fetch: '/resources/:id', create: '/resources', update: '/resources/:id', delete: '/resources/:id' }
   */
  endpoints?: Endpoints;
};

export const defaultClientOptions: ClientOptions = {
  appName: 'unknown',
  timeout: 10000,
  tries: 3,
  retryDelay: 3,
  rateLimitKey: 'Retry-After',
  endpoints: {}
};

export type Endpoints = {
  /**
   * The endpoint to use for searching
   * @type {string}
   * @memberof Endpoints
   * @default null
   * @example '/resources'
   */
  search?: string;
  /**
   * The endpoint to use for fetching
   * @type {string}
   * @memberof Endpoints
   * @default null
   * @example '/resources/:id'
   */
  fetch?: string;
  /**
   * The endpoint to use for creating
   * @type {string}
   * @memberof Endpoints
   * @default null
   * @example '/resources'
   */
  create?: string;
  /**
   * The endpoint to use for updating
   * @type {string}
   * @memberof Endpoints
   * @default null
   * @example '/resources/:id'
   */
  update?: string;
  /**
   * The endpoint to use for deleting
   * @type {string}
   * @memberof Endpoints
   * @default null
   * @example '/resources/:id'
   */
  delete?: string;
};

export type DataOptions = {
  /**
   * The data to use for the request
   * @type {object}
   * @memberof DataOptions
   * @default {}
   * @example { name: 'John Doe' }
   */
  data?: object;
  /**
   * The query params to use for the request
   * @type {object}
   * @memberof DataOptions
   * @default {}
   * @example { name: 'John Doe' }
   */
  params?: object;
};

export type BearerAuthOptions = {
  data?: object;
  params?: object;
};

export type AuthOptions = {
  baseUrl?: string;
  endpoint?: string;
  headerKey?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  bearer?: BearerAuthOptions;
};
