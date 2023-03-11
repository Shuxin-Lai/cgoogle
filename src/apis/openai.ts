import { sleep } from '@/utils'
import type { CreateCompletionResponse, CreateCompletionRequest } from 'openai'
import { vtHttp } from './_http'

export async function createCompletion(data: CreateCompletionRequest) {
  const payload = { ...data }
  if (!data.stop || (Array.isArray(data.stop) && data.stop.length == 0)) {
    payload.stop = undefined
  }
  // return vtHttp.post<CreateCompletionResponse>('/openai/create', payload, {
  //   autoThrowWhenError: false,
  // })
  await sleep(200)
  return {
    stat: 'success',
    requestId:
      'post|/openai/create#_{"model":"text-davinci-003","max_tokens":100,"temperature":0,"top_p":1,"stop":["\\n"],"n":1,"prompt":"hello"}',
    status: 200,
    rawResponse: {
      data: {
        data: {
          id: 'cmpl-6sqI2OMjCMTsxRL6g72duvQpxdLci',
          object: 'text_completion',
          created: 1678528734,
          model: 'text-davinci-003',
          choices: [
            {
              text: "');",
              index: 0,
              logprobs: null,
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: 1,
            completion_tokens: 1,
            total_tokens: 2,
          },
        },
        message: 'success',
        status: 200,
      },
      status: 200,
      statusText: 'OK',
      headers: {
        'content-length': '303',
        'content-type': 'application/json; charset=utf-8',
      },
      config: {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false,
        },
        adapter: ['xhr', 'http'],
        transformRequest: [null],
        transformResponse: [null],
        timeout: 0,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {},
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        baseURL: 'http://34.168.137.125:8081',
        autoThrowWhenError: false,
        data: '{"model":"text-davinci-003","max_tokens":100,"temperature":0,"top_p":1,"stop":["\\n"],"n":1,"prompt":"hello"}',
        method: 'post',
        url: '/openai/create',
      },
      request: {},
    },
    data: {
      id: 'cmpl-6sqI2OMjCMTsxRL6g72duvQpxdLci',
      object: 'text_completion',
      created: 1678528734,
      model: 'text-davinci-003',
      choices: [
        {
          text: "');",
          index: 0,
          logprobs: null,
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 2,
      },
    },
    message: 'success',
  }
}
