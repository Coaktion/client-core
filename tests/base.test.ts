import { AxiosError, AxiosHeaders } from 'axios';

import {
  AuthProviderNotFound,
  BaseClient,
  EndpointNotSet,
  HttpStatusCodesRetryCondition,
  InvalidAuthOptions
} from '../src';

const endpoints = {
  create: '/users',
  delete: '/users/{id}',
  fetch: '/users/{id}',
  searchAllPages: '/users',
  search: '/users',
  update: '/users/{id}'
};
describe('BaseClient', () => {
  let clientBasic: BaseClient;
  let clientBasicWithDefaultHeader: BaseClient;

  beforeEach(() => {
    const baseParams = { authProvider: null, endpoints };
    clientBasic = new BaseClient(baseParams);
    clientBasicWithDefaultHeader = new BaseClient({
      ...baseParams,
      defaultHeaders: { 'X-Header': 'test' }
    });
    clientBasicWithDefaultHeader.makeRequest = jest.fn();
    jest.useFakeTimers();
  });

  it.each([
    [3, undefined],
    [0, 0],
    [3, 3]
  ])('default retryDelay shoud be %i when defined %o', (expected, value) => {
    const client = new BaseClient({
      authProvider: null,
      endpoints,
      retryDelay: value,
      tries: 3,
      rateLimitKey: 'Retry-After',
      forceAuth: false
    });

    expect(client.clientOptions.retryDelay).toBe(expected);
  });

  it.each([
    [0, undefined],
    [0, 0],
    [3, 3]
  ])('default tries shoud be %i when defined %o', (expected, value) => {
    const client = new BaseClient({
      authProvider: null,
      endpoints,
      tries: value,
      rateLimitKey: 'Retry-After',
      forceAuth: false
    });

    expect(client.clientOptions.tries).toBe(expected);
  });

  it.each([
    [5000, undefined],
    [5000, 0],
    [1000, 1000]
  ])('default timeout shoud be %i when defined %o', (expected, value) => {
    const client = new BaseClient({
      authProvider: null,
      endpoints,
      retryDelay: 3,
      tries: 3,
      rateLimitKey: 'Retry-After',
      forceAuth: false,
      timeout: value
    });

    expect(client.clientOptions.timeout).toBe(expected);
  });

  it.each(['search', 'searchAllPages', 'fetch', 'create', 'update', 'delete'])(
    'should throw an error when calling search with an calling %s',
    async (action: string) => {
      try {
        clientBasic.clientOptions.endpoints = {};
        await clientBasic[action]();
      } catch (error) {
        expect(error).toBeInstanceOf(EndpointNotSet);
        expect(error.message).toEqual(`${action} endpoint is not defined`);
      }
    }
  );

  it('should call makeRequest when throwing an error', async () => {
    try {
      await clientBasic.makeRequest(null);
    } catch (error) {
      expect(error.message).toEqual('Method not implemented.');
    }
  });

  it('should receive the object when calling fetch', async () => {
    clientBasic.makeRequest = jest.fn();
    await clientBasic.fetch('1');
    expect(clientBasic.makeRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/1'
    });
  });

  it('should receive the object when calling create', async () => {
    clientBasic.makeRequest = jest.fn();
    const data = { id: 1, name: 'test' };
    await clientBasic.create(data);
    expect(clientBasic.makeRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/users',
      data
    });
  });

  it('should receive the object when calling update', async () => {
    clientBasic.makeRequest = jest.fn();
    const data = { id: 1, name: 'test' };
    await clientBasic.update('1', data);
    expect(clientBasic.makeRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/users/1',
      data
    });
  });

  it('should receive the object when calling delete', async () => {
    clientBasic.makeRequest = jest.fn();
    await clientBasic.delete('1');
    expect(clientBasic.makeRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/users/1'
    });
  });

  it('should throw an AuthProviderNotFound when calling authentication and authProvider is null', async () => {
    clientBasic.clientOptions.authProvider = null;
    try {
      await clientBasic.authentication();
    } catch (error) {
      expect(error).toBeInstanceOf(AuthProviderNotFound);
      expect(error.message).toEqual('Auth provider not found');
    }
  });

  it('should throw an InvalidAuthOptions when calling authtentication and getToken is error', async () => {
    clientBasic.clientOptions.authProvider = {
      getToken: () => {
        throw new InvalidAuthOptions();
      }
    };
    try {
      await clientBasic.authentication();
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidAuthOptions);
      expect(error.message).toEqual('Invalid auth options');
    }
  });

  it('must save authentication parameters in auth property when calling authentication', async () => {
    const dataAuth = { Authorization: 'Bearer token' };
    clientBasic.clientOptions.authProvider = {
      getToken: async () => {
        return dataAuth;
      }
    };
    await await clientBasic.authentication();
    expect(clientBasic.auth).toEqual(dataAuth);
    clientBasic.clientOptions.authProvider = null;
  });

  it('should return early with fullFetched as false if there is an error in the makeRequest', async () => {
    clientBasic.makeRequest = jest.fn();
    (clientBasic.makeRequest as jest.Mock).mockRejectedValue(
      new Error('Failed Request')
    );

    const result = await clientBasic.searchAllPages({
      strategy: 'cursor',
      paginationConfigs: { recordProperty: 'data' },
      params: {}
    });

    expect(result).toEqual({
      dataFetched: [],
      fullFetched: false
    });
  });

  it('should continue fetching while hasMore is true', async () => {
    clientBasic.makeRequest = jest.fn();
    (clientBasic.makeRequest as jest.Mock)
      .mockResolvedValueOnce({ someData: 'someData', links: { next: 'next' } })
      .mockResolvedValueOnce({ someData: 'someData2' });

    const result = await clientBasic.searchAllPages({
      strategy: 'cursor',
      paginationConfigs: {
        recordProperty: 'someData',
        nextEndpoint: true,
        cursorEndpointProperty: 'links.next'
      },
      params: {}
    });

    expect(result.fullFetched).toBe(true);
    expect(result.dataFetched).toEqual(['someData', 'someData2']);
  });

  it('should continue fetching while hasMore is true and data return responseJSON', async () => {
    clientBasic.makeRequest = jest.fn();
    (clientBasic.makeRequest as jest.Mock)
      .mockResolvedValueOnce({
        responseJSON: { someData: 'someData', links: { next: 'next' } }
      })
      .mockResolvedValueOnce({ responseJSON: { someData: 'someData2' } });

    const result = await clientBasic.searchAllPages({
      strategy: 'cursor',
      paginationConfigs: {
        recordProperty: 'someData',
        nextEndpoint: true,
        cursorEndpointProperty: 'links.next'
      },
      params: {}
    });

    expect(result.fullFetched).toBe(true);
    expect(result.dataFetched).toEqual(['someData', 'someData2']);
  });

  it('should call fetch with default header', async () => {
    await clientBasicWithDefaultHeader.fetch('1');
    expect(clientBasicWithDefaultHeader.makeRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/1',
      headers: { 'X-Header': 'test' }
    });
  });

  it('should call search with default header', async () => {
    await clientBasicWithDefaultHeader.search({ test: '1' });
    expect(clientBasicWithDefaultHeader.makeRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users',
      params: { test: '1' },
      headers: { 'X-Header': 'test' }
    });
  });

  it('should call create with default header', async () => {
    const data = { id: 1, name: 'test' };
    await clientBasicWithDefaultHeader.create(data);
    expect(clientBasicWithDefaultHeader.makeRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/users',
      data,
      headers: { 'X-Header': 'test' }
    });
  });

  it('should call update with default header', async () => {
    const data = { id: 1, name: 'test' };
    await clientBasicWithDefaultHeader.update('1', data);
    expect(clientBasicWithDefaultHeader.makeRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/users/1',
      data,
      headers: { 'X-Header': 'test' }
    });
  });

  it('should call delete with default header', async () => {
    await clientBasicWithDefaultHeader.delete('1');
    expect(clientBasicWithDefaultHeader.makeRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/users/1',
      headers: { 'X-Header': 'test' }
    });
  });

  it('should call searchAllPages with default header', async () => {
    (
      clientBasicWithDefaultHeader.makeRequest as jest.Mock
    ).mockResolvedValueOnce({ someData: 'someData' });
    await clientBasicWithDefaultHeader.searchAllPages({
      strategy: 'cursor',
      paginationConfigs: {
        recordProperty: 'someData',
        nextEndpoint: true,
        cursorEndpointProperty: 'links.next'
      },
      params: {}
    });

    expect(clientBasicWithDefaultHeader.makeRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users',
      params: {},
      headers: { 'X-Header': 'test' }
    });
  });
});
describe('BaseClient retryCondition', () => {
  let client: BaseClient;

  beforeEach(() => {
    const baseParams = { authProvider: null, endpoints };
    client = new BaseClient(baseParams);
  });

  it('should not response if error is undefined', () => {
    const result = client.retryCondition(undefined);
    expect(result).toBe(true);
  });

  it('should set retryAuth to true if error status is Unauthorized', () => {
    const error = {
      response: { status: HttpStatusCodesRetryCondition.Unauthorized }
    };
    const result = client.retryCondition(error);
    expect(client.retryAuth).toBe(true);
    expect(result).toBe(true);
  });

  it('should return true if error status is in HttpStatusCodesRetryCondition', () => {
    const error = {
      response: { status: HttpStatusCodesRetryCondition.TooManyRequests }
    };
    const result = client.retryCondition(error);
    expect(result).toBe(true);
  });

  it('should return false if error status is not in HttpStatusCodesRetryCondition', () => {
    const error = { response: { status: 418 } }; // I'm a teapot
    const result = client.retryCondition(error);
    expect(result).toBe(false);
  });

  it('should return true if error status is undefined and default to RequestTimeout', () => {
    const error = { response: {} };
    const result = client.retryCondition(error);
    expect(result).toBe(true);
  });
});

describe('BaseClient retryDelay', () => {
  let client: BaseClient;
  let axiosError: AxiosError;
  const axiosResponse = {
    status: HttpStatusCodesRetryCondition.TooManyRequests,
    statusText: 'Too Many Requests',
    headers: new AxiosHeaders({
      'retry-after': 3
    }),
    data: {},
    config: {
      headers: new AxiosHeaders({
        'retry-after': 3
      })
    }
  };

  beforeEach(() => {
    const baseParams = { authProvider: null, endpoints };
    client = new BaseClient(baseParams);
    axiosError = new AxiosError(
      'Request failed with status code 500',
      '500',
      undefined,
      undefined,
      axiosResponse
    );
  });

  it('should throw error if retryCount exceeds tries', async () => {
    client.clientOptions.tries = 3;
    try {
      await client.retryDelay(3, axiosError);
    } catch (error) {
      expect(error).toEqual(axiosError);
    }
  });

  it('should throw error with not AxiosError', async () => {
    client.clientOptions.tries = 3;
    const throwError = new Error('error');
    try {
      await client.retryDelay(3, throwError);
    } catch (error) {
      expect(error).toEqual(throwError);
    }
  });

  it('should return rate limit delay if error status is TooManyRequests', () => {
    client.clientOptions.tries = 3;
    client.clientOptions.rateLimitKey = 'retry-after';
    expect(client.retryDelay(1, axiosError)).toBe(3000);
  });

  it('should return retryDelay if error status is TooManyRequests but no rateLimitKey', () => {
    client.clientOptions.tries = 3;
    client.clientOptions.rateLimitKey = 'other-key';
    client.clientOptions.retryDelay = 5;
    expect(client.retryDelay(1, axiosError)).toBe(5000);
  });

  it('should return retryDelay if error status is not TooManyRequests', () => {
    client.clientOptions.tries = 3;
    if (axiosError.response) {
      axiosError.response.status = 500;
    }
    expect(client.retryDelay(1, axiosError)).toBe(3000);
  });

  it('should throw error if retryCount exceeds tries with non-AxiosError', () => {
    client.clientOptions.tries = 3;
    const error = new Error('error');
    expect(() => client.retryDelay(3, error)).toThrow(error);
  });

  it('should return retryDelay if error is undefined', () => {
    client.clientOptions.tries = 3;
    expect(client.retryDelay(1, undefined)).toBe(3000);
  });
});
