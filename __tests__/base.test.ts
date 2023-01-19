import { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  ClientBasic,
  EndpointNotSet,
  HttpStatusCodesRetryCondition,
  HtttpStatusCodeError
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

const clientBasic = new ClientBasic('https://api.example.com/v1', {
  appName: 'example',
  authProvider: null,
  endpoints,
  retryDelay: 3,
  timeout: 3000,
  tries: 3
});
const mock = new MockAdapter(clientBasic.client);

describe('ClientBasic', () => {
  it('should receive the list of objects when calling search', async () => {
    const data = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' }
    ];
    mock.onGet('/users').reply(200, data);
    const response = await clientBasic.search();
    expect(response.data).toEqual(data);
  });

  it.each([['search'], ['fetch'], ['create'], ['update'], ['delete']])(
    'should throw an error when calling search with an calling %s',
    async (action: string) => {
      try {
        clientBasic.clientOptions.endpoints = {};
        await clientBasic[action]();
      } catch (error) {
        expect(error).toBeInstanceOf(EndpointNotSet);
        expect(error.message).toEqual(`${action} endpoint is not defined`);
      } finally {
        clientBasic.clientOptions.endpoints = endpoints;
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
    mock.onPost('/users').reply(200, data);
    const response = await clientBasic.makeRequest('post', '/users');
    expect(response.data).toEqual(data);
  });

  it('should throw an error when calling search with an calling create', async () => {
    try {
      clientBasic.clientOptions.endpoints = {};
      await clientBasic.create({ id: 1, name: 'test' });
    } catch (error) {
      expect(error.message).toEqual('create endpoint is not defined');
    } finally {
      clientBasic.clientOptions.endpoints = endpoints;
    }
  });

  it('should receive the object when calling update', async () => {
    const data = { id: 1, name: 'test' };
    mock.onPut('/users/1').reply(200, data);
    const response = await clientBasic.update('1', data);
    expect(response.data).toEqual(data);
  });

  it('should receive the object when calling delete', async () => {
    const data = { id: 1, name: 'test' };
    mock.onDelete('/users/1').reply(200, data);
    const response = await clientBasic.delete('1');
    expect(response.data).toEqual(data);
  });

  it.each(statusCodeRetry)(
    'should return true when calling retryCondition %i',
    async (code) => {
      const axiosError = {
        config: {},
        response: {
          status: code
        }
      } as AxiosError;
      expect(clientBasic.retryCondition(axiosError)).toBeTruthy();
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

  it('should return false when calling retryCondition', async () => {
    const axiosError = {
      config: {},
      response: {
        status: 200
      }
    } as AxiosError;

    expect(clientBasic.retryCondition(axiosError)).toBeFalsy();
  });
});
