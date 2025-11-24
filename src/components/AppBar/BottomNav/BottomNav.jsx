import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InboxIcon from "@mui/icons-material/Inbox";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

function BottomNav() {
const [active, setActive] = React.useState("inbox");
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
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#34495e" : "#1565c0"),
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", bgcolor: '#dfe6e9', borderRadius: '8px' }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <Button
              key={item.id}
              onClick={() => setActive(item.id)}
              startIcon={item.icon}   // <-- Thêm icon bên trái
              sx={{
                textTransform: "none",
                px: 3,
                py: 1,
                color: isActive ? "white" : "black",
                bgcolor: isActive ? "#34495e" : "transparent",
                boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: isActive ? "#2c3e50" : "#e0e0e0",
                },
              }}
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
