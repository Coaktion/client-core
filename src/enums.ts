/**
 * http response status codes to retry
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * @see https://www.npmjs.com/package/http-status-codes
 */
export enum HttpStatusCodesRetryCondition {
  /**
   * The request timed out
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
   */
  RequestTimeout = 408,
  /**
   * The request too early
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425
   */
  TooEarly = 425,
  /**
   * The request is rate limited
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429
   */
  TooManyRequests = 429,
  /**
   * The internal server error
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
   */
  InternalServerError = 500,
  /**
   * The server bad gateway
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
   */
  BadGateway = 502,
  /**
   * The server is unavailable
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
   */
  ServiceUnavailable = 503,
  /**
   * The server gateway timeout
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
   */
  GatewayTimeout = 504,
  /**
   * The origin connection timeout
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/522
   */
  OriginConnectionTimeout = 522,
  /**
   * The server timeout
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/524
   */
  ATimeoutOccurred = 524
}

export enum HtttpStatusCodeError {
  BadRequest = 400,
  Unauthorized = 401,
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
