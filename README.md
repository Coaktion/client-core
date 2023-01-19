# Client Core

Client Core is a libary helping you to create a client RestFul API.

## Installation

```bash
npm install @coaktion/client-core
```

## Generate docs

```bash
npm run generate-docs
```

## Usage

```typescript
import { AxiosResponse } from 'axios';
import { ClientBasic, ClientOptions } from 'client-core';

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

const apiClient = new ApiClient('https://api.example.com', {
  appName: 'my-app',
  authProvider: () => 'Bearer my-token',
  timeout: 10000,
  tries: 3,
  retryDelay: 1000
});

apiClient.search({ query: 'test' }).then((response) => {
  console.log(response.data);
});

apiClient.fetch('123').then((response) => {
  console.log(response.data);
});

apiClient.create({ name: 'test' }).then((response) => {
  console.log(response.data);
});

apiClient.update('123', { name: 'test' }).then((response) => {
  console.log(response.data);
});

apiClient.delete('123').then((response) => {
  console.log(response.data);
});

apiClient.custom('123').then((response) => {
  console.log(response.data);
});
```

## License

Client Core is [Copyright](./LICENSE).

## Author

[![GitHub](https://img.shields.io/github/followers/paulo-tinoco.svg?style=social&label=Paulo%20Tinoco)](https://github.com/paulo-tinoco)
