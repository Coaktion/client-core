import MockAdapter from 'axios-mock-adapter';

import {
  AuthApiKey,
  BasicAuth,
  BearerAuth,
  BearerAuthZendesk
} from '../src/auth';
import { ContentTypes } from '../src/enums';

const mockZendeskClient = {
  request: jest.fn()
};

describe('Auth', () => {
  it('AuthApiKey', async () => {
    const auth = new AuthApiKey({ apiKey: '123' });
    expect(auth).toBeInstanceOf(AuthApiKey);
    expect(auth.authOptions.apiKey).toBe('123');
    expect(auth.authOptions.headerKey).toBeUndefined();
    expect(await auth.getToken()).toEqual({ Authorization: '123' });
  });

  it('BasicAuth', async () => {
    const auth = new BasicAuth({
      username: 'foo',
      password: 'bar'
    });
    expect(auth).toBeInstanceOf(BasicAuth);
    expect(auth.authOptions.username).toBe('foo');
    expect(auth.authOptions.password).toBe('bar');
    expect(auth.authOptions.headerKey).toBeUndefined();
    expect(await auth.getToken()).toEqual({
      Authorization:
        'Basic ' +
        Buffer.from(
          auth.authOptions.username + ':' + auth.authOptions.password
        ).toString('base64')
    });
  });
});

describe('BearerAuth', () => {
  it('should return bearer token request server auth when calling getToken', async () => {
    const auth = new BearerAuth({
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      headerKey: 'Authorization',
      bearer: {
        data: {},
        params: {},
        headers: {
          Authorization: 'Basic 123'
        }
      }
    });
    const mock = new MockAdapter(auth.client);
    mock.onPost('/auth').reply(200, { access_token: 'abc' });
    expect(auth).toBeInstanceOf(BearerAuth);
    expect(auth.authOptions.baseUrl).toBe('http://localhost');
    expect(auth.authOptions.endpoint).toBe('/auth');
    expect(auth.authOptions.bearer?.headers).toEqual({
      Authorization: 'Basic 123'
    });
    expect(await auth.getToken()).toEqual({ Authorization: 'Bearer abc' });
  });

  it('should return bearer token request server auth if bearerTokenProperty is present', async () => {
    const auth = new BearerAuth({
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      headerKey: 'Authorization',
      bearerTokenProperty: 'test.real_token',
      bearer: {
        data: {},
        params: {},
        headers: {
          Authorization: 'Basic 123'
        }
      }
    });
    const mock = new MockAdapter(auth.client);
    mock.onPost('/auth').reply(200, { test: { real_token: 'abc' } });
    expect(auth).toBeInstanceOf(BearerAuth);
    expect(auth.authOptions.baseUrl).toBe('http://localhost');
    expect(auth.authOptions.endpoint).toBe('/auth');
    expect(auth.authOptions.bearer?.headers).toEqual({
      Authorization: 'Basic 123'
    });
    expect(await auth.getToken()).toEqual({ Authorization: 'Bearer abc' });
  });

  it('should throw AxiosError when calling getToken', async () => {
    const auth = new BearerAuth({
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      bearer: {
        data: {}
      }
    });
    const mock = new MockAdapter(auth.client);
    mock.onPost('/auth').reply(500, { error: 'error' });
    expect(auth).toBeInstanceOf(BearerAuth);
    expect(auth.authOptions.baseUrl).toBe('http://localhost');
    expect(auth.authOptions.endpoint).toBe('/auth');
    try {
      await auth.getToken();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Request failed with status code 500');
    }
  });

  it('should return bearer token apiKey when calling getToken', async () => {
    const auth = new BearerAuth({
      apiKey: '123'
    });
    expect(auth).toBeInstanceOf(BearerAuth);
    expect(auth.authOptions.apiKey).toBe('123');
    expect(await auth.getToken()).toEqual({ Authorization: 'Bearer 123' });
  });
});

describe('BearerAuthZendesk', () => {
  it('should return bearer token request server auth when calling getToken', async () => {
    mockZendeskClient.request.mockResolvedValueOnce({
      responseJSON: { access_token: 'sampleToken' }
    });

    const auth = new BearerAuthZendesk({
      zafClient: mockZendeskClient,
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      bearer: {
        headers: {
          Authorization: 'Basic 123'
        }
      },
      timeout: 1000
    });
    expect(auth).toBeInstanceOf(BearerAuthZendesk);
    expect(auth.authOptions.baseUrl).toBe('http://localhost');
    expect(auth.authOptions.endpoint).toBe('/auth');
    expect(auth.authOptions.timeout).toBe(1000);
    expect(auth.authOptions.bearer?.headers).toEqual({
      Authorization: 'Basic 123'
    });
    expect(await auth.getToken()).toEqual({
      Authorization: 'Bearer sampleToken'
    });
  });

  it('should throw ZendeskRequestError error on fail', async () => {
    mockZendeskClient.request.mockRejectedValueOnce({
      status: 400,
      responseJSON: { message: 'Request failed' }
    });

    const auth = new BearerAuthZendesk({
      zafClient: mockZendeskClient,
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      bearer: {
        headers: {
          Authorization: 'Basic 123'
        }
      }
    });
    try {
      await auth.getToken();
    } catch (error) {
      expect(error.message).toEqual('Request failed');
    }
  });

  it('should throw ZendeskRequestError error on fail when doesnt have a default error message attribute name', async () => {
    mockZendeskClient.request.mockRejectedValueOnce({
      status: 400,
      responseJSON: { msg: 'Request failed' }
    });

    const auth = new BearerAuthZendesk({
      zafClient: mockZendeskClient,
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      bearer: {
        headers: {
          Authorization: 'Basic 123'
        }
      }
    });
    try {
      await auth.getToken();
    } catch (error) {
      expect(error.message).toEqual(null);
    }
  });

  it('should  call getNestedProperty correctly calling getToken', async () => {
    mockZendeskClient.request.mockResolvedValueOnce({
      responseJSON: { test: { real_token: 'sampleToken' } }
    });

    const auth = new BearerAuthZendesk({
      zafClient: mockZendeskClient,
      baseUrl: 'http://localhost',
      endpoint: '/auth',
      bearer: {
        data: {}
      },
      bearerTokenProperty: 'test.real_token'
    });
    expect(await auth.getToken()).toEqual({
      Authorization: 'Bearer sampleToken'
    });
  });
});

it('should format data correctly based on content type header is JSON', async () => {
  const mockZendeskClient = {
    request: jest.fn(() => {
      return { responseJSON: { test: { real_token: 'sampleToken' } } };
    })
  };

  const auth = new BearerAuthZendesk({
    zafClient: mockZendeskClient,
    baseUrl: 'http://localhost',
    endpoint: '/auth',
    bearer: {
      data: { content: ['content'] },
      headers: {
        'content-type': ContentTypes.JSON
      }
    },
    bearerTokenProperty: 'test.real_token'
  });

  await auth.getBearerToken();

  expect(mockZendeskClient.request).toBeCalledWith(
    expect.objectContaining({
      data: JSON.stringify({ content: ['content'] }),
      headers: {
        'content-type': ContentTypes.JSON
      }
    })
  );
});

it('should format data correctly based on content type header is NOT json', async () => {
  const mockZendeskClient = {
    request: jest.fn(() => {
      return { responseJSON: { test: { real_token: 'sampleToken' } } };
    })
  };

  const auth = new BearerAuthZendesk({
    zafClient: mockZendeskClient,
    baseUrl: 'http://localhost',
    endpoint: '/auth',
    bearer: {
      data: { content: ['content'] },
      headers: {
        'content-type': ContentTypes.X_URL_ENCODED
      }
    },
    bearerTokenProperty: 'test.real_token'
  });

  await auth.getBearerToken();

  expect(mockZendeskClient.request).toBeCalledWith(
    expect.objectContaining({
      data: { content: ['content'] },
      headers: { 'content-type': ContentTypes.X_URL_ENCODED }
    })
  );
});
