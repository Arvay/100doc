'use strict'

import axios from 'axios'
// import qs from 'qs'
// const domin = 'http://192.168.1.119:9090'//贾威达
const domin = 'http://liveapi.cn'// 程亚明
// const domin = ''
// const domin = 'http://weixin.100doc.com.cn'
axios.interceptors.request.use(config => {
  // loading
  const token = window.localStorage.getItem('yibai_token')
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = 'Bearer ' + token
    // console.log(config.headers.Authorization)
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    this.messageError(res.msg)
  }
  // if (res.data && (!res.data.success)) {
  //   alert(res.data.error_msg)
  // }
  return res
}

export default {
  post(url, data) {
    // console.log(data)
    return axios({
      method: 'post',
      // baseURL: 'https://cnodejs.org/api/v1', //
      baseURL: domin, // api  host
      url,
      // data: qs.stringify(data),
      data,
      timeout: 60000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  messageError(msg) {
    this.$notify.error({
      title: '错误',
      message: msg
    })
  },
  get(url, data) {
    return axios({
      method: 'get',
      // baseURL: 'https://cnodejs.org/api/v1',
      baseURL: domin, // api  host
      url,
      data, // get 请求时带的参数
      timeout: 60000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
