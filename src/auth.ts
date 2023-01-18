import axios, { AxiosResponse } from 'axios';

import { AuthConfig } from './types';

class AuthProvider {
	private authConfig: AuthConfig;
	constructor(config: AuthConfig) {
		this.authConfig = config;
	}

	async getAccessToken(): Promise<string> {
		return axios
			.request({
				method: this.authConfig.method,
				url: this.authConfig.baseUrl + this.authConfig.endpoint,
				auth: {
					username: this.authConfig.clientId,
					password: this.authConfig.clientSecret
				},
				params: {
					grant_type: this.authConfig.type,
					username: this.authConfig.username,
					password: this.authConfig.password
				}
			})
			.then((response: AxiosResponse) => {
				return response.data.access_token;
			});
	}
}

export { AuthProvider };
