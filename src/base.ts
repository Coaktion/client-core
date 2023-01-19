import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

import { HttpStatusCodesRetryCondition } from './enums';
import { EndpointNotSet } from './exceptions';
import { ClientOptions, DataOptions } from './types';

class ClientBasic {
  clientOptions: ClientOptions;
  client: AxiosInstance;
  constructor(baseUrl: string, clientOptions: ClientOptions) {
    this.clientOptions = clientOptions;

    this.client = axios.create({
      baseURL: baseUrl,
      auth: this.clientOptions.authProvider
    });

    axiosRetry(this.client, {
      retries: this.clientOptions.tries,
      retryDelay: this.retryDelay,
      retryCondition: this.retryCondition
    });
  }

  /**
   * The function to use for making a request
   * @description
   * If the endpoint is not set, it will throw an error
   * Otherwise, it will make a request to the endpoint
   * @param {string} methodName The method name to use for the request
   * @param {string} endpoint The endpoint to use for the request
   * @param {DataOptions} [dataOptions] The data options to use for the request
   * @returns {Promise<AxiosResponse>} The response from the request
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @example
   * const response = await this.makeRequest('get', this.endpoints.fetch, {
   * 	params: { id: 1 }
   * });
   * console.log(response.data);
   * // => { id: 1, name: 'test' }
   */
  async makeRequest(
    methodName: string,
    endpoint: string,
    dataOptions?: DataOptions
  ): Promise<AxiosResponse> {
    return this.client.request({
      method: methodName,
      url: endpoint,
      timeout: this.clientOptions.timeout,
      data: dataOptions?.data,
      params: dataOptions?.params
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
   */
  retryDelay(_retryCount: number, error: AxiosError): number {
    return error.response.status ===
      HttpStatusCodesRetryCondition.TooManyRequests
      ? parseInt(error.response.headers[this.clientOptions.rateLimitKey])
      : this.clientOptions.retryDelay * 1000;
  }

  /**
   * The function to use for retry condition
   * @description
   * If the error is a 429, it will retry
   * Otherwise, it will retry if the status code is in the list of status codes to retry
   * @param {AxiosError} error The error that was thrown
   * @returns {boolean} Whether or not to retry
   * @memberof BasicClient
   */
  retryCondition(error: AxiosError): boolean {
    return Object.values(HttpStatusCodesRetryCondition).includes(
      error.response?.status
    );
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
  async search(params?: object): Promise<AxiosResponse> {
    if (!this.clientOptions.endpoints.search)
      throw new EndpointNotSet('search');
    return this.makeRequest('GET', this.clientOptions.endpoints.search, {
      params
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
  async fetch(id: string): Promise<AxiosResponse> {
    if (!this.clientOptions.endpoints.fetch) throw new EndpointNotSet('fetch');
    return this.makeRequest(
      'GET',
      this.clientOptions.endpoints.fetch.replace(':id', id.toString())
    );
  }

  /**
   * The function to use for creating
   * @description
   * If the create endpoint is not set, it will throw an error
   * Otherwise, it will make a POST request to the create endpoint
   * @param {object} data The data to use for the create
   * @returns {Promise<AxiosResponse>} The response from the create
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.create({ name: 'test' });
   * console.log(response.data);
   * // => { id: 1, name: 'test' }
   */
  async create(data: object): Promise<AxiosResponse> {
    if (!this.clientOptions.endpoints.create)
      throw new EndpointNotSet('create');
    return this.makeRequest('POST', this.clientOptions.endpoints.create, data);
  }

  /**
   * The function to use for updating
   * @description
   * If the update endpoint is not set, it will throw an error
   * Otherwise, it will make a PUT request to the update endpoint
   * @param {string} id The ID of the item to update
   * @param {object} data The data to use for the update
   * @returns {Promise<AxiosResponse>} The response from the update
   * @memberof BasicClient
   * @throws {EndpointNotSet}
   * @throws {AxiosError}
   * @example
   * const response = await client.update('1', { name: 'test' });
   * console.log(response.data);
   * // => { id: 1, name: 'test' }
   */
  async update(id: string, data: object): Promise<AxiosResponse> {
    if (!this.clientOptions.endpoints.update)
      throw new EndpointNotSet('update');
    return this.makeRequest(
      'PUT',
      this.clientOptions.endpoints.update.replace(':id', id),
      data
    );
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
  async delete(id: string): Promise<AxiosResponse> {
    if (!this.clientOptions.endpoints.delete)
      throw new EndpointNotSet('delete');
    return this.makeRequest(
      'DELETE',
      this.clientOptions.endpoints.delete.replace(':id', id)
    );
  }
}

export { ClientBasic };
