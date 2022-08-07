/**
 * 用于 public-config 接口的简易 ajax 封装
 */

export interface AjaxRequest {
  method: 'GET' | 'get' | 'POST' | 'post'
  url: string
  data?: any // post
}

interface AjaxResponse {
  [prop: string]: any
}

export async function ajax(options: AjaxRequest): Promise<AjaxResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const method = options.method.toUpperCase()

    if (method === 'GET') {
      xhr.open(method, options.url, true)
    }

    if (method === 'POST') {
      xhr.open(method, options.url, true)
      xhr.setRequestHeader('Content-type', 'application/json')
      xhr.send(JSON.stringify(options.data))
    } else {
      xhr.send()
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4 || xhr.status === 0) return

      const responseData: AjaxResponse = JSON.parse(xhr.response)

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(responseData)
      } else {
        reject(`request failed with status code ${xhr.status}`)
      }
    }
  })
}
