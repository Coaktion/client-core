import { ContentTypes } from '../src/enums';
import {
  converterPathParamsUrl,
  cursorStrategy,
  getHeaderContentType,
  getNestedProperty,
  getStrategies,
  offsetStrategy,
  pageStrategy,
  queryParamsUrl
} from '../src/utils';

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
    ['/api/users', {}, '/api/users'],
    ['https://localhost/api/users', {}, 'https://localhost/api/users'],
    [
      'https://localhost/api/users',
      { limit: 25, next: true },
      'https://localhost/api/users?limit=25&next=true'
    ]
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

// describe('sleep', () => {
//   it('should resolve the promise after the specified time', async () => {
//     const start = Date.now();
//     const ms = 100;

//     await sleep(ms);

//     const end = Date.now();
//     const elapsed = end - start;

//     // Checks if the elapsed time is close to the specified time
//     expect(elapsed).toBeGreaterThanOrEqual(ms);
//     expect(elapsed).toBeLessThanOrEqual(ms + 10);
//   });
// });

describe('getNestedProperty', () => {
  it('should retrieve a top-level property', () => {
    const obj = { a: 1 };
    expect(getNestedProperty(obj, 'a')).toBe(1);
  });

  it('should retrieve a nested property', () => {
    const obj = { a: { b: { c: 2 } } };
    expect(getNestedProperty(obj, 'a.b.c')).toBe(2);
  });

  it('should return undefined if the path does not exist', () => {
    const obj = { a: 1 };
    expect(getNestedProperty(obj, 'a.b.c')).toBeUndefined();
  });

  it('should handle non-object inputs gracefully', () => {
    expect(getNestedProperty(null, 'a.b.c')).toBeUndefined();
    expect(getNestedProperty(undefined, 'a.b.c')).toBeUndefined();
    expect(getNestedProperty(12345, 'a.b.c')).toBeUndefined();
  });
});

describe('cursorStrategy', () => {
  it('should return original endpoint and set hasMore to false if no cursorProperty is found', () => {
    const expectedEndpoint = '/api/users';
    const result = cursorStrategy({
      data: { someData: 'value' },
      paginationConfigs: { recordProperty: 'records' },
      params: { someParam: 'value' },
      endpoint: expectedEndpoint,
      recordProperty: 'records'
    });

    expect(result).toEqual({
      endpoint: expectedEndpoint,
      hasMore: false,
      paramsAux: { someParam: 'value' }
    });
  });

  it('should set the endpoint as cursorProperty if nextEndpoint is present', () => {
    const result = cursorStrategy({
      data: { cursor: 'next_endpoint_value' },
      paginationConfigs: {
        nextEndpoint: true,
        cursorEndpointProperty: 'cursor',
        recordProperty: 'records'
      },
      params: {},
      endpoint: '',
      recordProperty: 'records'
    });

    expect(result.endpoint).toBe('next_endpoint_value');
    expect(result.hasMore).toBe(true);
    expect(result.paramsAux).toBe(null);
  });

  it('should add cursor to paramsAux if nextCursor is present and cursorProperty exists', () => {
    const result = cursorStrategy({
      data: { cursor: 'next_cursor_value' },
      paginationConfigs: {
        nextCursor: true,
        cursorEndpointProperty: 'cursor',
        recordProperty: 'records'
      },
      params: { existingParam: 'value' },
      endpoint: '',
      recordProperty: 'records'
    });

    expect(result.paramsAux).toEqual({
      existingParam: 'value',
      cursor: 'next_cursor_value'
    });
  });

  it('should set hasMore to false if cursorProperty does not exist', () => {
    const result = cursorStrategy({
      data: { unrelatedProperty: 'value' },
      paginationConfigs: {
        cursorEndpointProperty: 'cursor',
        recordProperty: 'records'
      },
      endpoint: '',
      recordProperty: 'records',
      params: {}
    });

    expect(result.hasMore).toBe(false);
  });

  it('should preserve existing params', () => {
    const result = cursorStrategy({
      data: {},
      paginationConfigs: { recordProperty: 'records' },
      endpoint: '',
      recordProperty: 'records',
      params: { existingParam: 'value' }
    });

    expect(result.paramsAux).toEqual({ existingParam: 'value' });
  });
});

describe('pageStrategy', () => {
  it('should set hasMore to false if recordProperty length is less than perPage', () => {
    const result = pageStrategy({
      recordProperty: Array(5).fill(null),
      params: { perPage: 10 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: false,
      paramsAux: { perPage: 10 }
    });
  });

  it('should increment the page if recordProperty length is not less than perPage', () => {
    const result = pageStrategy({
      recordProperty: Array(10).fill(null),
      params: { perPage: 10, page: 1 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: true,
      paramsAux: { perPage: 10, page: 2 }
    });
  });

  it('should default to a perPage of 10 if not provided and increment page if recordProperty length matches default', () => {
    const result = pageStrategy({
      recordProperty: Array(10).fill(null),
      params: { page: 1 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: true,
      paramsAux: { page: 2 }
    });
  });

  it('should default page to 2 if not provided and recordProperty length is not less than default perPage', () => {
    const result = pageStrategy({
      recordProperty: Array(10).fill(null),
      params: {},
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: true,
      paramsAux: { page: 2 }
    });
  });

  it('should set hasMore to false if no recordProperty is provided', () => {
    const result = pageStrategy({
      params: {},
      data: {},
      paginationConfigs: { recordProperty: 'records' },
      recordProperty: null,
      endpoint: 'some_endpoint'
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: false,
      paramsAux: {}
    });
  });
});

describe('offsetStrategy', () => {
  it('should set hasMore to false if recordProperty length is less than limit', () => {
    const result = offsetStrategy({
      recordProperty: Array(5).fill(null),
      params: { limit: 10 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: false,
      paramsAux: { limit: 10 }
    });
  });

  it('should increment the offset by limit if recordProperty length is not less than limit', () => {
    const result = offsetStrategy({
      recordProperty: Array(10).fill(null),
      params: { limit: 10, offset: 0 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: true,
      paramsAux: { limit: 10, offset: 10 }
    });
  });

  it('should default to a limit of 10 if not provided and increment offset by default limit if recordProperty length matches default', () => {
    const result = offsetStrategy({
      recordProperty: Array(10).fill(null),
      params: { offset: 0 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: true,
      paramsAux: { offset: 10 }
    });
  });

  it('should default offset to 10 if not provided and recordProperty length is not less than default limit', () => {
    const result = offsetStrategy({
      recordProperty: Array(10).fill(null),
      params: { limit: 10 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' }
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: true,
      paramsAux: { limit: 10, offset: 10 }
    });
  });

  it('should set hasMore to false if no recordProperty is provided', () => {
    const result = offsetStrategy({
      params: { limit: 10 },
      endpoint: 'some_endpoint',
      data: {},
      paginationConfigs: { recordProperty: 'records' },
      recordProperty: null
    });

    expect(result).toEqual({
      endpoint: 'some_endpoint',
      hasMore: false,
      paramsAux: { limit: 10 }
    });
  });
});

describe('getStrategies', () => {
  it('should return an object with the specified strategy functions', () => {
    const strategies = getStrategies();

    expect(typeof strategies).toBe('object');
    expect(strategies.cursor).toBe(cursorStrategy);
    expect(strategies.page).toBe(pageStrategy);
    expect(strategies.offset).toBe(offsetStrategy);
  });

  it('should not have any extra strategies', () => {
    const strategies = getStrategies();

    const keys = Object.keys(strategies);
    expect(keys.length).toBe(3);
    expect(keys).toContain('cursor');
    expect(keys).toContain('page');
    expect(keys).toContain('offset');
  });
});

describe('getHeaderContentType', () => {
  it('should return an object with the specified header content type', () => {
    const json = getHeaderContentType({
      'content-type': ContentTypes.JSON,
      'other-headers': '123456789'
    });
    const encoded = getHeaderContentType({
      'other-headers': '123456789',
      'Content-Type': ContentTypes.X_URL_ENCODED
    });

    expect(json).toBe(ContentTypes.JSON);
    expect(encoded).toBe(ContentTypes.X_URL_ENCODED);
  });
});
