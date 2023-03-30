import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

import { BaseClient } from './base';
import { HttpStatusCodesRetryCondition } from './enums';
import { AxiosClientInterface } from './interfaces';
import { ClientOptionsAxios, DataOptions } from './types';

export class AxiosClient extends BaseClient implements AxiosClientInterface {
  clientOptions: ClientOptionsAxios;
  client: AxiosInstance;

  constructor(clientOptions: ClientOptionsAxios) {
    super(clientOptions);
    this.clientOptions = clientOptions;

    this.client = axios.create({
      baseURL: clientOptions.baseURL
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
    dataOptions?: DataOptions,
    headers?: object
  ): Promise<AxiosResponse> {
    if (this.clientOptions.forceAuth || this.retryAuth)
      await this.authentication();

    headers = { ...this.auth, ...headers };
    return this.client.request({
      method: methodName,
      url: endpoint,
      timeout: this.clientOptions.timeout,
      data: dataOptions?.data,
      params: dataOptions?.params,
      headers
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
  retryDelay = (retryCount: number, error: AxiosError): number => {
    if (retryCount >= this.clientOptions.tries) throw error;
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
  retryCondition = (error: AxiosError): boolean => {
    if (error.response.status === HttpStatusCodesRetryCondition.Unauthorized)
      this.retryAuth = true;

    return Object.values(HttpStatusCodesRetryCondition).includes(
      error.response.status
    );
  };
}
