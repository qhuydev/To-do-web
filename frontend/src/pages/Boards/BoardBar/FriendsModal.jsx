import { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import { friendApi } from '~/api'
import { useAuthStore } from '~/stores'
import ChatWidget from '~/components/ChatWidget/ChatWidget'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  maxHeight: '80vh',
  minHeight: '60vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  padding: 2,
}

function FriendsModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const { user } = useAuthStore()

  const [friends, setFriends] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])

  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [isSearching, setIsSearching] = useState(false)
  const [loadingId, setLoadingId] = useState(null)
  const [error, setError] = useState('')
  const [activeChats, setActiveChats] = useState([])

  const handleOpenChat = (friend) => {
    // Kiểm tra xem chat đã tồn tại chưa
    const existingChat = activeChats.find(chat => chat.friend.id === friend.id)
    if (existingChat) {
      // Nếu đã có, expand nó
      setActiveChats(prev => prev.map(chat => 
        chat.friend.id === friend.id ? { ...chat, isMinimized: false } : chat
      ))
    } else {
      // Nếu chưa có, thêm mới
      setActiveChats(prev => [...prev, { friend, isMinimized: false }])
    }
  }

  const handleCloseChat = (friendId) => {
    setActiveChats(prev => prev.filter(chat => chat.friend.id !== friendId))
  }

  const handleToggleMinimize = (friendId) => {
    setActiveChats(prev => prev.map(chat => 
      chat.friend.id === friendId ? { ...chat, isMinimized: !chat.isMinimized } : chat
    ))
  }

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    if (open) {
      loadFriends()
      loadFriendRequests()
    }
  }, [open])

  const loadFriends = async () => {
    try {
      const res = await friendApi.getFriends()
      const friendships = res.data || []
      
      // Fetch thông tin user cho từng friendship
      // Nếu current user là userId thì lấy friendId, ngược lại lấy userId
      const friendsWithDetails = await Promise.all(
        friendships.map(async (f) => {
          try {
            const friendUserId = f.userId === user?.id ? f.friendId : f.userId
            const userRes = await friendApi.getUserById(friendUserId)
            return { ...f, friend: userRes.data }
          } catch (e) {
            console.error('Error fetching friend:', e)
            return f
          }
        })
      )
      
      setFriends(friendsWithDetails)
    } catch (e) {
      console.error(e)
    }
  }

  const loadFriendRequests = async () => {
    try {
      const [pendingRes, sentRes] = await Promise.all([
        friendApi.getPendingRequests(),
        friendApi.getSentRequests(),
      ])
      
      const pendingRequests = pendingRes.data || []
      const sentRequests = sentRes.data || []
      
      // Fetch thông tin sender cho pending requests (lấy userId - người gửi)
      const pendingWithDetails = await Promise.all(
        pendingRequests.map(async (r) => {
          try {
            const userRes = await friendApi.getUserById(r.userId)
            return { ...r, sender: userRes.data }
          } catch (e) {
            console.error('Error fetching sender:', e)
            return r
          }
        })
      )
      
      // Fetch thông tin friend cho sent requests (lấy friendId - người nhận)
      const sentWithDetails = await Promise.all(
        sentRequests.map(async (r) => {
          try {
            const userRes = await friendApi.getUserById(r.friendId)
            return { ...r, friend: userRes.data }
          } catch (e) {
            console.error('Error fetching friend:', e)
            return r
          }
        })
      )
      
      setReceivedRequests(pendingWithDetails)
      setSentRequests(sentWithDetails)
    } catch (e) {
      console.error(e)
    }
  }

  /* ===================== SEARCH ===================== */
  const handleSearchFriend = async () => {
    if (!searchEmail.trim()) return

    setIsSearching(true)
    setError('')
    setSearchResults([])

    try {
      const res = await friendApi.searchUserByEmail(searchEmail)
      const users = res.data || []

      if (!users || users.length === 0) {
        setError('Không tìm thấy user')
      } else {
        const results = users.map(user => {
          const isFriend = friends.some(f => f.friend?.id === user.id)
          const hasPendingRequest = [...receivedRequests, ...sentRequests].some(
            r => r.friend?.id === user.id
          )
          return { ...user, isFriend, hasPendingRequest }
        })
        setSearchResults(results)
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Không tìm thấy user')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSendFriendRequest = async (userId) => {
    setLoadingId(userId)
    setError('')

    try {
      await friendApi.sendFriendRequest(userId)
      setSearchResults(prev =>
        prev.map(u => (u.id === userId ? { ...u, hasPendingRequest: true } : u))
      )
      await loadFriendRequests()
    } catch (e) {
      setError(e.response?.data?.message || 'Gửi lời mời thất bại')
    } finally {
      setLoadingId(null)
    }
  }

  /* ===================== REQUEST ACTIONS ===================== */
  const handleAccept = async (friendshipId) => {
    setLoadingId(friendshipId)
    try {
      await friendApi.acceptFriendRequest(friendshipId)
      await loadFriends()
      await loadFriendRequests()
    } catch (e) {
      setError('Chấp nhận lời mời thất bại')
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (friendshipId) => {
    setLoadingId(friendshipId)
    try {
      await friendApi.rejectFriendRequest(friendshipId)
      await loadFriendRequests()
    } catch (e) {
      setError('Từ chối lời mời thất bại')
    } finally {
      setLoadingId(null)
    }
  }

  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bạn bè này?')) return

    setLoadingId(friendshipId)
    try {
      await friendApi.removeFriend(friendshipId)
      await loadFriends()
    } catch (e) {
      setError('Xóa bạn bè thất bại')
    } finally {
      setLoadingId(null)
    }
  }

  /* ===================== RENDER ===================== */
  return (
    <>
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={600}>Bạn bè</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`Bạn bè (${friends.length})`} />
          <Tab label={`Lời mời (${receivedRequests.length + sentRequests.length})`} />
          <Tab label="Tìm kiếm" />
        </Tabs>

        {/* Content */}
        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* TAB 0: FRIENDS */}
          {activeTab === 0 && (
            <List>
              {friends.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  Chưa có bạn bè
                </Typography>
              ) : (
                friends.map(f => (
                  <ListItem
                    key={f.id}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenChat(f.friend)}
                        >
                          Nhắn tin
                        </Button>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleRemoveFriend(f.id)}
                          disabled={loadingId === f.id}
                        >
                          Xóa
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={f.friend?.avatar}>{!f.friend?.avatar && f.friend?.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={f.friend?.displayName || 'User'}
                      secondary={f.friend?.email}
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}

          {/* TAB 1: REQUESTS */}
          {activeTab === 1 && (
            <Box>
              {/* Lời mời kết bạn */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 1 }}>
                Lời mời kết bạn ({receivedRequests.length})
              </Typography>
              {receivedRequests.length === 0 ? (
                <Typography align="center" color="text.secondary" sx={{ py: 2, fontSize: '0.875rem' }}>
                  Không có lời mời nào
                </Typography>
              ) : (
                receivedRequests.map(r => {
                  const sender = r.sender || r.friend
                  return (
                    <Box key={r.id}>
                      <ListItem
                        secondaryAction={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" onClick={() => handleAccept(r.id)}>
                              Chấp nhận
                            </Button>
                            <Button size="small" color="error" onClick={() => handleReject(r.id)}>
                              Từ chối
                            </Button>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={sender?.avatar}>{!sender?.avatar && sender?.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={sender?.displayName || 'User'} secondary={sender?.email} />
                      </ListItem>
                      <Divider />
                    </Box>
                  )
                })
              )}

              {/* Lời mời đã gửi */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: 3 }}>
                Lời mời đã gửi ({sentRequests.length})
              </Typography>
              {sentRequests.length === 0 ? (
                <Typography align="center" color="text.secondary" sx={{ py: 2, fontSize: '0.875rem' }}>
                  Chưa gửi lời mời nào
                </Typography>
              ) : (
                sentRequests.map(r => (
                  <Box key={r.id}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PendingIcon fontSize="small" />
                          <Typography variant="caption">Đang chờ</Typography>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={r.friend?.avatar}>{!r.friend?.avatar && r.friend?.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={r.friend?.displayName || 'User'} secondary={r.friend?.email} />
                    </ListItem>
                    <Divider />
                  </Box>
                ))
              )}
            </Box>
          )}

          {/* TAB 2: SEARCH */}
          {activeTab === 2 && (
            <Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập email để tìm"
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchFriend()}
                InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              />

              {isSearching && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <CircularProgress />
                </Box>
              )}

              {!isSearching && searchResults.map(u => (
                <ListItem
                  key={u.id}
                  secondaryAction={
                    u.isFriend ? (
                      <CheckCircleIcon color="success" />
                    ) : u.hasPendingRequest ? (
                      <Typography variant="caption">Đã gửi</Typography>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleSendFriendRequest(u.id)}
                        disabled={loadingId === u.id}
                      >
                        Kết bạn
                      </Button>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={u.avatar}>{!u.avatar && u.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={u.displayName || 'User'} secondary={u.email} />
                </ListItem>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>

    {/* Chat Widgets - Render outside Modal */}
    {activeChats.map((chat, index) => (
      <ChatWidget
        key={chat.friend.id}
        friend={chat.friend}
        isMinimized={chat.isMinimized}
        position={index}
        onClose={() => handleCloseChat(chat.friend.id)}
        onToggleMinimize={() => handleToggleMinimize(chat.friend.id)}
      />
    ))}
    </>
  )
}

export default FriendsModal
