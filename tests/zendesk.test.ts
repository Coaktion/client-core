import { ZendeskRequestError } from '../src/exceptions';
import { PayloadRequestZendesk } from '../src/types';
import { converterPathParamsUrl, queryParamsUrl, sleep } from '../src/utils';
import { ZendeskClient } from '../src/zendesk';

jest.mock('../src/utils');

const mockZendeskClient = {
  on: jest.fn(),
  invoke: jest.fn(),
  request: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  trigger: jest.fn(),
  off: jest.fn(),
  instance: jest.fn()
};

const fakerFn = jest.fn();

describe('ZendeskClientBase', () => {
  let zendeskClientBase: ZendeskClient;
  beforeEach(() => {
    jest.resetAllMocks();
    zendeskClientBase = new ZendeskClient({
      endpoints: {},
      client: mockZendeskClient
    });
  });

  it.each([
    [undefined, false],
    [false, false],
    [true, true]
  ])(
    'construtor should be defined secure: %s',
    (secureValue, isProductionExpected) => {
      const instance = new ZendeskClient({
        endpoints: {},
        secure: secureValue,
        client: mockZendeskClient
      });

      expect(instance).toBeDefined();
      expect(instance.client).toBe(mockZendeskClient);
      expect(instance.appName).toBe(instance.constructor.name);
      expect(instance.clientOptions).toEqual({
        endpoints: {},
        secure: secureValue,
        client: mockZendeskClient,
        retryDelay: 3,
        tries: 0,
        timeout: 5000
      });
      expect(instance.isProduction).toBe(isProductionExpected);
    }
  );

  it('should call appOnActivate when param is passed', () => {
    zendeskClientBase.on = jest.fn().mockImplementation((event, callback) => {
      callback();
    });
    zendeskClientBase.appOnActivate(fakerFn);
    expect(zendeskClientBase.on).toHaveBeenCalledWith(
      'app.activated',
      expect.any(Function)
    );
    expect(fakerFn).toHaveBeenCalled();
  });

  it('should call onRequesterChange when param is passed', () => {
    const data = { requester: { id: 'requesterId' } };
    zendeskClientBase.on = jest.fn().mockImplementation((event, callback) => {
      callback(data);
    });
    zendeskClientBase.onRequesterChange(fakerFn);
    expect(zendeskClientBase.on).toHaveBeenCalledWith(
      'ticket.requester.changed',
      expect.any(Function)
    );
    expect(fakerFn).toHaveBeenCalledWith('requesterId', data);
  });

  it('should call onBrandChange when param is passed', () => {
    const data = { brand: { id: 'brandId' } };
    zendeskClientBase.on = jest.fn().mockImplementation((event, callback) => {
      callback(data);
    });
    zendeskClientBase.onBrandChange(fakerFn);
    expect(zendeskClientBase.on).toHaveBeenCalledWith(
      'ticket.brand.changed',
      expect.any(Function)
    );
    expect(fakerFn).toHaveBeenCalledWith('brandId', data);
  });

  it.each([
    [{ ticket: { id: 1 } }, { id: 1 }],
    [undefined, {}]
  ])('should call onTicketSave when param is passed', (data, expected) => {
    zendeskClientBase.on = jest.fn().mockImplementation((event, callback) => {
      callback(data);
    });
    zendeskClientBase.onTicketSave(fakerFn);
    expect(zendeskClientBase.on).toHaveBeenCalledWith(
      'ticket.save',
      expect.any(Function)
    );
    expect(fakerFn).toHaveBeenCalledWith(expected);
  });

  it('should call onStatusChange when param is passed', () => {
    zendeskClientBase.on = jest.fn().mockImplementation((event, callback) => {
      callback({ status: 'status' });
    });
    zendeskClientBase.onStatusChange(fakerFn);
    expect(zendeskClientBase.on).toHaveBeenCalledWith(
      'ticket.status.changed',
      expect.any(Function)
    );
    expect(fakerFn).toHaveBeenCalledWith({ status: 'status' });
  });

  it.each([
    ['error', 1000],
    ['success', 2000]
  ])(
    'should call notifyUser type %s with the correct params',
    (type, durationInMs) => {
      const message = 'message';
      zendeskClientBase.notifyUser(message, type, durationInMs);
      expect(mockZendeskClient.invoke).toHaveBeenCalledWith(
        'notify',
        message,
        type,
        durationInMs
      );
    }
  );

  it('should call notifyUser with default params', () => {
    const message = 'message';
    zendeskClientBase.notifyUser(message);
    expect(mockZendeskClient.invoke).toHaveBeenCalledWith(
      'notify',
      message,
      'error',
      5000
    );
  });

  it.each([
    [0, 120],
    [1, 121]
  ])(
    'should call reziseFrame size %i with the correct params',
    (value, expected) => {
      zendeskClientBase.resizeFrame(value);
      expect(mockZendeskClient.invoke).toHaveBeenCalledWith('resize', {
        width: '100%',
        height: `${expected}px`
      });
    }
  );

  it('should call reziseFrame with default params', () => {
    zendeskClientBase.resizeFrame();
    expect(mockZendeskClient.invoke).toHaveBeenCalledWith('resize', {
      width: '100%',
      height: `200px`
    });
  });

  it('should call get with the correct params', async () => {
    const getter = 'getter';
    mockZendeskClient.get.mockResolvedValue({ getter });
    await zendeskClientBase.get(getter);
    expect(mockZendeskClient.get).toHaveBeenCalledWith(getter);
  });

  it('should call set with the correct params', async () => {
    await zendeskClientBase.set('setter', 'value');
    expect(mockZendeskClient.set).toHaveBeenCalledWith('setter', 'value');
  });

  it('should call trigger with the correct params', async () => {
    await zendeskClientBase.trigger('trigger', 'data');
    expect(mockZendeskClient.trigger).toHaveBeenCalledWith('trigger', 'data');
  });

  it('should call on with the correct params', async () => {
    mockZendeskClient.on = jest.fn();
    await zendeskClientBase.on('event', fakerFn);
    expect(mockZendeskClient.on).toHaveBeenCalledWith('event', fakerFn);
  });

  it('should call setTicketField with the correct params', async () => {
    const ticketFieldId = 'ticketFieldId';
    const value = 'value';
    await zendeskClientBase.setTicketField(ticketFieldId, value);
    expect(mockZendeskClient.set).toHaveBeenCalledWith(
      `ticket.customField:custom_field_${ticketFieldId}`,
      value
    );
  });

  it.each(['hide', 'show', 'enable', 'disable'])(
    'should call ticketFieldOption %s with the correct params',
    async (value) => {
      const ticketFieldId = '123';

      await zendeskClientBase.ticketFieldOption(ticketFieldId, value);
      expect(mockZendeskClient.invoke).toHaveBeenCalledWith(
        `ticket.customField:custom_field_${ticketFieldId}.${value}`,
        undefined,
        undefined
      );
    }
  );

  describe('create modal', () => {
    describe('when "data" is not present', () => {
      it('should call createModal with the correct params', async () => {
        const modal = {
          modalName: 'modalName',
          modalUrl: 'modalUrl',
          size: {
            width: 'width',
            height: 'height'
          }
        };
        await zendeskClientBase.createModal(modal);
        expect(mockZendeskClient.invoke).toHaveBeenCalledWith(
          'instances.create',
          {
            location: 'modal',
            url: `${modal.modalUrl}?modal=${modal.modalName}`,
            size: {
              width: modal.size.width,
              height: modal.size.height
            }
          },
          undefined
        );
      });
    });

    describe('when "data" is present', () => {
      it('should call createModal with the correct params', async () => {
        mockZendeskClient.on = jest
          .fn()
          .mockImplementation((event, callback) => {
            callback();
          });
        mockZendeskClient.invoke.mockResolvedValueOnce({
          'instances.create': [
            {
              instanceGuid: 'id123'
            }
          ]
        });

        const instanceTriggerMock = jest.fn();

        mockZendeskClient.instance.mockReturnValueOnce({
          trigger: instanceTriggerMock
        });

        const modal = {
          modalName: 'modalName',
          modalUrl: 'modalUrl',
          size: {
            width: 'width',
            height: 'height'
          },
          data: {
            test: 'data'
          }
        };
        await zendeskClientBase.createModal(modal);
        expect(mockZendeskClient.invoke).toHaveBeenCalledWith(
          'instances.create',
          {
            location: 'modal',
            url: `${modal.modalUrl}?modal=${modal.modalName}`,
            size: {
              width: modal.size.width,
              height: modal.size.height
            }
          },
          undefined
        );
        expect(mockZendeskClient.on).toHaveBeenCalledWith(
          'modal.ready',
          expect.any(Function)
        );
        expect(mockZendeskClient.instance).toHaveBeenCalledWith('id123');
        expect(instanceTriggerMock).toHaveBeenCalledWith(
          'modal.setData',
          modal.data
        );
        expect(mockZendeskClient.off).toHaveBeenCalledWith(
          'modal.ready',
          expect.any(Function)
        );
      });
    });
  });

  it('should call makeRequest with the correct', async () => {
    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method'
    };
    await zendeskClientBase.makeRequest(payload);
    delete payload.retryCount;
    expect(mockZendeskClient.request).toHaveBeenCalledWith({
      url: payload.url,
      type: payload.method,
      secure: false,
      timeout: 5000,
      contentType: 'application/x-www-form-urlencoded',
      httpCompleteResponse: true,
      headers: {}
    });
  });

  it('should call makeRequest with the correct params', async () => {
    const expectedPath = '/api/users/123/posts';
    const expectedQuery = '?limit=10&sort=asc';
    (converterPathParamsUrl as jest.Mock).mockReturnValueOnce(expectedPath);
    (queryParamsUrl as jest.Mock).mockReturnValueOnce(expectedQuery);

    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method',
      pathParams: {
        pathParam: 'pathParam'
      },
      params: {
        limit: 10,
        sort: 'asc'
      }
    };
    await zendeskClientBase.makeRequest(payload);
    expect(converterPathParamsUrl).toHaveBeenCalled();
    expect(queryParamsUrl).toHaveBeenCalledWith(expectedPath, payload.params);
  });

  it('should call makeRequest with thorw error', async () => {
    zendeskClientBase.retryCondition = jest.fn().mockReturnValueOnce(true);
    zendeskClientBase.retryDelay = jest.fn().mockReturnValueOnce(100);
    sleep as jest.Mock;
    const error = { status: 500, message: 'requestError' };
    const instanceError = new ZendeskRequestError(error);

    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method'
    };
    (mockZendeskClient.request as jest.Mock).mockRejectedValueOnce({
      status: 500,
      responseJSON: { message: 'requestError' }
    });
    await zendeskClientBase.makeRequest(payload);

    expect(sleep).toHaveBeenCalledWith(100);
    expect(zendeskClientBase.retryCondition).toHaveBeenCalledWith(
      instanceError
    );
    expect(zendeskClientBase.retryDelay).toHaveBeenCalledWith(1, instanceError);
    expect(mockZendeskClient.request).toHaveBeenCalledTimes(2);
  });

  it.each([{}, { error: 'error' }, 'error'])(
    'should call makeRequest with throw error response %s',
    async (exception) => {
      zendeskClientBase.retryCondition = jest.fn();
      zendeskClientBase.retryDelay = jest.fn();
      sleep as jest.Mock;

      const payload: PayloadRequestZendesk = {
        url: 'url',
        method: 'method'
      };
      (mockZendeskClient.request as jest.Mock).mockRejectedValueOnce(exception);
      try {
        await zendeskClientBase.makeRequest(payload);
      } catch (error) {
        expect(error).toStrictEqual(new Error(String(exception)));
      }

      expect(sleep).not.toHaveBeenCalled();
      expect(zendeskClientBase.retryCondition).not.toHaveBeenCalled();
      expect(zendeskClientBase.retryDelay).not.toHaveBeenCalled();
      expect(mockZendeskClient.request).toHaveBeenCalledTimes(1);
    }
  );

  it('should call makeRequest with the correct ContentType', async () => {
    const expectedContentType = 'application/json';
    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method',
      contentType: 'application/json'
    };
    await zendeskClientBase.makeRequest(payload);
    delete payload.retryCount;
    expect(mockZendeskClient.request).toHaveBeenCalledWith({
      url: payload.url,
      type: payload.method,
      secure: false,
      timeout: 5000,
      contentType: expectedContentType,
      httpCompleteResponse: true,
      headers: {}
    });
    expect(mockZendeskClient.request).toHaveBeenCalledTimes(1);
  });

  it('should call makeRequest with the correct data', async () => {
    const expectedData = { id: '1' };
    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method',
      data: { id: '1' }
    };
    await zendeskClientBase.makeRequest(payload);
    delete payload.retryCount;
    expect(mockZendeskClient.request).toHaveBeenCalledWith({
      url: payload.url,
      type: payload.method,
      secure: false,
      data: expectedData,
      httpCompleteResponse: true,
      timeout: 5000,
      contentType: 'application/x-www-form-urlencoded',
      headers: {}
    });
    expect(mockZendeskClient.request).toHaveBeenCalledTimes(1);
  });

  it.each([
    [10000, 10000],
    [undefined, 5000]
  ])(
    'construtor should be defined timeout: %s',
    (timeoutValue, timeoutExpected) => {
      const instance = new ZendeskClient({
        endpoints: {},
        client: mockZendeskClient,
        ...(timeoutValue && { timeout: timeoutValue })
      });

      expect(instance).toBeDefined();
      expect(instance.client).toBe(mockZendeskClient);
      expect(instance.appName).toBe(instance.constructor.name);
      expect(instance.clientOptions).toEqual({
        endpoints: {},
        client: mockZendeskClient,
        retryDelay: 3,
        tries: 0,
        timeout: timeoutValue || 5000
      });
      expect(instance.timeout).toBe(timeoutExpected);
    }
  );

  it('should call makeRequest with the correct header', async () => {
    const expectedHeader = { 'Content-type': 'application/json' };
    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method',
      headers: { 'Content-type': 'application/json' }
    };

    await zendeskClientBase.makeRequest(payload);
    delete payload.retryCount;

    expect(mockZendeskClient.request).toHaveBeenCalledWith({
      url: payload.url,
      type: payload.method,
      secure: false,
      headers: expectedHeader,
      httpCompleteResponse: true,
      timeout: 5000,
      contentType: 'application/x-www-form-urlencoded'
    });
    expect(mockZendeskClient.request).toHaveBeenCalledTimes(1);
  });

  it('should throw ZendeskReuqestError when not on retry', async () => {
    zendeskClientBase.retryCondition = jest.fn().mockReturnValueOnce(false);
    const payload: PayloadRequestZendesk = {
      url: 'url',
      method: 'method'
    };
    (mockZendeskClient.request as jest.Mock).mockRejectedValueOnce({
      status: 500,
      responseJSON: { message: 'requestError' }
    });

    try {
      await zendeskClientBase.makeRequest(payload);
    } catch (error) {
      expect(error).toEqual({ status: 500, message: 'requestError' });
    }
  });

  it('should call authentication when calling makeRequest and forceAuth is true', async () => {
    zendeskClientBase.authentication = jest.fn();
    zendeskClientBase.clientOptions.forceAuth = true;
    await zendeskClientBase.makeRequest({
      method: 'get',
      url: 'url'
    });
    expect(await zendeskClientBase.authentication).toHaveBeenCalled();
  });

  it('should call get with correct params when get current ticket is called', async () => {
    zendeskClientBase.get = jest.fn().mockResolvedValueOnce({
      ticket: {}
    });
    await zendeskClientBase.getCurrentTicket();
    expect(zendeskClientBase.get).toHaveBeenCalledWith('ticket');
  });

  it('should call triggerToLocations with correct params when modalReady is called', async () => {
    zendeskClientBase.triggerToLocations = jest.fn();

    await zendeskClientBase.modalReady();

    expect(zendeskClientBase.triggerToLocations).toHaveBeenCalledWith({
      event: 'modal.ready',
      locations: ['nav_bar', 'ticket_sidebar', 'top_bar']
    });
  });

  it('should call trigger with correct params when triggerToLocations is called', async () => {
    const triggerMock = jest.fn();

    mockZendeskClient.get.mockResolvedValueOnce({
      instances: {
        id123: {
          location: 'nav_bar'
        },
        id456: {
          location: 'ticket_sidebar'
        }
      }
    });

    mockZendeskClient.instance.mockReturnValue({
      trigger: triggerMock
    });

    await zendeskClientBase.triggerToLocations({
      event: 'event',
      locations: ['nav_bar', 'ticket_sidebar']
    });

    expect(mockZendeskClient.get).toHaveBeenCalledWith('instances');
    expect(mockZendeskClient.instance).toHaveBeenCalledWith('id123');
    expect(mockZendeskClient.instance).toHaveBeenCalledWith('id456');
    expect(triggerMock).toHaveBeenCalledWith('event', undefined);
    expect(triggerMock).toHaveBeenCalledTimes(2);
  });
});
