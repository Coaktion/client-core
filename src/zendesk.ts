import { BaseClient } from './base';
import { ZendeskRequestError } from './exceptions';
import { ZendeskClientInterface } from './interfaces';
import {
  ClientOptionsZendesk,
  ModalProps,
  PayloadRequestZendesk,
  TriggerToLocationProps
} from './types';
import { converterPathParamsUrl, queryParamsUrl, sleep } from './utils';

export class ZendeskClient
  extends BaseClient
  implements ZendeskClientInterface
{
  isProduction: boolean;
  timeout: number;
  clientOptions: ClientOptionsZendesk;

  constructor(clientOptions: ClientOptionsZendesk) {
    super(clientOptions);
    this.client = clientOptions.client;
    this.clientOptions = clientOptions;
    this.isProduction = clientOptions.secure || false;
    this.timeout = clientOptions.timeout;
  }

  /**
   * Calls ZAF Client.request()
   * @returns {Promise}
   */
  async makeRequest(payload: PayloadRequestZendesk): Promise<any> {
    if (this.clientOptions.forceAuth || this.retryAuth)
      await this.authentication();

    payload.headers = { ...this.auth, ...payload.headers };

    payload.retryCount = payload.retryCount++ || 1;
    if (payload.pathParams)
      payload.url = converterPathParamsUrl(payload.url, payload.pathParams);

    if (payload.params)
      payload.url = queryParamsUrl(payload.url, payload.params);

    try {
      return await this.client.request({
        url: payload.url,
        type: payload.method,
        secure: this.isProduction,
        contentType: payload.contentType
          ? payload.contentType
          : 'application/x-www-form-urlencoded',
        httpCompleteResponse: true,
        timeout: this.timeout,
        ...(payload.data && { data: payload.data }),
        ...(payload.headers && { headers: payload.headers })
      });
    } catch (error) {
      if (!error.status) throw new Error(String(error));
      const instanceError = new ZendeskRequestError({
        status: error.status,
        message: error.responseJSON.message ? error.responseJSON.message : null
      });

      if (this.retryCondition(instanceError)) {
        await sleep(this.retryDelay(payload.retryCount, instanceError));
        return await this.makeRequest(payload);
      } else {
        throw instanceError.response;
      }
    }
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

  async getCurrentTicket() {
    return await this.get('ticket');
  }

  async ticketFieldOption(ticketFieldId: string, value: string) {
    return await this.invoke(
      `ticket.customField:custom_field_${ticketFieldId}.${value}`
    );
  }

  /**
   * This method creates a modal. If data is passed, it will listen to an event from modal to set the data to it.
   * To receive the data, you need to call the `modalReady` method in the modal.
   */

  async createModal({ modalName, modalUrl, size, data }: ModalProps) {
    const modal = await this.invoke('instances.create', {
      location: 'modal',
      url: `${modalUrl}?modal=${modalName}`,
      size
    });

    if (!data) return modal;

    const instanceId = modal['instances.create'][0].instanceGuid;

    const setData = async () => {
      await this.client.instance(instanceId).trigger(`modal.setData`, data);
      await this.client.off(`modal.ready`, setData);
    };

    this.on(`modal.ready`, setData);
  }

  /**
   * This method triggers an event to all instances when the modal is ready to receive data.
   * So you can get the data passed thorugh the `createModal` method.
   */

  async modalReady() {
    await this.triggerToLocations({
      event: `modal.ready`,
      locations: ['nav_bar', 'ticket_sidebar', 'top_bar']
    });
  }

  /**
   * This method is used to trigger an event to a different location from the current one.
   * For example, if you are in the modal and want to trigger an event in the sidebar.
   */

  async triggerToLocations({ event, data, locations }: TriggerToLocationProps) {
    const instances = await this.get('instances');

    for (const instanceId in instances) {
      if (locations.includes(instances[instanceId].location)) {
        await this.client.instance(instanceId).trigger(event, data);
      }
    }
  }
}
