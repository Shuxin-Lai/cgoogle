/* eslint-disable prefer-const */
import axios, { type AxiosResponse } from 'axios'
import type { AxiosInstance, CreateAxiosDefaults, AxiosRequestConfig } from 'axios'
import makeError from 'make-error'
import type { Promisable, Stat } from '@/types'
import { L_TOKEN } from '@/constants'

import { merge } from 'lodash-es'

export interface VtHttpBackendData<T> {
  status: number
  message: string
  data: T
}

export interface VtHttpResponse<T> {
  data?: T | null
  stat: Stat
  requestId: string
  message?: string
  error?: InstanceType<typeof VtHttpError>
  rawError?: Error
  rawData?: VtHttpBackendData<T>
  rawResponse?: AxiosResponse<VtHttpBackendData<T>, any>
  status: number
}

export interface VtHttpOptions
  extends Omit<CreateAxiosDefaults, 'transformRequest' | 'transformResponse'> {
  beforeRequest?(config: VtHttpRequestConfig): Promisable<VtHttpRequestConfig>
  afterRequest?(
    response: VtHttpResponse<any>,
    config: VtHttpRequestConfig,
  ): Promisable<VtHttpResponse<any>>
}

export interface VtHttpRequestConfig extends Omit<AxiosRequestConfig, 'method'> {
  autoCancelDuplicated?: boolean
  autoThrowWhenError?: boolean
  cancelDuplicatedConfig?: {
    // cancel before
    cancelAfter?: boolean
    // cancel the following request
    // cancel both
  }
}

export const VtHttpError = makeError('VtHttpError')

export class VtHttp {
  private _axios: AxiosInstance
  private _options: VtHttpOptions
  private _requestMap = new Map<string, AbortController>()
  constructor(options?: VtHttpOptions) {
    this._axios = axios.create(options)
    this._options = options || {}
  }

  private async _update<T>(
    method: string,
    endpoint: string,
    data: any,
    config?: VtHttpRequestConfig,
  ): Promise<VtHttpResponse<T>> {
    const conf = config || {}
    conf.data = data
    return this.request<T>(method, endpoint, conf)
  }

  async post<T>(
    endpoint: string,
    data: any,
    config?: VtHttpRequestConfig,
  ): Promise<VtHttpResponse<T>> {
    return this._update('post', endpoint, data, config)
  }

  async put<T>(
    endpoint: string,
    data: any,
    config?: VtHttpRequestConfig,
  ): Promise<VtHttpResponse<T>> {
    return this._update('post', endpoint, data, config)
  }

  async remove<T>(
    endpoint: string,
    data: any,
    config?: VtHttpRequestConfig,
  ): Promise<VtHttpResponse<T>> {
    return this._update('post', endpoint, data, config)
  }

  async get<T>(
    endpoint: string,
    params: Record<string, any>,
    config?: VtHttpRequestConfig,
  ): Promise<VtHttpResponse<T>> {
    const conf = config || {}
    conf.params = params
    return this.request<T>('get', endpoint, conf)
  }

  async request<T>(
    method: string,
    endpoint: string,
    config?: VtHttpRequestConfig,
  ): Promise<VtHttpResponse<T>> {
    let conf = config as AxiosRequestConfig & VtHttpRequestConfig
    conf.method = method || 'get'
    conf.url = endpoint

    let result: VtHttpResponse<T> = {
      stat: 'init',
      requestId: '',
      status: 0,
    }

    if (this._options.beforeRequest) {
      conf = await this._options.beforeRequest(conf)
    }
    const requestId = this._getRequestId(conf)
    result.requestId = requestId
    const autoCancel = conf.autoCancelDuplicated
    const autoCancelConfig = conf.cancelDuplicatedConfig

    if (autoCancel && autoCancelConfig?.cancelAfter != true && this._requestMap.has(requestId)) {
      this._requestMap.get(requestId)!.abort()
    }
    if (autoCancel && autoCancelConfig?.cancelAfter == true) {
      result.error = new VtHttpError('canceled')
      result.rawError = result.error
      result.stat = 'canceled'
      result.message = 'canceled'
      if (conf.autoThrowWhenError !== false) {
        throw result.error
      }

      return result
    }

    try {
      if (autoCancel) {
        const controller = new AbortController()
        this._requestMap.set(requestId, controller)
        conf.signal = controller.signal
      }

      result.stat = 'pending'

      const response = await this._axios.request<VtHttpBackendData<T>>(conf)
      result.rawResponse = response
      result.data = response.data.data
      result.message = response.data.message
      result.status = response.data.status
      result.stat = 'success'
    } catch (err: any) {
      result.stat = 'error'
      result.rawError = err
      result.error = new VtHttpError(err.message)
    } finally {
      if (autoCancel) {
        this._requestMap.delete(requestId)
      }
    }

    if (this._options.afterRequest) {
      result = await this._options.afterRequest(result, conf)
    }

    if (
      conf.autoThrowWhenError !== false &&
      (result.stat == 'error' || result.stat == 'canceled')
    ) {
      throw result.error
    }

    return result
  }

  private _getRequestId(conf: AxiosRequestConfig<any>): string {
    let { method = 'get', url = '', data = {}, params = {} } = conf
    method = method.toLowerCase()
    const _p = method == 'get' ? JSON.stringify(params) : ''
    const _d = method != 'get' ? JSON.stringify(data) : ''

    return `${method}|${url}#${_p}_${_d}`
  }
}

export const vtHttp = new VtHttp({
  baseURL: import.meta.env.VITE_BASE_URL,
  beforeRequest(conf) {
    const token = window.localStorage.getItem(L_TOKEN)
    if (token != null) {
      conf.headers = merge(conf.headers || {}, {
        Authorization: token.startsWith('Bearer ') ? token : 'Bearer ' + token,
      })
    }

    return conf
  },
  afterRequest(response, config) {
    if (response.status == 500) {
      response.stat = 'error'
      response.error = new VtHttpError(response.message)
    }
    return response
  },
})
