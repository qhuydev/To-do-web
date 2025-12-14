import { useState } from 'react'
import Box from "@mui/material/Box"
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import Column from "./Columns/Columns"
import { useBoardStore } from '~/stores'

function ListColumns({ board, showSnackbar }) {
  const { createList } = useBoardStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  const lists = board?.lists || []

  const handleAddList = async () => {
    if (!newListTitle.trim()) return

    try {
      const result = await createList(board.id, { title: newListTitle })
      if (result) {
        showSnackbar('Thêm cột thành công', 'success')
        setNewListTitle('')
        setIsAdding(false)
      } else {
        showSnackbar('Thêm cột thất bại', 'error')
      }
    } catch (err) {
      showSnackbar('Thêm cột thất bại', 'error')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddList()
    if (e.key === 'Escape') {
      setIsAdding(false)
      setNewListTitle('')
    }
  }

  return (
    <SortableContext items={lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 },
        
        p: 1,
      }}>
        {lists.map((list) => (
          <Column key={list.id} list={list} boardId={board.id} showSnackbar={showSnackbar} />
        ))}

        <Box sx={{
          minWidth: '272px',
          maxWidth: '272px',
          mx: 1,
          borderRadius: '12px',
          height: 'fit-content',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#3a3a3a' : 'rgba(255,255,255,0.24)',
        }}>
          {isAdding ? (
            <Box sx={{ p: 1 }}>
              <TextField
                autoFocus
                fullWidth
                size="small"
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: theme => theme.palette.mode === 'dark' ? '#555' : '#fff' 
                  } 
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddList}
                  disabled={!newListTitle.trim()}
                >
                  Add list
                </Button>
                <Button
                  size="small"
                  onClick={() => { setIsAdding(false); setNewListTitle('') }}
                  sx={{ minWidth: 'auto', color: 'white' }}
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Box>
          ) : (
            <Button
              startIcon={<NoteAddIcon />}
              onClick={() => setIsAdding(true)}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1.5,
              }}
            >
              Add another list
            </Button>
          )}
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns
