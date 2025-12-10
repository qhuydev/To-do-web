import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InboxIcon from "@mui/icons-material/Inbox";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

function BottomNav({ board }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "inbox", label: "Inbox", path: "/inbox", icon: <InboxIcon /> },
    { id: "planner", label: "Planner", path: "/planner", icon: <CalendarTodayIcon /> },
    { id: "board", label: "Board", path: "/board", icon: <DashboardIcon /> },
    { id: "switch", label: "Switch boards", path: "/switch", icon: <SwapHorizIcon /> },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.todo.bottomBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2f3542" : board?.background || "#3742fa",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          borderRadius: "8px",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Button
              key={item.id}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={(theme) => ({
                textTransform: "none",
                px: 3,
                py: 1,
                color: isActive ? "#fff" : theme.palette.mode === "dark" ? "#ccc" : "#000",
                bgcolor: isActive
                  ? theme.palette.mode === "dark"
                    ? "#34495e"
                    : board?.background
                  : theme.palette.mode === "dark"
                  ? "#2f3542"
                  : "#ffffff",
                boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: isActive
                    ? theme.palette.mode === "dark"
                      ? "#2c3e50"
                      : "#2c3e50"
                    : theme.palette.mode === "dark"
                    ? "#3a3f50"
                    : "#e0e0e0",
                },
              })}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

export default BottomNav;
