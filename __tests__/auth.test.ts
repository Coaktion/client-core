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

  it('BearerAuth', () => {
    const auth = new BearerAuth({
      baseUrl: 'http://localhost',
      endpoint: '/auth'
    });
    expect(auth).toBeInstanceOf(BearerAuth);
  });
});
