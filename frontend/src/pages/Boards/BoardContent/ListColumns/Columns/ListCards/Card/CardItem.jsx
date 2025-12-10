import { useState } from 'react'
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
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

function CardItem({ card, listId, showSnackbar }) {
  const { deleteCard } = useBoardStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card?.id,
    data: { type: 'card', ...card },
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const open = Boolean(anchorEl)

  const handleDelete = async () => {
    setAnchorEl(null)
    if (window.confirm('Are you sure you want to delete this card?')) {
      const success = await deleteCard(card.id, listId)
      if (success) {
        showSnackbar?.('Xóa card thành công', 'success')
      } else {
        showSnackbar?.('Xóa card thất bại', 'error')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Card
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: 'grab',
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
            bgcolor: card.cover,
            borderRadius: '8px 8px 0 0',
          }}
        />
      )}

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            wordBreak: 'break-word',
            color: 'text.primary',
            lineHeight: 1.4,
          }}
        >
          {card.title}
        </Typography>

        {card.dueDate && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
              px: 0.75,
              py: 0.25,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              borderRadius: '4px',
              width: 'fit-content',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
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
        <MenuItem onClick={() => setAnchorEl(null)}>
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
    </Card>
  )
}

export default CardItem
