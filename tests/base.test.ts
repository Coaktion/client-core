import {
  AuthProviderNotFound,
  BaseClient,
  EndpointNotSet,
  InvalidAuthOptions
} from '../src';

describe('BaseClient', () => {
  const endpoints = {
    create: '/users',
    delete: '/users/{id}',
    fetch: '/users/{id}',
    searchAllPages: '/users',
    search: '/users',
    update: '/users/{id}'
  };
  let clientBasic: BaseClient;

  beforeEach(() => {
    clientBasic = new BaseClient({
      authProvider: null,
      endpoints
    });
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

  it('should throw with error response if exists on retryDelay', async () => {
    try {
      clientBasic.retryDelay(1, {
        response: { status: 500, message: 'requestError' }
      });
    } catch (error) {
      expect(error).toEqual({ status: 500, message: 'requestError' });
    }
  });
});
