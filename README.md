# Client Core

![test workflow](https://github.com/Coaktion/client-core/actions/workflows/test.yml/badge.svg)
![stale workflow](https://github.com/Coaktion/client-core/actions/workflows/stale.yml/badge.svg)
![Release Draft workflow](https://github.com/Coaktion/client-core/actions/workflows/release-drafter.yml/badge.svg)

Client Core is a library helping you to create a client RestFul API.

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
import {
  AxiosClient,
  ClientOptionsAxios,
  converterPathParamsUrl
} from '@coaktion/client-core';
import { AxiosResponse } from 'axios';

class ApiClient extends AxiosClient {
  constructor(clientOptions: ClientOptionsAxios) {
    super(clientOptions);
  }

  async custom(id: string): Promise<AxiosResponse> {
    return this.makeRequest(
      'GET',
      converterPathParamsUrl('/resources/{id}/custom', { id })
    );
  }
}

const apiClient = new ApiClient('https://api.example.com');

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
