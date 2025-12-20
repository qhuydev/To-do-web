import { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Tooltip from "@mui/material/Tooltip"
import AddIcon from "@mui/icons-material/Add"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import CloseIcon from "@mui/icons-material/Close"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ListCards from "./ListCards/ListCards"
import { useBoardStore } from '~/stores'

function Column({ list, boardId, showSnackbar, isDragOverlay = false }) {
  const { createCard, deleteList } = useBoardStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list?.id,
    data: { type: 'column', ...list },
  })

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...(isDragOverlay && {
      rotate: '5deg',
      transformOrigin: 'bottom right',
    }),
  }

  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const cards = list?.cards || []

  // Thêm card
  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return

    try {
      const result = await createCard(list.id, { title: newCardTitle })
      if (result) {
        showSnackbar('Thêm card thành công', 'success')
        setNewCardTitle('')
        setIsAddingCard(false)
      } else {
        showSnackbar('Thêm card thất bại', 'error')
      }
    } catch (err) {
      showSnackbar('Thêm card thất bại', 'error')
    }
  }

  // Xóa list
  const handleDeleteList = async () => {
    handleClose()
    if (!window.confirm('Are you sure you want to delete this list?')) return

    try {
      const result = await deleteList(list.id)
      if (result) {
        showSnackbar('Xóa list thành công', 'success')
      } else {
        showSnackbar('Xóa list thất bại', 'error')
      }
    } catch (err) {
      showSnackbar('Xóa list thất bại', 'error')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddCard()
    if (e.key === 'Escape') {
      setIsAddingCard(false)
      setNewCardTitle('')
    }
  }

  return (
    <Box
      ref={setNodeRef}
      style={dndKitColumnStyles}
      sx={{
        minWidth: 280,
        maxWidth: 280,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#22272b" : "#f1f2f4",
        ml: 1,
        borderRadius: '12px',
        display: "flex",
        flexDirection: "column",
        height: 'fit-content',
        maxHeight: (theme) =>
          `calc(${theme.todo.boardContentHeight} - ${theme.spacing(2)})`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      {/* Column Header */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          height: (theme) => theme.todo.columnHeaderHeight,
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          touchAction: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: (theme) => theme.palette.text.primary,
            pl: 0.5,
          }}
        >
          {list?.title || "Untitled"}
        </Typography>

        <Tooltip title="List actions">
          <IconButton
            size="small"
            onClick={handleClick}
            onPointerDown={(e) => e.stopPropagation()}
            sx={{ 
              color: "text.secondary",
              "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{ sx: { minWidth: 200 } }}
        >
          <MenuItem onClick={() => { handleClose(); setIsAddingCard(true); }}>
            <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Add card</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteList} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteOutlineIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText>Delete list</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* List Cards */}
      <ListCards cards={cards} listId={list?.id} showSnackbar={showSnackbar} />

      {/* Column Footer */}
      <Box sx={{ px: 1, pb: 1 }}>
        {isAddingCard ? (
          <Box>
            <TextField
              autoFocus
              fullWidth
              multiline
              minRows={2}
              size="small"
              placeholder="Enter a title for this card..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#485460' : 'white', 
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddCard}
                disabled={!newCardTitle.trim()}
                sx={{ textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
              >
                Add card
              </Button>
              <IconButton size="small" onClick={() => { setIsAddingCard(false); setNewCardTitle('') }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              onClick={() => setIsAddingCard(true)}
              sx={{ 
                color: 'text.secondary',
                justifyContent: 'flex-start',
                flex: 1,
                p: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.06)', color: 'text.primary' },
              }}
            >
              Add a card
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Column
