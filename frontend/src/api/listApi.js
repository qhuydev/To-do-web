import axiosClient from './axiosClient'

const listApi = {
  create: (boardId, data) => axiosClient.post(`/boards/${boardId}/lists`, data),
  
  getWithCards: (listId) => axiosClient.get(`/lists/${listId}`),
  
  update: (listId, data) => axiosClient.put(`/lists/${listId}`, data),
  
  delete: (listId) => axiosClient.delete(`/lists/${listId}`),
  
  updateCardOrder: (listId, cardOrderIds) => 
    axiosClient.put(`/lists/${listId}/card-order`, cardOrderIds),
}

export default listApi
