import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  AuthProviderNotFound,
  ClientBasic,
  EndpointNotSet,
  HttpStatusCodesRetryCondition,
  HtttpStatusCodeError,
  InvalidAuthOptions
} from '../src';

const statusCodeRetry = Object.values(HttpStatusCodesRetryCondition).filter(
  (code) => typeof code === 'number'
);
const statusCodeError = Object.values(HtttpStatusCodeError).filter(
  (code) => typeof code === 'number'
);

const endpoints = {
  create: '/users',
  delete: '/users/:id',
  fetch: '/users/:id',
  search: '/users',
  update: '/users/:id'
};

describe('ClientBasic', () => {
  let clientBasic: ClientBasic;
  let mock: MockAdapter;
  beforeEach(() => {
    clientBasic = new ClientBasic('https://api.example.com/v1', {
      appName: 'example',
      authProvider: null,
      endpoints,
      retryDelay: 3,
      timeout: 3000,
      tries: 3,
      rateLimitKey: 'Retry-After',
      forceAuth: false
    });
    mock = new MockAdapter(clientBasic.client);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should receive the list of objects when calling search', async () => {
    const data = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' }
    ];
    mock.onGet('/users').reply(200, data);
    const response = await clientBasic.search();
    expect(response.data).toEqual(data);
  });

  it.each(['search', 'fetch', 'create', 'update', 'delete'])(
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

  it('should receive the object when calling fetch', async () => {
    const data = { id: 1, name: 'test' };
    mock.onGet('/users/1').reply(200, data);
    const response = await clientBasic.fetch('1');
    expect(response.data).toEqual(data);
  });

  it('should receive the object when calling create', async () => {
    const data = { id: 1, name: 'test' };
    const status = 201;
    mock.onPost('/users').reply(status, data);
    const response = await clientBasic.create(data);
    expect(response.data).toEqual(data);
    expect(response.status).toEqual(status);
  });

  it('should receive the object when calling update', async () => {
    const data = { id: 1, name: 'test' };
    const status = 200;
    mock.onPut('/users/1').reply(status, data);
    const response = await clientBasic.update('1', data);
    expect(response.data).toEqual(data);
    expect(response.status).toEqual(status);
  });

  it('should receive the object when calling delete', async () => {
    const data = { id: 1, name: 'test' };
    const status = 200;
    mock.onDelete('/users/1').reply(status, data);
    const response = await clientBasic.delete('1');
    expect(response.data).toEqual(data);
    expect(response.status).toEqual(status);
  });

  it.each(statusCodeRetry)(
    'should return true when calling retryCondition %i',
    async (code) => {
      clientBasic.authentication = jest.fn();
      const axiosError = {
        config: {},
        response: {
          status: code
        }
      } as AxiosError;
      expect(clientBasic.retryCondition(axiosError)).toBeTruthy();
      if (code === 401) {
        expect(clientBasic.authentication).toHaveBeenCalled();
      }
    }
  );

  it.each(statusCodeError)(
    'should return false when calling retryCondition %i',
    async (code) => {
      const axiosError = {
        config: {},
        response: {
          status: code
        }
      } as AxiosError;
      expect(clientBasic.retryCondition(axiosError)).toBeFalsy();
    }
  );

  it.each([
    ['too many request', 429, 10],
    ['other', 500, 3000]
  ])(
    'should return %s delay value when calling retryDelay',
    (_type, code, expected) => {
      const axiosError = {
        message: 'Too Many Requests',
        code: 'TOO_MANY_REQUESTS',
        config: {},
        response: {
          data: {
            message: 'Too Many Requests'
          },
          status: code,
          statusText: 'Too Many Requests',
          headers: { 'Retry-After': '10' } as object
        }
      } as AxiosError;
      const response = clientBasic.retryDelay(1, axiosError);
      expect(response).toEqual(expected);
    }
  );

  it('should throw an AxiosError when calling retryDelay with an invalid status code', () => {
    const axiosError = new AxiosError();
    try {
      clientBasic.retryDelay(10, axiosError);
    } catch (error) {
      expect(error).toBeInstanceOf(AxiosError);
    }
  });

  it('should throw an AuthProviderNotFound when calling authentication and authProvider is null', () => {
    clientBasic.clientOptions.authProvider = null;
    try {
      clientBasic.authentication();
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
      clientBasic.authentication();
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
    await clientBasic.authentication();
    expect(clientBasic.auth).toEqual(dataAuth);
    clientBasic.clientOptions.authProvider = null;
  });

  it('should calling authentication when calling makeRequest and forceAuth is true', async () => {
    clientBasic.authentication = jest.fn();
    clientBasic.clientOptions.forceAuth = true;
    const data = { id: 1, name: 'test' };
    mock.onGet('/users').reply(200, data);
    await clientBasic.makeRequest('get', '/users');
    expect(clientBasic.authentication).toHaveBeenCalled();
  });
});
