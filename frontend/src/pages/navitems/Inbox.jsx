import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Stack,
  Divider,
  Avatar,
  Button,
  CircularProgress
} from "@mui/material"
import friendApi from "~/api/friendApi"
import messageApi from "~/api/messageApi"
import ChatWidget from "~/components/ChatWidget/ChatWidget"
import AssignmentIcon from "@mui/icons-material/Assignment"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import MessageIcon from "@mui/icons-material/Message"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"

function Inbox() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeChats, setActiveChats] = useState([])

  // Fetch data từ API
  useEffect(() => {
    fetchInboxData()
  }, [])

  const formatTimeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays === 1) return "Hôm qua"
    if (diffDays < 7) return `${diffDays} ngày trước`
    return past.toLocaleDateString('vi-VN')
  }

  const fetchInboxData = async () => {
    setLoading(true)
    try {
      const [friendRequests, conversations] = await Promise.all([
        friendApi.getPendingRequests(),
        messageApi.getConversations(),
      ])

      const inboxItems = []

      // Lời mời kết bạn
      if (friendRequests?.data) {
        friendRequests.data.forEach((request) => {
          inboxItems.push({
            id: `friend_${request.id}`,
            type: "friend_request",
            friendshipId: request.id,
            user: {
              name: request.sender?.fullname || request.sender?.email || "Unknown",
              avatar: request.sender?.avatar || null,
              id: request.sender?.id,
            },
            message: "đã gửi lời mời kết bạn",
            date: formatTimeAgo(request.createdAt),
            timestamp: new Date(request.createdAt),
          })
        })
      }

      // Tin nhắn và task assigned
      if (conversations?.data) {
        conversations.data.forEach((conversation) => {
          const lastMessage = conversation.lastMessage
          if (!lastMessage) return

          // Chỉ hiển thị tin nhắn chưa đọc
          if (conversation.unreadCount > 0) {
            if (lastMessage.type === 'TEXT') {
              // Tin nhắn text
              inboxItems.push({
                id: `message_${lastMessage.id}`,
                type: "message",
                messageId: lastMessage.id,
                user: {
                  name: conversation.otherUser?.fullname || conversation.otherUser?.email || "Unknown",
                  avatar: conversation.otherUser?.avatar || null,
                  id: conversation.otherUser?.id,
                },
                message: "vừa nhắn tin cho bạn",
                content: lastMessage.content,
                date: formatTimeAgo(lastMessage.createdAt),
                timestamp: new Date(lastMessage.createdAt),
              })
            } else if (lastMessage.type === 'CARD') {
              // Task assigned
              inboxItems.push({
                id: `task_${lastMessage.id}`,
                type: "task_assigned",
                messageId: lastMessage.id,
                cardId: lastMessage.cardId,
                user: {
                  name: conversation.otherUser?.fullname || conversation.otherUser?.email || "Unknown",
                  avatar: conversation.otherUser?.avatar || null,
                  id: conversation.otherUser?.id,
                },
                message: "vừa giao công việc cho bạn",
                taskTitle: lastMessage.content || "Công việc mới",
                date: formatTimeAgo(lastMessage.createdAt),
                timestamp: new Date(lastMessage.createdAt),
              })
            }
          }
        })
      }

      // Sắp xếp theo thời gian mới nhất
      inboxItems.sort((a, b) => b.timestamp - a.timestamp)

      setItems(inboxItems)
    } catch (error) {
      console.error("Error fetching inbox data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    if (!value.trim()) {
      setIsAdding(false)
      return
    }

    setItems(prev => [
      {
        id: Date.now(),
        type: "task_assigned",
        user: {
          name: "You",
          avatar: null,
        },
        message: "tạo task mới",
        taskTitle: value.trim(),
        date: "Vừa xong",
        timestamp: new Date(),
      },
      ...prev,
    ])

    setValue("")
    setIsAdding(false)
  }

  const handleAcceptFriend = async (item) => {
    try {
      await friendApi.acceptFriendRequest(item.friendshipId)
      setItems(prev => prev.filter(i => i.id !== item.id))
      setOpen(false)
    } catch (error) {
      console.error("Error accepting friend request:", error)
      alert("Không thể chấp nhận lời mời. Vui lòng thử lại!")
    }
  }

  const handleRejectFriend = async (item) => {
    try {
      await friendApi.rejectFriendRequest(item.friendshipId)
      setItems(prev => prev.filter(i => i.id !== item.id))
      setOpen(false)
    } catch (error) {
      console.error("Error rejecting friend request:", error)
      alert("Không thể từ chối lời mời. Vui lòng thử lại!")
    }
  }

  const handleDeleteNotification = async (item) => {
    try {
      if (item.messageId) {
        await messageApi.markMessageAsRead(item.messageId)
      }
      setItems(prev => prev.filter(i => i.id !== item.id))
      setOpen(false)
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

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
    setOpen(false) // Đóng dialog
  }

  const handleCloseChat = (friendId) => {
    setActiveChats(prev => prev.filter(chat => chat.friend.id !== friendId))
  }

  const handleToggleMinimize = (friendId) => {
    setActiveChats(prev => prev.map(chat => 
      chat.friend.id === friendId ? { ...chat, isMinimized: !chat.isMinimized } : chat
    ))
  }

  const typeMap = {
    friend_request: { 
      label: "Lời mời kết bạn", 
      color: "primary",
      icon: <PersonAddIcon fontSize="small" />
    },
    message: { 
      label: "Tin nhắn mới", 
      color: "info",
      icon: <MessageIcon fontSize="small" />
    },
    task_assigned: { 
      label: "Công việc mới", 
      color: "success",
      icon: <AssignmentIcon fontSize="small" />
    },
  }

  return (
    <>
      <Box
        sx={{
          width: 340,
          minHeight: "100vh",
          bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "#1e272e"
            : "#f1f2f6",
          p: 2.5,
        }}
      >
        {/* ===== HEADER ===== */}
        <Typography variant="h6" fontWeight={700}>
          📥 Inbox
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
          All unprocessed tasks and notifications
        </Typography>

        {/* ===== QUICK ADD ===== */}
        {!isAdding ? (
          <Box
            onClick={() => setIsAdding(true)}
            sx={{
              mb: 2,
              p: 1.2,
              bgcolor: "#fff",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#888",
              boxShadow: 1,
            }}
          >
            + Add quick task
          </Box>
        ) : (
          <TextField
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type and press Enter"
            fullWidth
            size="small"
            onBlur={handleAdd}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
              if (e.key === "Escape") {
                setValue("")
                setIsAdding(false)
              }
            }}
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: "10px",
            }}
          />
        )}

        {/* ===== LIST ===== */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography variant="body2">Không có thông báo nào</Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {items.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                setSelectedItem(item)
                setOpen(true)
              }}
              sx={{
                borderRadius: "12px",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 3,
                  bgcolor: "#f0f3ff",
                },
              }}
            >
              <CardContent sx={{ p: 1.8 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    {/* Avatar */}
                    <Avatar 
                      src={item.user.avatar} 
                      alt={item.user.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {item.user.name.charAt(0)}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>{item.user.name}</strong> {item.message}
                      </Typography>

                      {/* Task Title for task_assigned */}
                      {item.type === "task_assigned" && item.taskTitle && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "text.secondary",
                            bgcolor: "action.hover",
                            p: 0.8,
                            borderRadius: 1,
                            mt: 0.5
                          }}
                        >
                          📋 {item.taskTitle}
                        </Typography>
                      )}

                      {/* Message Content for message type */}
                      {item.type === "message" && item.content && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "text.secondary",
                            fontStyle: "italic",
                            mt: 0.5
                          }}
                        >
                          "{item.content}"
                        </Typography>
                      )}

                      {/* Date and Type */}
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <Chip
                          size="small"
                          label={typeMap[item.type].label}
                          color={typeMap[item.type].color}
                          icon={typeMap[item.type].icon}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.date}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
          </Stack>
        )}
      </Box>

      {/* ===== DETAIL DIALOG ===== */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              src={selectedItem?.user.avatar} 
              alt={selectedItem?.user.name}
              sx={{ width: 50, height: 50 }}
            >
              {selectedItem?.user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {selectedItem?.user.name}
              </Typography>
              <Chip
                size="small"
                label={selectedItem && typeMap[selectedItem.type].label}
                color={selectedItem && typeMap[selectedItem.type].color}
                icon={selectedItem && typeMap[selectedItem.type].icon}
              />
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              {selectedItem?.message}
            </Typography>

            {/* Task Title */}
            {selectedItem?.type === "task_assigned" && selectedItem?.taskTitle && (
              <Box sx={{ 
                bgcolor: "action.hover", 
                p: 2, 
                borderRadius: 2,
                borderLeft: "4px solid",
                borderColor: "success.main"
              }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Công việc:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedItem.taskTitle}
                </Typography>
              </Box>
            )}

            {/* Message Content */}
            {selectedItem?.type === "message" && selectedItem?.content && (
              <Box sx={{ 
                bgcolor: "info.lighter", 
                p: 2, 
                borderRadius: 2,
                borderLeft: "4px solid",
                borderColor: "info.main"
              }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Tin nhắn:
                </Typography>
                <Typography variant="body1">
                  "{selectedItem.content}"
                </Typography>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary">
              {selectedItem?.date}
            </Typography>

            <Divider />

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {selectedItem?.type === "friend_request" ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={() => handleAcceptFriend(selectedItem)}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => handleRejectFriend(selectedItem)}
                  >
                    Từ chối
                  </Button>
                </>
              ) : selectedItem?.type === "message" ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MessageIcon />}
                    onClick={() => {
                      handleOpenChat({
                        id: selectedItem.user.id,
                        fullname: selectedItem.user.name,
                        displayName: selectedItem.user.name, // ChatWidget sử dụng displayName
                        avatar: selectedItem.user.avatar,
                      })
                    }}
                  >
                    Trả lời
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteNotification(selectedItem)}
                  >
                    Đánh dấu đã đọc
                  </Button>
                </>
              ) : selectedItem?.type === "task_assigned" ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AssignmentIcon />}
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    Xem công việc
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteNotification(selectedItem)}
                  >
                    Đánh dấu đã đọc
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleDeleteNotification(selectedItem)}
                >
                  Xóa thông báo
                </Button>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Chat Widgets */}
      {activeChats.map((chat, index) => (
        <ChatWidget
          key={chat.friend.id}
          friend={chat.friend}
          onClose={() => handleCloseChat(chat.friend.id)}
          isMinimized={chat.isMinimized}
          onToggleMinimize={() => handleToggleMinimize(chat.friend.id)}
          position={index}
        />
      ))}
    </>
  )
}

export default Inbox
