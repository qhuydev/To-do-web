import Box from "@mui/material/Box"
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import CardItem from './Card/CardItem'

function ListCards({ cards = [], listId, showSnackbar }) {
  const { setNodeRef } = useDroppable({
    id: listId,
  })

  return (
    <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
      <Box
        ref={setNodeRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: "auto",
          px: 1,
          pb: 1,
          gap: 1,
          minHeight: cards.length === 0 ? '50px' : '10px',
          flexGrow: 1,
          // maxHeight: '400px',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#6e7c91' : '#bfc4ce',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#f0f0f0',
          },
        }}
      >
        {cards.map((card) => (
          <CardItem 
            key={card.id} 
            card={card} 
            listId={listId} 
            showSnackbar={showSnackbar} 
          />
        ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards
