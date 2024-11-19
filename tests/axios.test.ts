import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  AuthProviderNotFound,
  AxiosClient,
  EndpointNotSet,
  InvalidAuthOptions
} from '../src';

const endpoints = {
  create: '/users',
  delete: '/users/{id}',
  fetch: '/users/{id}',
  search: '/users',
  update: '/users/{id}'
};

describe('AxiosClient', () => {
  let clientBasic: AxiosClient;
  let mock: MockAdapter;
  beforeEach(() => {
    clientBasic = new AxiosClient({
      baseURL: 'https://api.example.com/v1',
      authProvider: null,
      endpoints,
      retryDelay: 3,
      timeout: 1000,
      tries: 3,
      rateLimitKey: 'Retry-After',
      forceAuth: false
    });
    mock = new MockAdapter(clientBasic.client);
    jest.useFakeTimers();
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

  it('should calling authentication when calling makeRequest and forceAuth is true', async () => {
    clientBasic.authentication = jest.fn();
    clientBasic.clientOptions.forceAuth = true;
    const data = { id: 1, name: 'test' };
    mock.onGet('/users').reply(200, data);
    await clientBasic.makeRequest({
      method: 'get',
      url: '/users'
    });
    expect(await clientBasic.authentication).toHaveBeenCalled();
  });

  it('should calling authentication when calling makeRequest and retryAuth is true', async () => {
    clientBasic.authentication = jest.fn();
    clientBasic.retryAuth = true;
    const data = { id: 1, name: 'test' };
    mock.onGet('/users').reply(200, data);
    await clientBasic.makeRequest({
      method: 'get',
      url: '/users'
    });
    expect(await clientBasic.authentication).toHaveBeenCalled();
  });

  it('should throw an error when calling makeRequest and not retryCondition', async () => {
    const data = { id: 1, name: 'test' };
    mock.onGet('/users').reply(400, data);
    try {
      await clientBasic.makeRequest({
        method: 'get',
        url: '/users'
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AxiosError);
    }
  });

  it('should throw an error when calling makeRequest and retryCondition', async () => {
    jest.useRealTimers();

    mock.onGet('/users').reply(500);
    clientBasic.clientOptions.tries = 2;
    clientBasic.retryCondition = jest.fn().mockReturnValue(true);
    clientBasic.clientOptions.retryDelay = 0.1;

    try {
      await clientBasic.makeRequest({
        method: 'get',
        url: '/users'
      });
    } catch (error) {
      expect(error.status).toEqual(500);
    }
  });
});
