import axiosClient from './axiosClient'

const cardApi = {
  create: (listId, data) => axiosClient.post(`/lists/${listId}/cards`, data),
  
  createWithoutList: (data) => axiosClient.post(`cards`, data),
  
  getById: (cardId) => axiosClient.get(`/cards/${cardId}`),
  
  update: (cardId, data) => axiosClient.put(`/cards/${cardId}`, data),
  
  delete: (cardId) => axiosClient.delete(`/cards/${cardId}`),
  
  move: (cardId, data) => axiosClient.put(`/cards/${cardId}/move`, data),
}

export default cardApi
