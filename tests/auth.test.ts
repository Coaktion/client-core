import MockAdapter from 'axios-mock-adapter';

import { AuthApiKey, BasicAuth, BearerAuth } from '../src/auth';

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
