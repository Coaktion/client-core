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

## Zendesk OAuth (API Token replacement)

Zendesk is removing API Tokens as an authentication method (no new tokens
after 2026-10-27, full shutdown on 2027-04-30). The replacement for
server-to-server integrations is OAuth `client_credentials`, supported via
`ClientCredentialsAuthZendesk`:

```typescript
import {
  AxiosClient,
  ClientCredentialsAuthZendesk
} from '@coaktion/client-core';

const apiClient = new AxiosClient({
  baseURL: 'https://mycompany.zendesk.com',
  forceAuth: true, // authenticate on every request (cheap: the token is cached)
  endpoints: { search: '/api/v2/tickets' },
  authProvider: new ClientCredentialsAuthZendesk({
    subdomain: 'mycompany',
    clientId: 'my_integration',
    clientSecret: process.env.ZENDESK_CLIENT_SECRET, // never commit it
    scope: 'tickets:read tickets:write' // required: no scope = no permissions
  })
});
```

The provider requests the token from `POST /oauth/tokens` (grant-type
endpoint), caches it in memory and renews it 60s before expiry —
`client_credentials` has no refresh token. On a 401 the client invalidates
the cached token and retries with a fresh one.

## License

Client Core is [Copyright](./LICENSE).

## Author

[![GitHub](https://img.shields.io/github/followers/paulo-tinoco.svg?style=social&label=Paulo%20Tinoco)](https://github.com/paulo-tinoco)
