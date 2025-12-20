import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import BottomNav from '../../components/AppBar/BottomNav/BottomNav'
import { useBoardStore, useAuthStore } from '~/stores'
import { useSnackbar } from 'notistack'
import MyTask from '../navitems/MyTask.jsx'
import Drawer from '@mui/material/Drawer'
import Inbox from '../navitems/Inbox.jsx'
import IdeasPage from '../navitems/IdeasPage.jsx'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  pointerWithin,
  getFirstCollision,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './BoardContent/ListColumns/Columns/Columns'
import CardItem from './BoardContent/ListColumns/Columns/ListCards/Card/CardItem'
function Board() {
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const [isIdeaOpen, setIsIdeaOpen] = useState(false)
  const [viewMode, setViewMode] = useState('column') // 'column', 'rows', or 'schedule'

  const { boardId } = useParams()
  const { currentBoard, isLoading, fetchBoardById, clearCurrentBoard, updateListOrder, updateCardOrderInList, moveCardInBoard, createCard } = useBoardStore()
  const { user } = useAuthStore()
  const { enqueueSnackbar } = useSnackbar()
  const [contentView, setContentView] = useState("board")

  // DRAG STATES
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  const [oldColumnIndexWhenDraggingColumn, setOldColumnIndexWhenDraggingColumn] = useState(null)

  // SENSORS
  const mouseSensor = useSensor(MouseSensor, { 
    activationConstraint: { 
      distance: 8,
    } 
  })
  const touchSensor = useSensor(TouchSensor, { 
    activationConstraint: { 
      delay: 200, 
      tolerance: 8 
    } 
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const showSnackbar = (message, variant = 'success') => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      autoHideDuration: 3000,
    })
  }

  const findColumnByCardId = (cardId) =>
    currentBoard?.lists?.find((list) => list.cards?.some((c) => c.id === cardId))

  const resetDragState = () => {
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
    setOldColumnIndexWhenDraggingColumn(null)
  }

  useEffect(() => {
    if (boardId) {
      fetchBoardById(boardId).catch(() => {
        showSnackbar('Không tải được board!', 'error')
      })
    }
    return () => clearCurrentBoard()
  }, [boardId])

  // ============================
  // DRAG HANDLERS
  // ============================
  const handleDragStart = ({ active }) => {
    const activeId = active?.id
    const activeData = active?.data?.current

    setActiveDragItemId(activeId)
    setActiveDragItemType(activeData?.type)
    setActiveDragItemData(activeData)

    if (activeData?.type === 'card') {
      setOldColumnWhenDraggingCard(findColumnByCardId(activeId))
    } else if (activeData?.type === 'column') {
      // Lưu vị trí ban đầu của column
      const oldIndex = currentBoard.listOrderIds.findIndex((id) => id === activeId)
      setOldColumnIndexWhenDraggingColumn(oldIndex)
    }
  }

  const handleDragOver = ({ active, over }) => {
    // Xử lý kéo column - optimistic update
    if (activeDragItemType === 'column') {
      if (!active || !over || active.id === over.id) return
      
      const activeId = active.id
      const overId = over.id
      
      const oldIndex = currentBoard.listOrderIds.findIndex((id) => id === activeId)
      const newIndex = currentBoard.listOrderIds.findIndex((id) => id === overId)
      
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newListOrderIds = arrayMove(currentBoard.listOrderIds, oldIndex, newIndex)
        const newLists = newListOrderIds
          .map((id) => currentBoard.lists.find((l) => l.id === id))
          .filter(Boolean)
        
        useBoardStore.setState((s) => ({
          currentBoard: {
            ...s.currentBoard,
            listOrderIds: newListOrderIds,
            lists: newLists,
          },
        }))
      }
      return
    }
    
    // Xử lý kéo card
    if (!active || !over) return

    const activeId = active.id
    const overId = over.id

    const activeColumn = findColumnByCardId(activeId)
    const overColumn =
      findColumnByCardId(overId) ||
      currentBoard?.lists?.find((list) => list.id === overId)

    if (!overColumn) return

    // Nếu card từ ChatWidget (không có activeColumn), tạo placeholder preview
    if (!activeColumn && activeDragItemData?.fromChat) {
      const overCardIndex = overColumn.cards.findIndex((c) => c.id === overId)
      
      let newIndex
      if (overId === overColumn.id) {
        // Kéo vào column trống hoặc vùng trống của column
        newIndex = overColumn.cards.length
      } else {
        // Kéo vào gần một card cụ thể
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height / 2

        newIndex = overCardIndex >= 0 ? overCardIndex + (isBelowOverItem ? 1 : 0) : overColumn.cards.length
      }

      // Tạo temporary card để hiển thị placeholder
      const tempCard = {
        id: activeId,
        title: activeDragItemData.title,
        listId: overColumn.id,
        _isPlaceholder: true,
      }

      const newLists = currentBoard.lists.map((list) => {
        if (list.id === overColumn.id) {
          const newCards = [...list.cards]
          // Xóa placeholder cũ nếu có
          const filteredCards = newCards.filter(c => c.id !== activeId)
          filteredCards.splice(newIndex, 0, tempCard)

          return {
            ...list,
            cards: filteredCards,
            cardOrderIds: filteredCards.map((c) => c.id),
          }
        } else {
          // Xóa placeholder khỏi các list khác
          return {
            ...list,
            cards: list.cards.filter(c => c.id !== activeId),
            cardOrderIds: list.cardOrderIds.filter(id => id !== activeId),
          }
        }
      })

      useBoardStore.setState((s) => ({ currentBoard: { ...s.currentBoard, lists: newLists } }))
      return
    }
    
    if (!activeColumn) return
    
    // Nếu đang kéo trong cùng một column, bỏ qua để tránh flickering
    if (activeColumn.id === overColumn.id) {
      // Chỉ xử lý sắp xếp lại trong cùng column khi DragEnd
      return
    }

    const activeCardIndex = activeColumn.cards.findIndex((c) => c.id === activeId)
    const overCardIndex = overColumn.cards.findIndex((c) => c.id === overId)

    let newIndex
    if (overId === overColumn.id) {
      // Kéo vào column (không phải vào card cụ thể)
      newIndex = overColumn.cards.length
    } else {
      // Kéo vào gần một card cụ thể
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height / 2

      newIndex = overCardIndex >= 0 ? overCardIndex + (isBelowOverItem ? 1 : 0) : overColumn.cards.length
    }

    const newLists = currentBoard.lists.map((list) => {
      if (list.id === activeColumn.id) {
        return {
          ...list,
          cards: list.cards.filter((c) => c.id !== activeId),
          cardOrderIds: list.cardOrderIds.filter((id) => id !== activeId),
        }
      }

      if (list.id === overColumn.id) {
        const activeCard = activeColumn.cards.find((c) => c.id === activeId)
        const newCards = [...list.cards]
        newCards.splice(newIndex, 0, { ...activeCard, listId: overColumn.id })

        return {
          ...list,
          cards: newCards,
          cardOrderIds: newCards.map((c) => c.id),
        }
      }

      return list
    })

    useBoardStore.setState((s) => ({ currentBoard: { ...s.currentBoard, lists: newLists } }))
  }

  const handleDragEnd = async ({ active, over }) => {
    if (!active || !over) {
      resetDragState()
      // Xóa placeholder nếu có
      if (activeDragItemData?.fromChat) {
        const newLists = currentBoard.lists.map((list) => ({
          ...list,
          cards: list.cards.filter(c => c.id !== active.id),
          cardOrderIds: list.cardOrderIds.filter(id => id !== active.id),
        }))
        useBoardStore.setState((s) => ({ currentBoard: { ...s.currentBoard, lists: newLists } }))
      }
      return
    }

    const activeId = active.id
    const overId = over.id

    try {
      if (activeDragItemType === 'card') {
        const activeColumn = findColumnByCardId(activeId)
        const overColumn = findColumnByCardId(overId) || currentBoard?.lists?.find((list) => list.id === overId)

        if (!overColumn) {
          resetDragState()
          return
        }

        // Nếu card từ ChatWidget (không có listId)
        if (activeDragItemData?.fromChat) {
          try {
            // Tìm vị trí của placeholder trong overColumn
            const placeholderIndex = overColumn.cards.findIndex(c => c.id === activeId)
            const targetIndex = placeholderIndex >= 0 ? placeholderIndex : overColumn.cards.length
            
            // Tạo card mới tại vị trí placeholder
            const newCardData = {
              title: activeDragItemData.title,
              startDate: activeDragItemData.startDate,
              dueDate: activeDragItemData.dueDate,
              cover: activeDragItemData.cover,
              labels: activeDragItemData.labels,
              completed: false,
            }
            await createCard(overColumn.id, newCardData, targetIndex)
            
            showSnackbar('Card copied to board successfully!', 'success')
          } catch (error) {
            showSnackbar('Failed to copy card!', 'error')
            // Xóa placeholder nếu có lỗi
            const newLists = currentBoard.lists.map((list) => ({
              ...list,
              cards: list.cards.filter(c => !c._isPlaceholder),
              cardOrderIds: list.cardOrderIds.filter(id => !id.toString().startsWith('chat-card-')),
            }))
            useBoardStore.setState((s) => ({ currentBoard: { ...s.currentBoard, lists: newLists } }))
          }
          resetDragState()
          return
        }

        if (!activeColumn) {
          resetDragState()
          return
        }

        if (oldColumnWhenDraggingCard?.id !== overColumn.id) {
          const newCardIndex = overColumn.cards.findIndex((c) => c.id === activeId)
          await moveCardInBoard(activeId, oldColumnWhenDraggingCard.id, overColumn.id, newCardIndex)
          showSnackbar('Card moved successfully!', 'success')
        } else {
          const oldIndex = activeColumn.cards.findIndex((c) => c.id === activeId)
          const newIndex = overColumn.cards.findIndex((c) => c.id === overId)

          if (oldIndex !== newIndex) {
            const newOrder = arrayMove(overColumn.cardOrderIds, oldIndex, newIndex)
            await updateCardOrderInList(overColumn.id, newOrder)
            showSnackbar('Card reordered successfully!', 'success')
          }
        }
      }

      if (activeDragItemType === 'column') {
        
        // Tính vị trí mới (hiện tại trong UI sau optimistic update)
        const currentIndex = currentBoard.listOrderIds.findIndex((id) => id === activeId)
        
        // So sánh với vị trí ban đầu
        if (oldColumnIndexWhenDraggingColumn !== null && 
            oldColumnIndexWhenDraggingColumn !== -1 && 
            currentIndex !== -1 && 
            oldColumnIndexWhenDraggingColumn !== currentIndex) {
          
          
          
          const result = await updateListOrder(currentBoard.id, currentBoard.listOrderIds)
          if (result) {
            showSnackbar('Column reordered successfully!', 'success')
          } else {
            showSnackbar('Failed to save column order!', 'error')
          }
        } else {
          console.log('Column position unchanged, skipping API call')
        }
      }
    } catch (error) {
      showSnackbar('Action failed!', 'error')
    }

    resetDragState()
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Kéo column: sử dụng closestCorners đơn giản và ổn định
      if (activeDragItemType === 'column') {
        return closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            container => container.data.current?.type === 'column'
          )
        })
      }

      // Card dragging - Cải thiện collision detection
      const pointerIntersections = pointerWithin(args)
      if (!pointerIntersections?.length) {
        // Nếu không có intersection với pointer, thử dùng closestCorners
        return closestCorners(args)
      }

      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const column = currentBoard?.lists?.find((list) => list.id === overId)

        if (column) {
          // Nếu column rỗng, return column id
          if (column.cardOrderIds.length === 0) {
            return [{ id: overId }]
          }

          // Lọc các card trong column này
          const cardsInColumn = args.droppableContainers.filter((c) =>
            column.cardOrderIds.includes(c.id)
          )
          
          // Sử dụng closestCorners để tìm card gần nhất
          const closestCard = closestCorners({ 
            ...args, 
            droppableContainers: cardsInColumn 
          })
          
          if (closestCard.length > 0) {
            return [{ id: closestCard[0].id }]
          }
          
          // Nếu không tìm được card nào, return column id
          return [{ id: overId }]
        }

        // Nếu overId không phải column, có thể là card
        return [{ id: overId }]
      }

      // Fallback: sử dụng closestCorners
      return closestCorners(args)
    },
    [activeDragItemType, currentBoard?.lists]
  )

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
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Container
        disableGutters
        maxWidth={false}
        sx={{ height: '100vh', overflow: 'hidden' }}
      >
        <AppBar board={currentBoard} />
        <BoardBar 
          board={currentBoard} 
          showSnackbar={showSnackbar}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Giữ layout cũ */}
        <Box >
          {contentView === "board" && (
            <BoardContent 
              board={currentBoard} 
              showSnackbar={showSnackbar}
              viewMode={viewMode}
            />
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
          onViewModeChange={setViewMode}
          currentViewMode={viewMode}
          isPremium={user?.isPremium || false}
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

      <DragOverlay 
        dropAnimation={{ duration: 200, easing: 'ease' }}
        zIndex={9999}
      >
        {activeDragItemType === 'column' && <Column list={activeDragItemData} isDragOverlay={true} />}
        {activeDragItemType === 'card' && <CardItem card={activeDragItemData} isDragOverlay={true} />}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
