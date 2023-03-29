import { converterPathParamsUrl, queryParamsUrl } from '../src/utils';

describe('queryParamsUrl', () => {
  it.each([
    [
      '/api/users',
      { firstName: 'John', lastName: 'Doe' },
      '/api/users?firstName=John&lastName=Doe'
    ],
    [
      '/api/users',
      { firstName: 'John', lastName: '' },
      '/api/users?firstName=John&lastName='
    ],
    ['/api/users', {}, '/api/users']
  ])('should add query parameters to the URL', (url, params, expected) => {
    const result = queryParamsUrl(url, params);

    expect(result).toEqual(expected);
  });
});

describe('converterPathParamsUrl', () => {
  it.each([
    [
      '/api/users/{userId}/posts/{postId}',
      { userId: 123, postId: 'abc' },
      '/api/users/123/posts/abc'
    ],
    ['/api/users', { userId: 123 }, '/api/users'],
    [
      '/api/users/{userId}/posts/{postId}',
      { userId: 123 },
      '/api/users/123/posts/{postId}'
    ]
  ])(
    'should convert path parameters to their corresponding values',
    (url, params, expected) => {
      const result = converterPathParamsUrl(url, params);

      expect(result).toEqual(expected);
    }
  );
});
