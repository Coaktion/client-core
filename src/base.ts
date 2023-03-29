import { AxiosResponse } from 'axios';

import {
  AuthProviderNotFound,
  EndpointNotSet,
  InvalidAuthOptions
} from './exceptions';
import { BaseClientInterface } from './interfaces';
import { ClientOptions } from './types';

export class BaseClient implements BaseClientInterface {
  client: any;
  clientOptions: ClientOptions;
  auth: object;

  constructor(clientOptions: ClientOptions) {
    this.clientOptions = clientOptions;
  }

  async makeRequest(..._args: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async authentication(): Promise<void> {
    if (!this.clientOptions.authProvider) throw new AuthProviderNotFound();
    try {
      this.auth = await this.clientOptions.authProvider.getToken();
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
  async fetch(id: string): Promise<AxiosResponse | any> {
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
  async create(data: object): Promise<AxiosResponse | any> {
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
  async update(id: string, data: object): Promise<AxiosResponse | any> {
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
  async delete(id: string): Promise<AxiosResponse | any> {
    if (!this.clientOptions.endpoints.delete)
      throw new EndpointNotSet('delete');
    return this.makeRequest(
      'DELETE',
      this.clientOptions.endpoints.delete.replace(':id', id)
    );
  }
}
