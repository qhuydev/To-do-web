import axiosClient from './axiosClient'

const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  
  login: (data) => axiosClient.post('/auth/login', data),
  
  refreshToken: (refreshToken) => axiosClient.post('/auth/refresh', { refreshToken }),
}

export default authApi
