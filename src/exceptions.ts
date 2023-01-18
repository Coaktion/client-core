/**
 * EndpointNotSet Error
 * @description
 * This error is thrown when an endpoint is not set
 * @class EndpointNotSet
 * @extends {Error}
 * @example
 * throw new EndpointNotSet('fetch');
 * // => EndpointNotSet: fetch endpoint is not defined
 */
class EndpointNotSet extends Error {
	constructor(endpoint: string) {
		const message = `${endpoint} endpoint is not defined`;
		super(message);
		this.name = 'EndpointNotSet';
	}
}

export { EndpointNotSet };
