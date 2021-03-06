import axios from "axios";

export default class Api {
  static create() {
    return new Api();
  }

  // static requestErrorHandler(error) {
  //   throw Api.parseError(error);
  // }

  // static parseError(error) {
  //   let message = error.message;
  //   let stack = error.stack;
  //   let errorData = error;

  //   if (error.response) {
  //     errorData = error.response;

  //     if (error.response.status === 401) {
  //       message = "Access denied.";
  //       // } else if (error.response.status === 404) {
  //       //   message = "Not found."
  //     } else if (error.response.data) {
  //       message =
  //         error.response.data.message ||
  //         `Unknown error ${error.response.status}`;
  //       stack = error.response.data.stacktrace;
  //     }
  //   } else if (error.request) {
  //     errorData = error.request;

  //     message = "No response from server";
  //   }

  //   return { ...errorData, message, stack };
  // }

  static post(url, data, params = {}, customHeaders = {}) {
    return Api.create().post(url, data, params, customHeaders);
  }

  static get(url, data = {}, customHeaders = {}) {
    return Api.create().get(url, data, customHeaders);
  }

  static put(url, data, customHeaders = {}) {
    return Api.create().put(url, data, customHeaders);
  }

  static delete(url, data, params, customHeaders = {}) {
    return Api.create().delete(url, data, params, customHeaders);
  }

  post(url, data, params, customHeaders) {
    const requestConfig = {
      method: "POST",
      url: `${url}`,
      data,
      params,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    return this.request(requestConfig, customHeaders);
  }

  get(url, data, customHeaders) {
    const requestConfig = {
      method: "GET",
      url: `${url}`,
      params: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    return this.request(requestConfig, customHeaders);
  }

  put(url, data, customHeaders) {
    const requestConfig = {
      method: "PUT",
      url: `${url}`,
      data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    return this.request(requestConfig, customHeaders);
  }

  delete(url, data, params, customHeaders) {
    const requestConfig = {
      method: "DELETE",
      url: `${url}`,
      data,
      params,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };

    return this.request(requestConfig, customHeaders);
  }

  request(requestConfig, customHeaders) {
    Object.assign(requestConfig.headers, customHeaders);

    const req = axios(requestConfig);

    // this is weird to be here, it outputs warning for unhandled Promises
    // even is they are handled
    // req.catch(Api.requestErrorHandler);

    return req;
  }
}
