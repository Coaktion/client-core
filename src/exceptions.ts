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
export class EndpointNotSet extends Error {
  constructor(endpoint: string) {
    const message = `${endpoint} endpoint is not defined`;
    super(message);
    this.name = 'EndpointNotSet';
  }
}

export class InvalidAuthOptions extends Error {
  constructor() {
    const message = 'Invalid auth options';
    super(message);
    this.name = 'InvalidAuthOptions';
  }
}

export class AuthProviderNotFound extends Error {
  constructor() {
    const message = 'Auth provider not found';
    super(message);
    this.name = 'AuthProviderNotFound';
  }
}

export class ZendeskRequestError extends Error {
  response: object;
  constructor(message: object) {
    super(JSON.stringify(message));
    this.name = 'ZendeskRequestError';
    this.response = message;
  }
}
