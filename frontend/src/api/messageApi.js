import axiosClient from './axiosClient'

const messageApi = {
  // 📤 Gửi tin nhắn
  sendMessage: ({ receiverId, content, type = 'TEXT', cardData = null, cardId }) => {
    return axiosClient.post('/messages/send', {
      receiverId,
      content,
      cardId,
      type,
      cardData,
    })
  },

  // 💬 Xem lịch sử chat với 1 người
  getConversationWithUser: (otherUserId) => {
    return axiosClient.get(`/messages/conversation/${otherUserId}`)
  },

  // 📌 Đánh dấu 1 tin nhắn là đã đọc
  markMessageAsRead: (messageId) => {
    return axiosClient.put(`/messages/${messageId}/read`)
  },

  // 📌 Đánh dấu toàn bộ cuộc trò chuyện đã đọc
  markConversationAsRead: (otherUserId) => {
    return axiosClient.put(`/messages/conversation/${otherUserId}/read`)
  },

  // 📃 Danh sách các cuộc trò chuyện
  // Response: otherUser, lastMessage, unreadCount
  getConversations: () => {
    return axiosClient.get('/messages/conversations')
  },

  // 🔔 Tổng số tin nhắn chưa đọc
  getUnreadCount: () => {
    return axiosClient.get('/messages/unread-count')
  },

  // 🗑️ Xóa tin nhắn
  deleteMessage: (messageId) => {
    return axiosClient.delete(`/messages/${messageId}`)
  },
}

export default messageApi
