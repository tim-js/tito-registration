import Api from './Api';

export default class TitoCheckInApi {
  static BaseURL = "https://checkin.tito.io/";

  static post(route, data, params = {}, customHeaders = {}) {
    return Api.create().post(`${TitoCheckInApi.BaseURL}${route}`, data, params, customHeaders);
  }

  static get(route, data = {}, customHeaders = {}) {
    return Api.create().get(`${TitoCheckInApi.BaseURL}${route}`, data, customHeaders);
  }

  static put(route, data, customHeaders = {}) {
  return Api.create().put(`${TitoCheckInApi.BaseURL}${route}`, data, customHeaders);
  }

  static delete(route, data, params, customHeaders = {}) {
    return Api.create().delete(`${TitoCheckInApi.BaseURL}${route}`, data, params, customHeaders);
  }
}