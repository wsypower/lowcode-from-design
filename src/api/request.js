import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

// request拦截器,在请求之前做一些处理
service.interceptors.request.use(
  (config) => config,
  (error) => {
    Promise.reject(error)
  }
)

// response 拦截器,数据返回后进行一些处理
service.interceptors.response.use(
  (response) => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code === 2 || res.code === 200) {
      return res
    }
    // failed
    Promise.reject(res.msg)
  },
  (error) => {
    Promise.reject(error)
  }
)

export default service
