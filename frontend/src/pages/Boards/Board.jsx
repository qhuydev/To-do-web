import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import BottomNav from '../../components/AppBar/BottomNav/BottomNav'
import { useBoardStore } from '~/stores'
import { useSnackbar } from 'notistack'

function Board() {
  const { boardId } = useParams()
  const { currentBoard, isLoading, fetchBoardById, clearCurrentBoard } = useBoardStore()
  const { enqueueSnackbar } = useSnackbar()

  // Helper thống nhất để show snackbar
  const showSnackbar = (message, variant = 'success') => {
    enqueueSnackbar(message, { 
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, // luôn hiển thị top-right
      autoHideDuration: 3000,
    })
  }

  useEffect(() => {
    if (boardId) {
      fetchBoardById(boardId).catch(() => {
        showSnackbar('Không tải được board!', 'error')
      })
    }
    return () => clearCurrentBoard()
  }, [boardId, fetchBoardById, clearCurrentBoard])

  // Loading state
  if (isLoading || !currentBoard) {
    return (
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar board={null} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 58px)',
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading board...</Typography>
        </Box>
      </Container>
    )
  }

  // Main content
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar board={currentBoard}  />
      <BoardBar board={currentBoard} showSnackbar={showSnackbar} />
      <BoardContent board={currentBoard} showSnackbar={showSnackbar} />
      <BottomNav board={currentBoard} showSnackbar={showSnackbar} />
    </Container>
  )
}

export default Board
