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
      header: {
        cookie: uni.getStorageSync('cookies') ? uni.getStorageSync('cookies').find(item => {
          return item.indexOf('MUSIC_U') !== -1
        }) : ''
      },
      success: (res) => {
        if (data.isLogin) {
          uni.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail: (res) => {
        reject(res)
      }
    })
  })
}