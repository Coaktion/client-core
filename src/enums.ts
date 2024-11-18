/**
 * http response status codes to retry
 * @description http response status codes to retry
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * @see https://www.npmjs.com/package/http-status-codes
 */
export enum HttpStatusCodesRetryCondition {
  Unauthorized = 401,
  RequestTimeout = 408,
  TooEarly = 425,
  TooManyRequests = 429,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  OriginConnectionTimeout = 522,
  ATimeoutOccurred = 524
}

/**
 * http response status codes error not retry
 * @description http response status codes error not retry
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * @see https://www.npmjs.com/package/http-status-codes
 */
export enum HtttpStatusCodeError {
  BadRequest = 400,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  NotImplemented = 501,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511
}

export enum ContentTypes {
  JSON = 'application/json',
  AMZ_JSON_1_1 = 'application/x-amz-json-1.1',
  X_URL_ENCODED = 'application/x-www-form-urlencoded'
}

export const jsonContentTypes = [ContentTypes.JSON, ContentTypes.AMZ_JSON_1_1];
