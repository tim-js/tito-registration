import Api from "./Api";
import config from "../config";

export default class TitoCheckInApi {
  static getList(slug) {
    return Api.get(`${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}`);
  }

  static post(route, data, params = {}, customHeaders = {}) {
    return Api.post(
      `${config.TITO_CHECKIN_API_URL}${route}`,
      data,
      params,
      customHeaders
    );
  }

  static get(route, data = {}, customHeaders = {}) {
    return Api.get(
      `${config.TITO_CHECKIN_API_URL}${route}`,
      data,
      customHeaders
    );
  }

  static put(route, data, customHeaders = {}) {
    return Api.put(
      `${config.TITO_CHECKIN_API_URL}${route}`,
      data,
      customHeaders
    );
  }

  static delete(route, data, params, customHeaders = {}) {
    return Api.delete(
      `${config.TITO_CHECKIN_API_URL}${route}`,
      data,
      params,
      customHeaders
    );
  }
}
