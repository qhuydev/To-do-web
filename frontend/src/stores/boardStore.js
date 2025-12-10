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
      set({ currentBoard: response.data, isLoading: false })
      return response.data
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
        const newList = { ...response.data, cards: [] }
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: [...(state.currentBoard.lists || []), newList],
            listOrderIds: [...(state.currentBoard.listOrderIds || []), newList.id],
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
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: state.currentBoard.lists.filter((l) => l.id !== listId),
            listOrderIds: state.currentBoard.listOrderIds.filter((id) => id !== listId),
          },
        }
      })
      return true
    } catch (error) {
      set({ error: error.message })
      return false
    }
  },

  createCard: async (listId, data) => {
    try {
      const response = await cardApi.create(listId, data)
      set((state) => {
        if (!state.currentBoard) return state
        return {
          currentBoard: {
            ...state.currentBoard,
            lists: state.currentBoard.lists.map((l) =>
              l.id === listId
                ? {
                    ...l,
                    cards: [...(l.cards || []), response.data],
                    cardOrderIds: [...(l.cardOrderIds || []), response.data.id],
                  }
                : l
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
      await boardApi.updateListOrder(boardId, listOrderIds)
      return true
    } catch (error) {
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
