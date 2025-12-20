import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InboxIcon from "@mui/icons-material/Inbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TocIcon from "@mui/icons-material/Toc";
import LockIcon from "@mui/icons-material/Lock";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

function BottomNav({
  board,
  showBoard,
  showTasks,
  openInbox,
  openIdeas,
  onViewModeChange,
  currentViewMode,
  isPremium = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: "inbox",
      label: "Inbox",
      icon: <InboxIcon />,
      type: "action", // 👈 KHÔNG route
      action: openInbox, // 👈 MỞ INBOX
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
      viewMode: "column",
    },
    {
      id: "table",
      label: "Table",
      icon: <TocIcon />,
      type: "view",
      viewMode: "rows",
      isPremium: true,
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <EventNoteIcon />,
      type: "view",
      viewMode: "schedule",
      isPremium: true,
    },
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
          theme.palette.mode === "dark"
            ? "#2f3542"
            : board?.background || "#3742fa",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap", // ❌ không wrap
          overflowX: "auto", // ✅ scroll ngang
           justifyContent: "center", // ❌ không xuống dòng
          maxWidth: "100%",

          // Ẩn scrollbar cho đẹp
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.type === "route"
              ? location.pathname.startsWith(item.path)
              : item.type === "view" && item.viewMode === currentViewMode;

          const isLocked = item.isPremium && !isPremium;

          return (
            <Button
              key={item.id}
              startIcon={isLocked ? <LockIcon /> : item.icon}
              disabled={isLocked}
              onClick={() => {
                if (isLocked) return;

                if (item.type === "route") {
                  navigate(item.path);
                } else if (item.type === "view") {
                  showBoard();
                  onViewModeChange?.(item.viewMode);
                } else if (item.type === "action") {
                  item.action(); // 👈 openInbox()
                }
              }}
              sx={(theme) => ({
                textTransform: "none",
                px: 3,
                py: 1,
                color: isLocked
                  ? theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)"
                  : isActive
                  ? "#fff"
                  : theme.palette.mode === "dark"
                  ? "#ccc"
                  : "#000",
                bgcolor: isActive
                  ? theme.palette.mode === "dark"
                    ? "#34495e"
                    : board?.background
                  : theme.palette.mode === "dark"
                  ? "#2f3542"
                  : "#ffffff",
                boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
                transition: "all 0.3s ease",
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.6 : 1,
                "&:hover": {
                  bgcolor: isLocked
                    ? theme.palette.mode === "dark"
                      ? "#2f3542"
                      : "#ffffff"
                    : isActive
                    ? theme.palette.mode === "dark"
                      ? "#2c3e50"
                      : "#2c3e50"
                    : theme.palette.mode === "dark"
                    ? "#3a3f50"
                    : "#e0e0e0",
                },
                "&.Mui-disabled": {
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.3)",
                },
              })}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                {item.label}
              </Box>
            </Button>
          );
        })}

        {!isPremium && (
          <Button
            startIcon={<WorkspacePremiumIcon />}
            onClick={() => navigate("/premium")}
            sx={(theme) => ({
              flexShrink: 0,
              whiteSpace: "nowrap",
              px: { xs: 1.5, sm: 3 }, // responsive padding
              textTransform: "none",
              px: 3,
              py: 1,
              color: "#fff",
              bgcolor: "linear-gradient(45deg, #ffa502 30%, #ff6348 90%)",
              background: "linear-gradient(45deg, #ffa502 30%, #ff6348 90%)",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(255,165,2,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(255,165,2,0.4)",
                transform: "translateY(-2px)",
              },
            })}
          >
            Nâng cấp Premium
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default BottomNav;
