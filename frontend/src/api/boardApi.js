import axiosClient from './axiosClient'

const boardApi = {
  getAll: () => axiosClient.get('/boards'),
  
  getById: (boardId) => axiosClient.get(`/boards/${boardId}`),
  
  create: (data) => axiosClient.post('/boards', data),
  
  update: (boardId, data) => axiosClient.put(`/boards/${boardId}`, data),
  
  delete: (boardId) => axiosClient.delete(`/boards/${boardId}`),
  
  toggleStar: (boardId) => axiosClient.put(`/boards/${boardId}/star`),
  
  updateListOrder: (boardId, listOrderIds) => 
    axiosClient.put(`/boards/${boardId}/list-order`, listOrderIds),
}

export default boardApi
