import Api from './Api';
import config from '../config';

export default class TitoAdminApi {
  static post(route, data, params = {}, customHeaders = {}) {
    return Api.create().post(`${config.TITO_ADMIN_API_URL}${route}`, data, params, customHeaders);
  }

  static get(route, data = {}, customHeaders = {}) {
    return Api.create().get(`${config.TITO_ADMIN_API_URL}${route}`, data, customHeaders);
  }

  static put(route, data, customHeaders = {}) {
  return Api.create().put(`${config.TITO_ADMIN_API_URL}${route}`, data, customHeaders);
  }

  static delete(route, data, params, customHeaders = {}) {
    return Api.create().delete(`${config.TITO_ADMIN_API_URL}${route}`, data, params, customHeaders);
  }
}