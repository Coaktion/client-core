/* eslint-disable no-case-declarations */
import { AxiosError, AxiosResponse } from 'axios';

import { HttpStatusCodesRetryCondition } from './enums';
import {
  AuthProviderNotFound,
  EndpointNotSet,
  InvalidAuthOptions
} from './exceptions';
import { BaseClientInterface } from './interfaces';
import {
  ClientOptions,
  SearchAllPagesProps,
  SearchAllPagesResponse
} from './types';
import {
  converterPathParamsUrl,
  getNestedProperty,
  getStrategies
} from './utils';

export class BaseClient implements BaseClientInterface {
  appName: string;
  client: any;
  clientOptions: ClientOptions;
  auth: object;
  retryAuth: boolean;

  constructor(clientOptions: ClientOptions) {
    this.appName = this.constructor.name;
    this.clientOptions = clientOptions;
    this.auth = {};
    this.retryAuth = false;

    if (!this.clientOptions.timeout) this.clientOptions.timeout = 5000;
    if (typeof this.clientOptions.retryDelay !== 'number')
      this.clientOptions.retryDelay = 3;
    if (typeof this.clientOptions.tries !== 'number')
      this.clientOptions.tries = 0;
  }

  async makeRequest(..._args: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async authentication(): Promise<void> {
    if (!this.clientOptions.authProvider) throw new AuthProviderNotFound();

    try {
      this.auth = await this.clientOptions.authProvider.getToken();
      this.retryAuth = false;
    } catch (error) {
      throw new InvalidAuthOptions();
    }
  }

  /**
   * The function to use for searching
   * @description
   * If the search endpoint is not set, it will throw an error
   * Otherwise, it will make a GET request to the search endpoint
   * @param {object} [params] The parameters to use for the search
   * @returns {Promise<AxiosResponse>} The response from the search
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.search({ name: 'test' });
   * console.log(response.data);
   * // => [{ id: 1, name: 'test' }]
   */
  async search(params?: object): Promise<AxiosResponse | any> {
    if (!this.clientOptions.endpoints.search)
      throw new EndpointNotSet('search');
    return this.makeRequest({
      method: 'GET',
      url: this.clientOptions.endpoints.search,
      params: {
        ...params
      },
      ...(this.clientOptions.defaultHeaders && {
        headers: this.clientOptions.defaultHeaders
      })
    });
  }

  /**
   * The function to use for fetching
   * @description
   * If the fetch endpoint is not set, it will throw an error
   * Otherwise, it will make a GET request to the fetch endpoint
   * @param {string} id The ID of the item to fetch
   * @returns {Promise<AxiosResponse>} The response from the fetch
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.fetch('1');
   */
  async fetch(id: string): Promise<AxiosResponse | any> {
    if (!this.clientOptions.endpoints.fetch) throw new EndpointNotSet('fetch');
    return this.makeRequest({
      method: 'GET',
      url: converterPathParamsUrl(this.clientOptions.endpoints.fetch, { id }),
      ...(this.clientOptions.defaultHeaders && {
        headers: this.clientOptions.defaultHeaders
      })
    });
  }

  /**
   * The function to use for searching all pages
   * @description This function will search all pages of the endpoint
   * @param {SearchAllPagesProps} props The props to use for the search
   * @returns {Promise<SearchAllPagesResponse>} The response from the search
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.searchAllPages({
   *  strategy: 'cursor',
   *  params: {
   *    perPage: 100,
   *    order: 'desc',
   *  },
   *  paginationConfigs: {
   *   recordProperty: 'data',
   *   nextEndpoint: true,
   *   cursorEndpointProperty: 'links.next',
   *  });
   */

  async searchAllPages(
    props: SearchAllPagesProps
  ): Promise<SearchAllPagesResponse> {
    if (!this.clientOptions.endpoints.searchAllPages)
      throw new EndpointNotSet('searchAllPages');

    const { strategy, paginationConfigs, params } = props;
    const strategies = getStrategies();

    let endpoint = this.clientOptions.endpoints.searchAllPages;
    let paramsAux = { ...params };
    let allData: any[] = [];
    let hasMore = true;

    while (hasMore) {
      let data;

      try {
        data = await this.makeRequest({
          method: 'GET',
          url: endpoint,
          params: paramsAux,
          ...(this.clientOptions.defaultHeaders && {
            headers: this.clientOptions.defaultHeaders
          })
        });
      } catch (error) {
        return { dataFetched: allData, fullFetched: false };
      }

      data = data.responseJSON ? data.responseJSON : data;
      const recordProperty = getNestedProperty(
        data,
        paginationConfigs.recordProperty
      );

      const strategyData = strategies[strategy]({
        data,
        paginationConfigs,
        params: paramsAux,
        recordProperty,
        endpoint
      });

      endpoint = strategyData.endpoint;
      hasMore = strategyData.hasMore;
      paramsAux = strategyData.paramsAux;

      allData = allData.concat(recordProperty);
    }

    return { dataFetched: allData, fullFetched: true };
  }

  /**
   * The function to use for creating
   * @description
   * If the create endpoint is not set, it will throw an error
   * Otherwise, it will make a POST request to the create endpoint
   * @param {object | string} data The data to use for the create
   * @returns {Promise<AxiosResponse>} The response from the create
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.create({ name: 'test' });
   * console.log(response.data);
   * // => { id: 1, name: 'test' }
   */
  async create(data: object | string): Promise<AxiosResponse | any> {
    if (!this.clientOptions.endpoints.create)
      throw new EndpointNotSet('create');
    return this.makeRequest({
      method: 'POST',
      url: this.clientOptions.endpoints.create,
      data,
      ...(this.clientOptions.defaultHeaders && {
        headers: this.clientOptions.defaultHeaders
      })
    });
  }

  /**
   * The function to use for updating
   * @description
   * If the update endpoint is not set, it will throw an error
   * Otherwise, it will make a PUT request to the update endpoint
   * @param {string} id The ID of the item to update
   * @param {object | string} data The data to use for the update
   * @param {string} [method='PUT'] The method to use for the update. Accept 'PUT' or 'PATCH'
   * @returns {Promise<AxiosResponse>} The response from the update
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.update('1', { name: 'test' });
   * console.log(response.data);
   * // => { id: 1, name: 'test' }
   */
  async update(
    id: string,
    data: object | string,
    method = 'PUT',
    payload?: any
  ): Promise<AxiosResponse | any> {
    if (!this.clientOptions.endpoints.update)
      throw new EndpointNotSet('update');

    const url = String(
      converterPathParamsUrl(this.clientOptions.endpoints.update, { id })
    );
    return this.makeRequest({
      method,
      url,
      data,
      ...(this.clientOptions.defaultHeaders && {
        headers: this.clientOptions.defaultHeaders
      }),
      ...payload
    });
  }

  /**
   * The function to use for deleting
   * @description
   * If the delete endpoint is not set, it will throw an error
   * Otherwise, it will make a DELETE request to the delete endpoint
   * @param {string} id The ID of the item to delete
   * @returns {Promise<AxiosResponse>} The response from the delete
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.delete('1');
   * console.log(response.data);
   * // => { id: 1, name: 'test' }
   * // The item is still returned, but it is deleted
   */
  async delete(id: string): Promise<AxiosResponse | any> {
    if (!this.clientOptions.endpoints.delete)
      throw new EndpointNotSet('delete');
    return this.makeRequest({
      method: 'DELETE',
      url: converterPathParamsUrl(this.clientOptions.endpoints.delete, { id }),
      ...(this.clientOptions.defaultHeaders && {
        headers: this.clientOptions.defaultHeaders
      })
    });
  }

  /**
   * The function to use for retry delay
   * @description
   * If the error is a 429, it will use the value of the rate limit key
   * Otherwise, it will use the retry delay from the client options
   * @param {number} _retryCount The number of retries
   * @param {AxiosError} error The error that was thrown
   * @returns {number} The number of milliseconds to wait before retrying
   * @memberof BasicClient
   * @throws {AxiosError}
   * @throws {InvalidAuthOptions}
   */
  retryDelay = (retryCount: number, error: AxiosError | any): number => {
    if (retryCount >= this.clientOptions.tries)
      throw error.response ? error.response : error;
    return error.response.status ===
      HttpStatusCodesRetryCondition.TooManyRequests
      ? parseInt(error.response.headers[this.clientOptions.rateLimitKey])
      : this.clientOptions.retryDelay * 1000;
  };

  /**
   * The function to use for retry condition
   * @description
   * If the error is a 429, it will retry
   * Otherwise, it will retry if the status code is in the list of status codes to retry
   * @param {AxiosError} error The error that was thrown
   * @returns {boolean} Whether or not to retry
   * @memberof BasicClient
   */
  retryCondition = (error: AxiosError | any): boolean => {
    if (error?.response?.status === HttpStatusCodesRetryCondition.Unauthorized)
      this.retryAuth = true;

    return Object.values(HttpStatusCodesRetryCondition).includes(
      error?.response?.status || HttpStatusCodesRetryCondition.RequestTimeout
    );
  };
}
