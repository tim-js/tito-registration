import Api from '.Api';

export default class TitoAdminApi {
  static BaseURL = "https://api.tito.io/v3/";

  static customHeaders () {
      return { Authorization: `Token token=secret_live_kBSSKszg7XcZm-zuiwMD` };
  }

  static post(route, data, params = {}, customHeaders = {}) {
    return Api.create().post(`${BaseURL}${route}`, data, params, customHeaders);
  }

  static get(route, data = {}, customHeaders = {}) {
    return Api.create().get(`${BaseURL}${route}`, data, customHeaders);
  }

  static put(route, data, customHeaders = {}) {
  return Api.create().put(`${BaseURL}${route}`, data, customHeaders);
  }

  static delete(route, data, params, customHeaders = {}) {
    return Api.create().delete(`${BaseURL}${route}`, data, params, customHeaders);
  }
}