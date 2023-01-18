import { AxiosResponse } from 'axios';

import { ClientBasic } from '../src/base';
import { ClientOptions } from '../src/types';

class ApiClient extends ClientBasic {
  constructor(baseUrl: string, options: ClientOptions) {
    super(baseUrl, {
      appName: options.appName,
      authProvider: options.authProvider,
      timeout: options.timeout,
      tries: options.tries,
      retryDelay: options.retryDelay,
      endpoints: {
        search: '/resources',
        fetch: '/resources/:id',
        create: '/resources',
        update: '/resources/:id',
        delete: '/resources/:id'
      }
    });
  }

  async custom(id: string): Promise<AxiosResponse> {
    return this.makeRequest('GET', '/resources/:id/custom'.replace(':id', id));
  }
}

export { ApiClient };
