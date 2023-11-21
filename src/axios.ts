import axios, { AxiosInstance, AxiosResponse } from 'axios';

// import axiosRetry from 'axios-retry';
import { BaseClient } from './base';
import { AxiosClientInterface } from './interfaces';
import { ClientOptionsAxios, Payload } from './types';
import { sleep } from './utils';

export class AxiosClient extends BaseClient implements AxiosClientInterface {
  clientOptions: ClientOptionsAxios;
  client: AxiosInstance;

  constructor(clientOptions: ClientOptionsAxios) {
    super(clientOptions);
    this.clientOptions = clientOptions;

    this.client = axios.create({
      baseURL: clientOptions.baseURL
    });
  }

  /**
   * The function to use for making a request
   * @description
   * If the endpoint is not set, it will throw an error
   * Otherwise, it will make a request to the endpoint
   * @param {string} method - The method to use for the request
   * @param {string} url - The url to use for the request
   * @param {object} [data] - The data to use for the request
   * @param {object} [params] - The params to use for the request
   * @param {object} [headers] - The headers to use for the request
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
  async makeRequest({
    method,
    url,
    data,
    params,
    headers,
    retryCount = 0
  }: Payload): Promise<AxiosResponse> {
    try {
      if (this.clientOptions.forceAuth || this.retryAuth)
        await this.authentication();

      retryCount = retryCount++;

      headers = { ...this.auth, ...headers };
      return await this.client.request({
        method,
        url,
        timeout: this.clientOptions.timeout,
        data,
        params,
        headers
      });
    } catch (e: any) {
      if (this.retryCondition(e)) {
        await sleep(this.retryDelay(retryCount, e));
        return await this.makeRequest({
          method,
          url,
          data,
          params,
          headers,
          retryCount
        });
      }
    }
  }
}
