export const queryParamsUrl = (url: string, params: any) => {
  const query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  return url + (query ? '?' + query : '');
};

export const converterPathParamsUrl = (url: string, params: any) => {
  return url.replace(/{([^}]+)}/g, (_, key) => {
    return params[key] || `{${key}}`;
  });
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
