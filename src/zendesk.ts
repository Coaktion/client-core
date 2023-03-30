import { BaseClient } from './base';
import { ZendeskClientInterface } from './interfaces';
import { ClientOptions, ModalProps, PayloadRequestZendesk } from './types';
import { converterPathParamsUrl, queryParamsUrl } from './utils';

export class ZendeskClient
  extends BaseClient
  implements ZendeskClientInterface
{
  isProduction: boolean;

  constructor(client: any, clientOptions: ClientOptions) {
    super(clientOptions);
    this.client = client;
    this.isProduction = false;
  }

  /**
   * Calls ZAF Client.request()
   * @returns {Promise}
   */
  async makeRequest(payload: PayloadRequestZendesk) {
    if (payload.pathParams)
      payload.url = converterPathParamsUrl(payload.url, payload.pathParams);

    if (payload.queryParams)
      payload.url = queryParamsUrl(payload.url, payload.queryParams);

    return await this.client.request({
      url: payload.url,
      method: payload.method,
      secure: this.isProduction,
      contentType: 'application/x-www-form-urlencoded'
    });
  }

  appOnActivate(callback: any) {
    return this.on('app.activated', async () => {
      return callback();
    });
  }

  onRequesterChange(callback: any) {
    return this.on('ticket.requester.changed', async (data) => {
      return callback('requesterId', data);
    });
  }

  onBrandChange(callback: any) {
    return this.on('ticket.brand.changed', async (data) => {
      return callback('brandId', data);
    });
  }

  onTicketSave(callback: any) {
    return this.on('ticket.save', async (data) => {
      return callback(data ? data.ticket : {});
    });
  }

  onStatusChange(callback: any) {
    return this.on('ticket.status.changed', async (data) => {
      return callback(data);
    });
  }

  /**
   * Notify user that something happened
   * Usually after taking some action
   * @param {string} message
   * @param {string} type
   * @param {number} durationInMs
   */
  notifyUser(message: string, type = 'error', durationInMs = 5000) {
    this.client.invoke('notify', message, type, durationInMs);
  }

  /**
   * It sets the frame height using on the passed value.
   * If no value has been passed, 80 will be set as default heigth.
   * @param {Int} newHeight
   */
  resizeFrame(appHeight = 80) {
    appHeight = appHeight + 120;
    this.client.invoke('resize', { width: '100%', height: `${appHeight}px` });
  }

  async invoke(param1, param2?, param3?) {
    return await this.client.invoke(param1, param2, param3);
  }

  /**
   * Calls ZAF Client.get()
   * @param {String} getter
   */
  async get(getter: string) {
    return (await this.client.get(getter))[getter];
  }

  /**
   * Performs ZAFClient.set()
   * @param {String} setter
   * @param {data} data
   */
  async set(setter: string, data: string) {
    return await this.client.set(setter, data);
  }

  /**
   * Performs ZAFClient.trigger()
   * @param {String} param
   * @param {data} data
   */
  async trigger(trigger: string, callback: any) {
    return await this.client.trigger(trigger, callback);
  }

  /**
   *
   * @param {String} event
   * @param {data} callback
   * @returns {Promise<*>}
   */
  async on(event: string, callback: any) {
    return await this.client.on(event, callback);
  }

  async setTicketField(ticketFieldId: string, value: string) {
    return await this.set(
      `ticket.customField:custom_field_${ticketFieldId}`,
      value
    );
  }

  async ticketFieldOption(ticketFieldId: string, value: string) {
    return await this.invoke(
      `ticket.customField:custom_field_${ticketFieldId}.${value}`
    );
  }

  async createModal({ modalName, modalUrl, size }: ModalProps) {
    return await this.invoke('instances.create', {
      location: 'modal',
      url: `${modalUrl}?modal=${modalName}`,
      size
    });
  }
}