import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import { DragOverlay } from "@dnd-kit/core";

import ListColumns from "./ListColumns/ListColumns";
import ListRows from "./ListRows/ListRows";
import ScheduleView from "./ScheduleView/ScheduleView";
import Column from "./ListColumns/Columns/Columns";
import CardItem from "./ListColumns/Columns/ListCards/Card/CardItem";
import { useBoardStore } from "~/stores";

function BoardContent({ board, showSnackbar, viewMode = 'column' }) {
  return (
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "#2f3542"
              : board?.background || "#3742fa",
          width: "100%",
          height: (theme) => theme.todo.boardContentHeight,
          display: "flex",
          overflowX: viewMode === 'column' ? "auto" : "hidden",
          overflowY: viewMode === 'rows' || viewMode === 'schedule' ? "auto" : "hidden",
        }}
      >
        {viewMode === 'column' && (
          <ListColumns board={board} showSnackbar={showSnackbar} />
        )}
        {viewMode === 'rows' && (
          <ListRows board={board} showSnackbar={showSnackbar} />
        )}
        {viewMode === 'schedule' && (
          <ScheduleView board={board} showSnackbar={showSnackbar} />
        )}
      </Box>
  );
}

export default BoardContent;
