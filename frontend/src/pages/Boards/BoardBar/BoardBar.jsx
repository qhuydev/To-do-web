import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import TocIcon from "@mui/icons-material/Toc";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LockIcon from "@mui/icons-material/Lock";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function BoardBar({ board }) {
  const navigate = useNavigate();

  const [isStarred, setIsStarred] = useState(board?.isStarred || false);
  const [menuBoard, setMenuBoard] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const openBoard = Boolean(menuBoard);

  const handleToggleStar = () => {
    setIsStarred((prev) => !prev);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.todo.boardBarHeight,
        px: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "#2f3542"
            : board?.background || "#3742fa",
        borderBottom: "1px solid rgba(255,255,255,0.3)",
        flexWrap: "nowrap",
      }}
    >
      {/* ===== LEFT ===== */}
      <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
        <Tooltip title="Back to boards">
          <IconButton
            size="small"
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* BOARD TITLE */}
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {board?.title || "Untitled Board"}
        </Typography>

        {/* STAR */}
        <Tooltip title={isStarred ? "Unstar board" : "Star board"}>
          <IconButton
            size="small"
            onClick={handleToggleStar}
            sx={{ color: isStarred ? "#f2d600" : "white" }}
          >
            {isStarred ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>

        {/* BOARD MENU */}
        <Button
          size="small"
          color="inherit"
          startIcon={<LeaderboardOutlinedIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={(e) => setMenuBoard(e.currentTarget)}
          sx={{
            color: "white",
            textTransform: "none",
            gap: { xs: 0, sm: 1 },
          }}
        >
          <Typography sx={{ display: { xs: "none", sm: "block" } }}>Board</Typography>
        </Button>

        <Menu
          anchorEl={menuBoard}
          open={openBoard}
          onClose={() => setMenuBoard(null)}
          PaperProps={{
            sx: {
              width: 300,
              borderRadius: 2,
              p: 1,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
              mb: 1,
            }}
          >
            View
          </Typography>

          <MenuItem>
            <ListItemIcon>
              <LeaderboardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Board</ListItemText>
          </MenuItem>

          <MenuItem disabled>
            <ListItemIcon>
              <TocIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Table</ListItemText>
            <LockIcon fontSize="small" />
          </MenuItem>

          <MenuItem disabled>
            <ListItemIcon>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Schedule</ListItemText>
            <LockIcon fontSize="small" />
          </MenuItem>

          <Box sx={{ p: 1, mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#44546f",
                textTransform: "none",
                "&:hover": { bgcolor: "#384559" },
              }}
            >
              Nâng cấp không gian làm việc
            </Button>
          </Box>
        </Menu>
      </Box>

      {/* ===== RIGHT ===== */}
      <Box display="flex" alignItems="center" gap={1}>
        {/* Desktop: AvatarGroup */}
        <AvatarGroup
          max={3} // Desktop hiển thị 3, mobile gom vào More
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
            },
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Tooltip key={i} title={`User ${i + 1}`}>
              <Avatar
                alt="User avatar"
                src="https://avatars.githubusercontent.com/u/154976155?s=400&u=583d70f122d468a758f46896c349b38e886f6a2f&v=4"
              />
            </Tooltip>
          ))}
        </AvatarGroup>

        {/* Desktop icons */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
          <IconButton sx={{ color: "white" }}>
            <StarBorderIcon />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <PeopleOutlineIcon />
          </IconButton>
        </Box>

        {/* Share button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<PersonAddIcon />}
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Share
        </Button>

        {/* Mobile: More menu */}
        <IconButton
          sx={{ color: "white", display: { sm: "none" } }}
          onClick={handleMobileMenuOpen}
        >
          <MoreHorizIcon />
        </IconButton>

        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{ sx: { width: 200 } }}
        >
          <MenuItem>
            <AvatarGroup
              max={5}
              sx={{
                "& .MuiAvatar-root": { width: 30, height: 30, fontSize: 14 },
                mr: 1,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <Avatar
                  key={i}
                  alt={`User ${i + 1}`}
                  src="https://avatars.githubusercontent.com/u/154976155?s=400&u=583d70f122d468a758f46896c349b38e886f6a2f&v=4"
                />
              ))}
            </AvatarGroup>
            Members
          </MenuItem>

          <MenuItem>
            <IconButton sx={{ color: "inherit", mr: 1 }}>
              <StarBorderIcon />
            </IconButton>
            Star
          </MenuItem>

          <MenuItem>
            <IconButton sx={{ color: "inherit", mr: 1 }}>
              <PeopleOutlineIcon />
            </IconButton>
            Members
          </MenuItem>

          <MenuItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonAddIcon />}
              sx={{ color: "black", borderColor: "gray", "&:hover": { borderColor: "gray" } }}
            >
              Share
            </Button>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default BoardBar;
