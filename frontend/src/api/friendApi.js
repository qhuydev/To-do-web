import axiosClient from './axiosClient'

const friendApi = {
  // 🔍 Tìm user theo email
  searchUserByEmail: (query) => {
    return axiosClient.get('/users/search', { params: { query } })
  },

  // 👤 Lấy thông tin user theo ID
  getUserById: (userId) => {
    return axiosClient.get(`/users/${userId}`)
  },

  // 📩 Gửi lời mời kết bạn
  sendFriendRequest: (userId) => {
    return axiosClient.post('/friendships/send', {
      friendId: userId,
    })
  },

  // 👥 Danh sách bạn bè
  getFriends: () => {
    return axiosClient.get('/friendships/friends')
  },

  // ⏳ Lời mời đang chờ (nhận được)
  getPendingRequests: () => {
    return axiosClient.get('/friendships/pending')
  },

  // 📤 Lời mời đã gửi
  getSentRequests: () => {
    return axiosClient.get('/friendships/sent')
  },

  // ✅ Chấp nhận lời mời
  acceptFriendRequest: (friendshipId) => {
    return axiosClient.put(`/friendships/${friendshipId}/accept`)
  },

  // ❌ Từ chối lời mời
  rejectFriendRequest: (friendshipId) => {
    return axiosClient.put(`/friendships/${friendshipId}/reject`)
  },

  // 🗑️ Xóa bạn / hủy kết bạn
  removeFriend: (friendshipId) => {
    return axiosClient.delete(`/friendships/${friendshipId}`)
  },
}

export default friendApi
