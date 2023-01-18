/**
 * http response status codes to retry
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * @see https://www.npmjs.com/package/http-status-codes
 */
export enum HttpStatusErrorCodes {
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