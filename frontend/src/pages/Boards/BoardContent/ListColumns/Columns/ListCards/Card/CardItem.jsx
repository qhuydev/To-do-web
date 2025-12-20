import { useState } from 'react'
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Checkbox from "@mui/material/Checkbox"
import Chip from "@mui/material/Chip"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '~/stores'
import EditCardModal from './EditCardModal'

function CardItem({ card, listId, showSnackbar, isDragOverlay = false, onDelete, disableDndKit = false, onCardDragStart, onCardDragEnd }) {
  const { deleteCard, updateCard } = useBoardStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isCompleted, setIsCompleted] = useState(card?.completed || false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Use prefixed ID for cards from ChatWidget to avoid collision
  const cardId = !listId ? `chat-card-${card?.id}` : card?.id

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardId,
    data: { type: 'card', ...card, fromChat: !listId },
    disabled: isDragOverlay || disableDndKit,
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : card?._isPlaceholder ? 0.5 : 1,
    ...(isDragOverlay && {
      rotate: '5deg'
    }),
  }

  const open = Boolean(anchorEl)

  // Nếu là placeholder, render card đơn giản
  if (card?._isPlaceholder) {
    return (
      <Card
        ref={setNodeRef}
        style={dndKitCardStyles}
        sx={{
          minWidth: 240,
          boxShadow: '0 1px 1px rgba(9,30,66,0.25)',
          borderRadius: '8px',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(44,47,51,0.5)' : 'rgba(0,0,0,0.05)',
          border: '2px dashed',
          borderColor: 'primary.main',
          minHeight: 80,
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              wordBreak: 'break-word',
              color: 'text.secondary',
              lineHeight: 1.4,
              opacity: 0.6,
            }}
          >
            {card.title}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const handleDelete = async () => {
    setAnchorEl(null)
    if (onDelete) {
      onDelete()
    } else {
      if (window.confirm('Are you sure you want to delete this card?')) {
        const success = await deleteCard(card.id, listId)
        if (success) {
          showSnackbar?.('Xóa card thành công', 'success')
        } else {
          showSnackbar?.('Xóa card thất bại', 'error')
        }
      }
    }
  }

  const handleSaveCard = async (updatedCard) => {
    const success = await updateCard(updatedCard.id, updatedCard)
    if (success) {
      showSnackbar?.('Cập nhật card thành công', 'success')
    } else {
      showSnackbar?.('Cập nhật card thất bại', 'error')
    }
  }

  const handleEditClick = () => {
    setAnchorEl(null)
    setIsEditModalOpen(true)
  }

  const handleCheckboxChange = async (e) => {
    e.stopPropagation()
    const newCompletedStatus = e.target.checked
    setIsCompleted(newCompletedStatus)
    
    // Cập nhật vào database
    const success = await updateCard(card.id, { ...card, completed: newCompletedStatus })
    if (!success) {
      // Nếu thất bại, rollback lại state
      setIsCompleted(!newCompletedStatus)
      showSnackbar?.('Cập nhật trạng thái thất bại', 'error')
    }
  }

  const parseLabelData = (label) => {
    const [color, text] = label.split('|')
    return { color, text: text || '' }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    
    // Kiểm tra nếu là hôm nay
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      // Hiển thị giờ + ngày nếu là hôm nay
      const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return `${time} - ${dateStr}`
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const isNearDueDate = (dateString) => {
    if (!dateString) return false
    const dueDate = new Date(dateString)
    const today = new Date()
    
    // Reset time để so sánh chỉ ngày
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    
    // Tính số ngày còn lại
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays <= 1 && diffDays >= 0
  }

  const isOverdue = (dateString) => {
    if (!dateString) return false
    const dueDate = new Date(dateString)
    const today = new Date()
    
    // Reset time để so sánh chỉ ngày
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    
    return dueDate < today
  }

  return (
    <Card
      ref={disableDndKit ? undefined : setNodeRef}
      style={disableDndKit ? {} : dndKitCardStyles}
      {...(disableDndKit ? {} : attributes)}
      {...(disableDndKit ? {} : listeners)}
      draggable={disableDndKit}
      onDragStart={disableDndKit ? onCardDragStart : undefined}
      onDragEnd={disableDndKit ? onCardDragEnd : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        minWidth: 240,
        cursor: disableDndKit ? 'grab' : 'grab',
        boxShadow: '0 1px 1px rgba(9,30,66,0.25)',
        borderRadius: '8px',
        position: 'relative',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2c2f33' : 'background.paper',
        border: '1px solid transparent',
        transition: 'all 0.1s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 2px 4px rgba(9,30,66,0.25)',
        },
      }}
    >
      {card.cover && (
        <Box
          sx={{
            height: 120,
            borderRadius: '8px 8px 0 0',
            bgcolor: card.cover.startsWith('data:') || card.cover.startsWith('http') ? 'transparent' : card.cover,
            backgroundImage: card.cover.startsWith('data:') || card.cover.startsWith('http') ? `url(${card.cover})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Labels */}
        {card.labels && !isCompleted && card.labels.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {card.labels.map((label, index) => {
              const { color, text } = parseLabelData(label)
              return (
                <Chip
                  key={index}
                  label={text || ''}
                  size="small"
                  sx={{
                    bgcolor: color,
                    color: '#fff',
                    height: text ? 20 : 8,
                    minWidth: text ? 'auto' : 32,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: text ? 1 : 0,
                      py: 0,
                    }
                  }}
                />
              )
            })}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
          <Checkbox
            checked={isCompleted}
            onChange={handleCheckboxChange}
            size="small"
            sx={{
              p: 0,
              mr: 1.5,
              '&:hover': { bgcolor: 'transparent' },
            }}
          />
          <Typography
            sx={{
              fontSize: '0.875rem',
              wordBreak: 'break-word',
              color: 'text.primary',
              lineHeight: 1.4,
              flex: 1,
              textDecoration: isCompleted ? 'line-through' : 'none',
              opacity: isCompleted ? 0.6 : 1,
            }}
          >
            {card.title}
          </Typography>
        </Box>

        {card.dueDate && !isCompleted && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
              px: 2,
              py: 0.1,
              bgcolor: isOverdue(card.dueDate) 
                ? '#fd6868'
                : isNearDueDate(card.dueDate) 
                  ? '#ff986d' 
                  : (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#7b8c91'
                        : '#cbcbcb',
              borderRadius: '4px',
              width: 'fit-content',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography 
            variant="caption"
            color="text.secondary" 
            fontWeight={500}
            sx={{mt:.5}}
            >
              {formatDate(card.dueDate)}
            </Typography>
          </Box>
        )}
      </CardContent>

      {isHovered && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            setAnchorEl(e.currentTarget)
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,1)',
            },
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#2c2f33' : 'background.paper',
          },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit card</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete card</ListItemText>
        </MenuItem>
        
      </Menu>

      <EditCardModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        card={card}
        onSave={handleSaveCard}
      />
    </Card>
  )
}

export default CardItem
