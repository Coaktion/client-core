import { SearchAllStrategyProps, SearchAllStrategyReturn } from './types';

/* eslint-disable no-prototype-builtins */
export const queryParamsUrl = (url: string, params: any) => {
  const fakeOrigin = 'https://aktienow-client-core';
  const currentUrl = new URL(url, fakeOrigin);
  const searchParams = new URLSearchParams(params).toString();
  if (currentUrl.origin === fakeOrigin) return `${currentUrl.pathname}?${searchParams}`;
  currentUrl.search = searchParams;
  return currentUrl.href;
};

export const converterPathParamsUrl = (url: string, params: any) => {
  return url.replace(/{([^}]+)}/g, (_, key) => {
    return params[key] || `{${key}}`;
  });
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getNestedProperty = (obj: any, path: string): any => {
  // if(!path) return obj;
  if (typeof obj !== 'object') return undefined;
  if (!obj) return undefined;
  const properties = path.split('.');
  for (const property of properties) {
    if (!obj.hasOwnProperty(property)) return undefined;
    obj = obj[property];
  }
  return obj;
};

export const cursorStrategy = (
  props: SearchAllStrategyProps
): SearchAllStrategyReturn => {
  const { data, paginationConfigs, params, endpoint } = props;
  let endpointAux = endpoint;
  let hasMore = true;
  let paramsAux = { ...params };

  const cursorProperty = getNestedProperty(
    data,
    paginationConfigs.cursorEndpointProperty || ''
  );

  if (paginationConfigs.nextEndpoint) {
    endpointAux = cursorProperty;
    paramsAux = null;
  }

  if (paginationConfigs.nextCursor && cursorProperty)
    paramsAux = { ...params, cursor: cursorProperty };

  if (!cursorProperty) hasMore = false;

  return { endpoint: endpointAux, hasMore, paramsAux };
};

export const pageStrategy = (
  props: SearchAllStrategyProps
): SearchAllStrategyReturn => {
  const { recordProperty, params, endpoint } = props;
  const paramsAux = { ...params };
  let hasMore = true;

  if (
    !recordProperty ||
    (recordProperty && recordProperty.length < (paramsAux.perPage || 10))
  ) {
    hasMore = false;
  } else {
    paramsAux.page = (paramsAux.page || 1) + 1;
  }

  return { endpoint, hasMore, paramsAux };
};

export const offsetStrategy = (
  props: SearchAllStrategyProps
): SearchAllStrategyReturn => {
  const { recordProperty, params, endpoint } = props;
  const paramsAux = { ...params };
  let hasMore = true;

  if (
    !recordProperty ||
    (recordProperty && recordProperty.length < (paramsAux.limit || 10))
  ) {
    hasMore = false;
  } else {
    paramsAux.offset = (paramsAux.offset || 0) + (paramsAux.limit || 10);
  }

  return { endpoint, hasMore, paramsAux };
};

export const getStrategies = () => {
  const strategies: {
    [key: string]: (data: SearchAllStrategyProps) => SearchAllStrategyReturn;
  } = {
    cursor: cursorStrategy,
    page: pageStrategy,
    offset: offsetStrategy
  };

  return strategies;
};

export const getHeaderContentType = (headers: object): string | null => {
  if (!headers) return null;

  const contentTypeKey = Object.keys(headers).find(
    (key) => key.toLocaleLowerCase() === 'content-type'
  );

  return headers[contentTypeKey] || null;
};
