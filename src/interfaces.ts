import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import {
  AuthOptions,
  ClientOptions,
  ModalProps,
  Payload,
  PayloadRequestZendesk
} from './types';

/**
 * AuthBasic interface
 * @description Interface for AuthBasic
 * @interface AuthBasic
 * @property {AuthOptions} authOptions - AuthOptions
 * @property {AxiosInstance} client - AxiosInstance
 * @property {Function} getToken - getToken
 * @returns {Promise<object>} - Promise
 * @example
 * import { AuthBasic } from './interfaces';
 * import { AuthOptions } from './types';
 *
 * export class AuthApiKey implements AuthBasic {
 *   authOptions: AuthOptions;
 *   constructor(authOptions: AuthOptions) {
 *     this.authOptions = authOptions;
 *   }
 *
 *   async getToken(): Promise<object> {
 *     const response = {};
 *     const key = this.authOptions.header
 *     response[key] = this.authOptions.apiKey;
 *     return response;
 *   }
 * }
 */
export interface AuthBasic {
  authOptions: AuthOptions;
  client?: AxiosInstance;
  getToken(): Promise<object>;
}

export interface BaseClientInterface {
  clientOptions: ClientOptions;
  client: any;
  auth: object;

  makeRequest(...args: any[]): Promise<any>;
  authentication(): Promise<void>;
  search(params?: object): Promise<AxiosResponse | any>;
  fetch(id: string): Promise<AxiosResponse | any>;
  create(data: object): Promise<AxiosResponse | any>;
  update(
    id: string,
    data: object | string,
    method: string
  ): Promise<AxiosResponse | any>;
  delete(id: string): Promise<AxiosResponse | any>;
}
export interface AxiosClientInterface extends BaseClientInterface {
  client: AxiosInstance;

  makeRequest(data: Payload): Promise<AxiosResponse>;
  retryDelay(retryCount: number, error: AxiosError): number;
  retryCondition(error: AxiosError): boolean;
}

export interface ZendeskClientInterface extends BaseClientInterface {
  makeRequest(payload: PayloadRequestZendesk): Promise<any>;
  appOnActivate(callback: any): void;
  onRequesterChange(callback: any): void;
  onBrandChange(callback: any): void;
  onTicketSave(callback: any): void;
  onStatusChange(callback: any): void;
  notifyUser(message: string, type: string, durationInMs: number): void;
  resizeFrame(appHeight: number): void;
  invoke(action: string, ...args: any[]): Promise<any>;
  get(getter: string): Promise<any>;
  set(setter: string, ...args: any[]): Promise<any>;
  trigger(param: string, ...args: any[]): Promise<any>;
  on(event: string, callback: any): void;
  setTicketField(fieldId: string, value: any): Promise<any>;
  ticketFieldOption(fieldId: string, value: string): Promise<any>;
  createModal(ModalProps: ModalProps): Promise<any>;
}
