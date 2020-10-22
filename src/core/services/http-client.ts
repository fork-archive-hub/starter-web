import { of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { ajax, AjaxResponse, AjaxError, AjaxRequest } from 'rxjs/ajax';

import { ServerResponse } from 'src/core/models/response.model';
import logger from 'starter/logger';
import { AJAX_TIMEOUT } from 'src/const/values';

class HttpClient {
  static get<T = any>(url: string, options: Options = {}) {
    options.method = 'GET';
    return this.sendRequest<T>(url, options);
  }

  static post<T = any>(url: string, options: Options = {}) {
    options.method = 'POST';
    return this.sendRequest<T>(url, options);
  }

  private static sendRequest<T>(url: string, options: Options = {}) {
    if (!url) {
      logger.error('[Ajax Error] Missing URL:', url);
      return of(null);
    }

    this.setUrl(url, options);
    this.setDefaultOptions(options);
    // this.setQueryString(options);

    return ajax(options).pipe(
      timeout(AJAX_TIMEOUT),
      map(resp => this.handleServerResponse<T>(resp, options)),
      catchError(err => this.handleErrorResponse(err, options))
    );
  }

  private static setUrl(url: string, options: Options) {
    options.url = url;
  }

  private static setDefaultOptions(options: Options) {
    options.createXHR = () => new XMLHttpRequest();
    options.crossDomain = true;
    // options.timeout = 4000;
  }

  private static handleServerResponse<T>(resp: AjaxResponse, options: Options) {
    if (!resp.response) {
      const err: Error = {
        name: 'server-response-null',
        message: `Server response was returned as null`,
      };
      this.handleErrorResponse(err, options);
      return null;
    }

    const response = resp.response as ServerResponse<T>;

    if (response.status !== 'ok') {
      const err: Error = {
        name: 'server-error',
        message: `Server error with error code ${response.errorCode} and error message: ${response.errorMsg}`,
      };
      this.handleErrorResponse(err, options);
      return null;
    }

    return response.data;
  }

  private static handleErrorResponse(err: AjaxError | Error, options: Options) {
    logger.error('[Ajax Error]', err, '\n', options);
    return of(null);
  }
}

export default HttpClient;

export interface Options extends AjaxRequest {}
