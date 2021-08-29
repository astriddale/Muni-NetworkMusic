import config from './config'

export default function request({
  url,
  data = {},
  method = 'GET'
}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.baseURL + url,
      method: method,
      data: data,
      timeout: 10000,
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}