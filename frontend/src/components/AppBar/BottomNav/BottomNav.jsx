import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled, useTheme } from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/Inbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const navItems = (showBoard, showTasks, openInbox, openIdeas) => [
  {
    id: "inbox",
    label: "Inbox",
    icon: <InboxIcon />,
    type: "action",
    action: openInbox,
  },
  {
    id: "ideas",
    label: "Ideas",
    icon: <LightbulbIcon />,
    type: "action",
    action: openIdeas,
  },
  {
    id: "board",
    label: "Board",
    icon: <DashboardIcon />,
    type: "view",
    view: "board",
  },
  {
    id: "tasks",
    label: "My Tasks",
    icon: <SwapHorizIcon />,
    type: "view",
    view: "tasks",
  },
];

const NavButton = styled(Button)(({ theme, active, bgColor }) => ({
  textTransform: "none",
  whiteSpace: "nowrap",
  padding: "6px 20px",
  color: active
    ? "#fff"
    : theme.palette.mode === "dark"
    ? "#ccc"
    : "#000",
  backgroundColor: active
    ? bgColor
    : theme.palette.mode === "dark"
    ? "#2f3542"
    : "#ffffff",
  boxShadow: active ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.mode === "dark"
        ? "#2c3e50"
        : "#2c3e50"
      : theme.palette.mode === "dark"
      ? "#3a3f50"
      : "#e0e0e0",
    transform: "scale(1.05)",
  },
}));

function BottomNav({ board, showBoard, showTasks, openInbox, openIdeas }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.todo?.bottomBarHeight || 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor:
          theme.palette.mode === "dark"
            ? "#2f3542"
            : board?.background || "#3742fa",
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          flexWrap: "nowrap",
          borderRadius: "8px",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {navItems(showBoard, showTasks, openInbox, openIdeas).map((item) => {
          const isActive =
            item.type === "route"
              ? location.pathname.startsWith(item.path)
              : false;

          const handleClick = () => {
            if (item.type === "route") {
              navigate(item.path);
            } else if (item.type === "view") {
              item.view === "board" ? showBoard() : showTasks();
            } else if (item.type === "action") {
              item.action();
            }
          };

          return (
            <NavButton
              key={item.id}
              startIcon={item.icon}
              onClick={handleClick}
              active={isActive}
              bgColor={board?.background || "#3742fa"}
            >
              {item.label}
            </NavButton>
          );
        })}
      </Box>
    </Box>
  );
}

export default BottomNav;
