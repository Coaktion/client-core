import { AxiosInstance } from 'axios';

import { AuthOptions } from './types';

export interface AuthBasic {
  authOptions: AuthOptions;
  client?: AxiosInstance;
  getToken(): Promise<object>;
}
