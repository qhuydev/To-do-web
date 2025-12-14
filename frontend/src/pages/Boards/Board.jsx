import { useEffect, useState } from 'react'
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
import MyTask from '../navitems/MyTask.jsx'
import Drawer from '@mui/material/Drawer'
import Inbox from '../navitems/Inbox.jsx'
import IdeasPage from '../navitems/IdeasPage.jsx'
function Board() {
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const [isIdeaOpen, setIsIdeaOpen] = useState(false)


  const { boardId } = useParams()
  const { currentBoard, isLoading, fetchBoardById, clearCurrentBoard } = useBoardStore()
  const { enqueueSnackbar } = useSnackbar()
  const [contentView, setContentView] = useState("board")

  const showSnackbar = (message, variant = 'success') => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
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
  }, [boardId])

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

  return (
    <Container
  disableGutters
  maxWidth={false}
  sx={{ height: '100vh', overflow: 'hidden' }}
>
  <AppBar board={currentBoard} />
  <BoardBar board={currentBoard} showSnackbar={showSnackbar} />

  {/* Giữ layout cũ */}
  <Box >
    {contentView === "board" && (
      <BoardContent board={currentBoard} showSnackbar={showSnackbar} />
    )}

    {contentView === "tasks" && (
      <MyTask board={currentBoard} />
    )}
  </Box>

  <BottomNav
    board={currentBoard}
    showBoard={() => setContentView("board")}
    showTasks={() => setContentView("tasks")}
    openInbox={() => setIsInboxOpen(true)}
    openIdeas={() => setIsIdeaOpen(true)}
  />

  <Drawer
    anchor="left"
    open={isInboxOpen}
    onClose={() => setIsInboxOpen(false)}
  >
    <Inbox />

  </Drawer>
    <Drawer
    anchor="left"
    open={isIdeaOpen}
    onClose={() => setIsIdeaOpen(false)}
  >
    <IdeasPage />
  </Drawer>
</Container>

  )
}

export default Board
