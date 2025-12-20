import { useState, useRef, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Avatar,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Cancel'
import MinimizeIcon from '@mui/icons-material/DoNotDisturbOn'
import SendIcon from '@mui/icons-material/Send'
import AddIcon from '@mui/icons-material/Add'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { messageApi, cardApi } from '~/api'
import { useAuthStore } from '~/stores'
import CardItem from '../../pages/Boards/BoardContent/ListColumns/Columns/ListCards/Card/CardItem'
import EditCardModal from '../../pages/Boards/BoardContent/ListColumns/Columns/ListCards/Card/EditCardModal'

function ChatWidget({ friend, onClose, isMinimized, onToggleMinimize, position = 0 }) {
    const { user } = useAuthStore()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
    const messagesEndRef = useRef(null)

    const cardMessages = messages.filter(msg => msg.type === 'CARD' && msg.card?.id)
    const cardIds = cardMessages.map(msg => `chat-card-${msg.card.id}`)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Load conversation khi mở chat
    useEffect(() => {
        if (friend?.id) {
            loadConversation()
            // Đánh dấu đã đọc
            messageApi.markConversationAsRead(friend.id).catch(console.error)
        }
    }, [friend?.id])

    const loadConversation = async () => {
        setIsLoading(true)
        try {
            const res = await messageApi.getConversationWithUser(friend.id)
            const conversationMessages = res.data || []

            // Transform messages to component format
            const formattedMessages = conversationMessages.map(msg => ({
                id: msg.id,
                text: msg.content,
                isMine: msg.senderId === user?.id,
                timestamp: new Date(msg.createdAt),
                isRead: msg.isRead,
                type: msg.type || 'TEXT',
                card: msg.card || null,
            }))

            setMessages(formattedMessages)
        } catch (error) {
            console.error('Error loading conversation:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!message.trim() || isSending) return

        const messageText = message.trim()
        setMessage('')
        setIsSending(true)

        try {
            const res = await messageApi.sendMessage({
                receiverId: friend.id,
                content: messageText,
                messageType: 'TEXT',
            })

            const sentMessage = res.data
            const newMessage = {
                id: sentMessage.id,
                text: sentMessage.content,
                isMine: true,
                timestamp: new Date(sentMessage.createdAt),
                isRead: sentMessage.isRead,
                type: 'TEXT',
                card: null,
            }

            setMessages(prev => [...prev, newMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            setMessage(messageText)
        } finally {
            setIsSending(false)
        }
    }

    const handleCardDelete = async (cardId, messageId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa card này?')) return

        try {
            await cardApi.delete(cardId)
            await messageApi.deleteMessage(messageId)
            setMessages(prev => prev.filter(msg => msg.id !== messageId))
        } catch (error) {
            console.error('Error deleting card/message:', error)
            alert('Không thể xóa card. Vui lòng thử lại!')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Tính toán vị trí dựa trên position index
    const bottomPosition = 20 + (position * 70) // Mỗi avatar cách nhau 70px
    const rightPosition = 20

    if (isMinimized) {
        // Hiển thị chỉ avatar khi minimize
        return (
            <Paper
                elevation={4}
                sx={{
                    position: 'fixed',
                    bottom: bottomPosition,
                    right: rightPosition,
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1200,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: 6,
                    },
                }}
                onClick={onToggleMinimize}
            >
                <Avatar
                    src={friend?.avatar}
                    sx={{ width: 56, height: 56 }}
                >
                    {!friend?.avatar && friend?.displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <CloseIcon
                    sx={{
                        fontSize: 14,
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        color: 'white',
                        width: 20,
                        height: 20,
                        cursor: 'pointer',
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                />
            </Paper>
        )
    }

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 350,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1300,
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 1.5,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(162, 162, 162, 0.77)' : 'rgba(28, 127, 158, 0.9)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Avatar src={friend?.avatar} sx={{ width: 32, height: 32 }}>
                    {!friend?.avatar && friend?.displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                    {friend?.displayName || 'User'}
                </Typography>
                <IconButton size="small" sx={{ color: 'white' }} onClick={onToggleMinimize}>
                    <MinimizeIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }} onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Messages */}
            <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        overflowY: 'auto',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress size={30} />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 4 }}
                    >
                        Bắt đầu cuộc trò chuyện
                    </Typography>
                ) : (
                    messages.map(msg => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.isMine ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {msg.type === 'CARD' ? (
                                <CardItem 
                                    card={msg.card} 
                                    onDelete={() => handleCardDelete(msg.card?.id, msg.id)}
                                />
                            ) : (
                                <Paper
                                    title={msg.timestamp.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    sx={{
                                        px: '12px',
                                        py: '8px',
                                        maxWidth: '70%',
                                        bgcolor: msg.isMine ? '#4933fb' : '#f0f0f0',
                                        color: msg.isMine ? 'white' : '#050505',
                                        wordBreak: 'break-word',
                                        position: 'relative',
                                        borderRadius: 4,
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>

                                </Paper>
                            )}
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>
            </SortableContext>

            {/* Input */}
            <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        color="primary"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        disabled={isSending}
                    >
                        <AddIcon />
                    </IconButton>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        multiline
                        maxRows={3}
                        disabled={isSending}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending}
                    >
                        {isSending ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                </Box>
            </Box>

            {/* Menu for adding card */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => {
                    setAnchorEl(null)
                    setIsCardDialogOpen(true)
                }}>
                    <ListItemIcon>
                        <AssignmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Giao việc</ListItemText>
                </MenuItem>
            </Menu>

            {/* Assign Task Modal */}
            <EditCardModal
                open={isCardDialogOpen}
                onClose={() => setIsCardDialogOpen(false)}
                onSave={loadConversation}
                mode="assign"
                receiverId={friend?.id}
            />
        </Paper>
    )
}

export default ChatWidget
