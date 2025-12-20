import { create } from 'zustand'
import { boardApi, listApi, cardApi } from '~/api'

const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await boardApi.getAll()
      set({ boards: response.data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchBoardById: async (boardId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await boardApi.getById(boardId)
      const boardData = response.data
      
      // Đảm bảo lists được sắp xếp theo listOrderIds
      if (boardData.listOrderIds && boardData.lists) {
        const orderedLists = boardData.listOrderIds
          .map((id) => boardData.lists.find((l) => l.id === id))
          .filter(Boolean)
        boardData.lists = orderedLists
      }
      
      set({ currentBoard: boardData, isLoading: false })
      return boardData
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return null
    }
  },

  createBoard: async (data) => {
    try {
      const response = await boardApi.create(data)
      set((state) => ({ boards: [...state.boards, response.data] }))
      return response.data
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  updateBoard: async (boardId, data) => {
    try {
      const response = await boardApi.update(boardId, data)
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? response.data : b)),
        currentBoard:
          state.currentBoard?.id === boardId ? response.data : state.currentBoard,
      }))
      return response.data
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  deleteBoard: async (boardId) => {
    try {
      await boardApi.delete(boardId)
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== boardId),
        currentBoard:
          state.currentBoard?.id === boardId ? null : state.currentBoard,
      }))
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  createList: async (boardId, data) => {
    try {
      const response = await listApi.create(boardId, data)
      set((state) => {
        if (!state.currentBoard || state.currentBoard.id !== boardId) return state
        const newList = { ...response.data, cards: [], cardOrderIds: [] }
        const newListOrderIds = [...(state.currentBoard.listOrderIds || []), newList.id]
        
        // Sắp xếp lists theo listOrderIds mới
        const newLists = newListOrderIds
          .map((id) => {
            if (id === newList.id) return newList
            return state.currentBoard.lists.find((l) => l.id === id)
          })
          .filter(Boolean)
        
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: newLists,
            listOrderIds: newListOrderIds,
          },
        }
      })
      return response.data
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  updateList: async (listId, data) => {
    try {
      const response = await listApi.update(listId, data)
      set((state) => {
        if (!state.currentBoard) return state
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((l) =>
              l.id === listId ? { ...l, ...response.data } : l
            ),
          },
        }
      })
      return response.data
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  deleteList: async (listId) => {
    try {
      await listApi.delete(listId)
      set((state) => {
        if (!state.currentBoard) return state
        const newListOrderIds = state.currentBoard.listOrderIds.filter((id) => id !== listId)
        const newLists = newListOrderIds
          .map((id) => state.currentBoard.lists.find((l) => l.id === id))
          .filter(Boolean)
        
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: newLists,
            listOrderIds: newListOrderIds,
          },
        }
      })
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  createCard: async (listId, data, index = null) => {
    try {
      const response = await cardApi.create(listId, data)
      set((state) => {
        if (!state.currentBoard) return state
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((l) => {
              if (l.id === listId) {
                const newCards = [...(l.cards || [])]
                const newCardOrderIds = [...(l.cardOrderIds || [])]
                
                // Xóa placeholder nếu có
                const cleanedCards = newCards.filter(c => !c._isPlaceholder)
                const cleanedOrderIds = newCardOrderIds.filter(id => !id.toString().startsWith('chat-card-'))
                
                // Nếu có index, thêm vào vị trí đó, không thì thêm vào cuối
                if (index !== null && index >= 0 && index <= cleanedCards.length) {
                  cleanedCards.splice(index, 0, response.data)
                  cleanedOrderIds.splice(index, 0, response.data.id)
                } else {
                  cleanedCards.push(response.data)
                  cleanedOrderIds.push(response.data.id)
                }
                
                return {
                  ...l,
                  cards: cleanedCards,
                  cardOrderIds: cleanedOrderIds,
                }
              }
              // Xóa placeholder khỏi các list khác nếu có
              return {
                ...l,
                cards: l.cards.filter(c => !c._isPlaceholder),
                cardOrderIds: l.cardOrderIds.filter(id => !id.toString().startsWith('chat-card-')),
              }
            }),
          },
        }
      })
      return response.data
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  updateCard: async (cardId, data) => {
    try {
      const response = await cardApi.update(cardId, data)
      set((state) => {
        if (!state.currentBoard) return state
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((l) => ({
              ...l,
              cards: l.cards?.map((c) =>
                c.id === cardId ? { ...c, ...response.data } : c
              ),
            })),
          },
        }
      })
      return response.data
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  deleteCard: async (cardId, listId) => {
    try {
      await cardApi.delete(cardId)
      set((state) => {
        if (!state.currentBoard) return state
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((l) =>
              l.id === listId
                ? {
                    ...l,
                    cards: l.cards?.filter((c) => c.id !== cardId),
                    cardOrderIds: l.cardOrderIds?.filter((id) => id !== cardId),
                  }
                : l
            ),
          },
        }
      })
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  moveCardInBoard: async (cardId, sourceListId, targetListId, newIndex) => {
    const state = get()
    if (!state.currentBoard) return false

    const prevBoard = state.currentBoard

    set((state) => {
      const lists = [...state.currentBoard.lists]
      const sourceList = lists.find((l) => l.id === sourceListId)
      const targetList = lists.find((l) => l.id === targetListId)

      if (!sourceList || !targetList) return state

      const cardIndex = sourceList.cards.findIndex((c) => c.id === cardId)
      if (cardIndex === -1) return state

      const [movedCard] = sourceList.cards.splice(cardIndex, 1)
      sourceList.cardOrderIds = sourceList.cardOrderIds.filter((id) => id !== cardId)

      movedCard.listId = targetListId
      targetList.cards.splice(newIndex, 0, movedCard)
      targetList.cardOrderIds.splice(newIndex, 0, cardId)

      return { currentBoard: { ...state.currentBoard, lists } }
    })

    try {
      await cardApi.move(cardId, { targetListId, newIndex })
      return true
    } catch (error) {
      set({ currentBoard: prevBoard, error: error.message })
      return false
    }
  },

  updateListOrder: async (boardId, listOrderIds) => {
    const state = get()
    const prevBoard = state.currentBoard

    // Optimistic update
    set((state) => {
      if (!state.currentBoard) return state
      const orderedLists = listOrderIds
        .map((id) => state.currentBoard.lists.find((l) => l.id === id))
        .filter(Boolean)
      return {
        currentBoard: {
          ...state.currentBoard,
          listOrderIds,
          lists: orderedLists,
        },
      }
    })

    try {
      console.log('Updating list order:', { boardId, listOrderIds })
      const response = await boardApi.updateListOrder(boardId, listOrderIds)
      console.log('List order updated successfully:', response)
      return true
    } catch (error) {
      console.error('Failed to update list order:', error)
      set({ currentBoard: prevBoard, error: error.message })
      return false
    }
  },

  updateCardOrderInList: async (listId, cardOrderIds) => {
    const state = get()
    const prevBoard = state.currentBoard

    set((state) => {
      if (!state.currentBoard) return state
      return {
        currentBoard: {
          ...state.currentBoard,
          lists: state.currentBoard.lists.map((l) => {
            if (l.id !== listId) return l
            const orderedCards = cardOrderIds
              .map((id) => l.cards.find((c) => c.id === id))
              .filter(Boolean)
            return { ...l, cardOrderIds, cards: orderedCards }
          }),
        },
      }
    })

    try {
      await listApi.updateCardOrder(listId, cardOrderIds)
      return true
    } catch (error) {
      set({ currentBoard: prevBoard, error: error.message })
      return false
    }
  },

  clearCurrentBoard: () => set({ currentBoard: null }),
  clearError: () => set({ error: null }),
}))

export default useBoardStore
