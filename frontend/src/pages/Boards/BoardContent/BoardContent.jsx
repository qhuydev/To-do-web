import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import ListColumns from "./ListColumns/ListColumns";
import Column from "./ListColumns/Columns/Columns";
import CardItem from "./ListColumns/Columns/ListCards/Card/CardItem";
import { useBoardStore } from "~/stores";

function BoardContent({ board, showSnackbar }) {
  // STORE ACTIONS
  const { updateListOrder, updateCardOrderInList, moveCardInBoard } =
    useBoardStore();

  // DRAG STATES
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  // SENSORS
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  // UTILS
  const findColumnByCardId = (cardId) =>
    board?.lists?.find((list) => list.cards?.some((c) => c.id === cardId));

  const resetDragState = () => {
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  // ============================
  // 1. DRAG START
  // ============================
  const handleDragStart = ({ active }) => {
    const activeId = active?.id;
    const activeData = active?.data?.current;

    setActiveDragItemId(activeId);
    setActiveDragItemType(activeData?.type);
    setActiveDragItemData(activeData);

    if (activeData?.type === "card") {
      setOldColumnWhenDraggingCard(findColumnByCardId(activeId));
    }
  };

  // ============================
  // 2. DRAG OVER (LIVE MOVE)
  // ============================
  const handleDragOver = ({ active, over }) => {
    if (activeDragItemType === "column") return;
    if (!active || !over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnByCardId(activeId);
    const overColumn =
      findColumnByCardId(overId) ||
      board?.lists?.find((list) => list.id === overId);

    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id) return;

    const activeCardIndex = activeColumn.cards.findIndex((c) => c.id === activeId);
    const overCardIndex = overColumn.cards.findIndex((c) => c.id === overId);

    let newIndex;
    if (overId === overColumn.id) {
      newIndex = overColumn.cards.length;
    } else {
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height / 2;

      newIndex = overCardIndex >= 0 ? overCardIndex + (isBelowOverItem ? 1 : 0) : overColumn.cards.length;
    }

    const newLists = board.lists.map((list) => {
      if (list.id === activeColumn.id) {
        return {
          ...list,
          cards: list.cards.filter((c) => c.id !== activeId),
          cardOrderIds: list.cardOrderIds.filter((id) => id !== activeId),
        };
      }

      if (list.id === overColumn.id) {
        const activeCard = activeColumn.cards.find((c) => c.id === activeId);
        const newCards = [...list.cards];
        newCards.splice(newIndex, 0, { ...activeCard, listId: overColumn.id });

        return {
          ...list,
          cards: newCards,
          cardOrderIds: newCards.map((c) => c.id),
        };
      }

      return list;
    });

    useBoardStore.setState((s) => ({ currentBoard: { ...s.currentBoard, lists: newLists } }));
  };

  // ============================
  // 3. DRAG END
  // ============================
  const handleDragEnd = async ({ active, over }) => {
    if (!active || !over) {
      resetDragState();
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    try {
      // CARD DRAG END
      if (activeDragItemType === "card") {
        const activeColumn = findColumnByCardId(activeId);
        const overColumn = findColumnByCardId(overId) || board?.lists?.find((list) => list.id === overId);

        if (!activeColumn || !overColumn) {
          resetDragState();
          return;
        }

        if (oldColumnWhenDraggingCard?.id !== overColumn.id) {
          const newCardIndex = overColumn.cards.findIndex((c) => c.id === activeId);
          await moveCardInBoard(activeId, oldColumnWhenDraggingCard.id, overColumn.id, newCardIndex);
          showSnackbar("Card moved successfully!", "success");
        } else {
          const oldIndex = activeColumn.cards.findIndex((c) => c.id === activeId);
          const newIndex = overColumn.cards.findIndex((c) => c.id === overId);

          if (oldIndex !== newIndex) {
            const newOrder = arrayMove(overColumn.cardOrderIds, oldIndex, newIndex);
            await updateCardOrderInList(overColumn.id, newOrder);
            showSnackbar("Card reordered successfully!", "success");
          }
        }
      }

      // COLUMN DRAG END
      if (activeDragItemType === "column" && activeId !== overId) {
        const oldIndex = board.lists.findIndex((l) => l.id === activeId);
        const newIndex = board.lists.findIndex((l) => l.id === overId);

        const newListOrder = arrayMove(board.listOrderIds, oldIndex, newIndex);
        await updateListOrder(board.id, newListOrder);
        showSnackbar("Column reordered successfully!", "success");
      }
    } catch (error) {
      showSnackbar("Action failed!", "error");
    }

    resetDragState();
  };

  // ============================
  // 4. CUSTOM COLLISION
  // ============================
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === "column") return closestCorners(args);

      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections?.length) return [];

      let overId = getFirstCollision(pointerIntersections, "id");

      if (overId) {
        const column = board?.lists?.find((list) => list.id === overId);

        if (column) {
          const containers = args.droppableContainers.filter((c) =>
            column.cardOrderIds.includes(c.id)
          );
          const result = closestCorners({ ...args, droppableContainers: containers });
          return result.length ? [{ id: result[0].id }] : [];
        }

        return [{ id: overId }];
      }

      return [];
    },
    [activeDragItemType, board?.lists]
  );

  // ============================
  // RENDER
  // ============================
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "#2f3542"
              : board?.background || "#3742fa",
          width: "100%",
          height: (theme) => theme.todo.boardContentHeight,
          display: "flex",
          overflowX: "auto",
        }}
      >
        <ListColumns board={board} showSnackbar={showSnackbar} />
      </Box>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeDragItemType === "column" && <Column list={activeDragItemData} />}
        {activeDragItemType === "card" && <CardItem card={activeDragItemData} />}
      </DragOverlay>
    </DndContext>
  );
}

export default BoardContent;
