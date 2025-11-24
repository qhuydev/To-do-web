import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import BottomNav from '../../components/AppBar/BottomNav/BottomNav'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{height: '100vh'}}> 
      <AppBar />
      <BoardBar />
      <BoardContent />
      <BottomNav />
    </Container>
  )
}

export default Board