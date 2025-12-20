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
import FriendsModal from "./FriendsModal";
import useAuthStore from "~/stores/authStore";

function BoardBar({ board, viewMode, onViewModeChange }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [isStarred, setIsStarred] = useState(board?.isStarred || false);
  const [menuBoard, setMenuBoard] = useState(null);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);

  const openBoard = Boolean(menuBoard);
  const isPremium = user?.isPremium || false;

  const handleToggleStar = () => {
    setIsStarred((prev) => !prev);
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
      }}
    >
      {/* ===== LEFT ===== */}
      <Box display="flex" alignItems="center" gap={1}>
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
            maxWidth: { xs: 120, sm: 240, md: 400 },
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
          sx={{ color: "white", textTransform: "none" }}
        >
          <Box sx={{ display: { xs: "none", sm: "inline" } }}>View</Box>
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

          <MenuItem
            selected={viewMode === "column"}
            onClick={() => {
              onViewModeChange("column");
              setMenuBoard(null);
            }}
          >
            <ListItemIcon>
              <LeaderboardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Column</ListItemText>
          </MenuItem>

          <MenuItem
            disabled={!isPremium}
            selected={viewMode === "rows"}
            onClick={() => {
              if (isPremium) {
                onViewModeChange("rows");
                setMenuBoard(null);
              }
            }}
          >
            <ListItemIcon>
              <TocIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rows</ListItemText>
            {!isPremium && <LockIcon fontSize="small" />}
          </MenuItem>

          <MenuItem
            disabled={!isPremium}
            selected={viewMode === "schedule"}
            onClick={() => {
              if (isPremium) {
                onViewModeChange("schedule");
                setMenuBoard(null);
              }
            }}
          >
            <ListItemIcon>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Schedule</ListItemText>
            {!isPremium && <LockIcon fontSize="small" />}
          </MenuItem>

          {!isPremium && (
            <Box sx={{ p: 1, mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setMenuBoard(null);
                  navigate("/premium");
                }}
                sx={{
                  bgcolor: "#44546f",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#384559" },
                }}
              >
                Nâng cấp không gian làm việc
              </Button>
            </Box>
          )}
        </Menu>
      </Box>
      {/* RIGHT */}{" "}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {" "}
        <AvatarGroup
          max={3}
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b500" },
            },
          }}
        >
          {" "}
          {/* Ví dụ: Danh sách user — có thể thay sau bằng dữ liệu động */}{" "}
          {[...Array(5)].map((_, i) => (
            <Tooltip key={i} title="Huy">
              {" "}
              <Avatar
                alt="User avatar"
                src="https://avatars.githubusercontent.com/u/154976155?s=400&u=583d70f122d468a758f46896c349b38e886f6a2f&v=4"
              />{" "}
            </Tooltip>
          ))}{" "}
        </AvatarGroup>{" "}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {" "}
          <IconButton sx={{ color: "white" }}> </IconButton>{" "}
          <Tooltip title="Bạn bè">
            <IconButton
              sx={{ color: "white" }}
              onClick={() => setIsFriendsModalOpen(true)}
            >
              {" "}
              <PeopleOutlineIcon />{" "}
            </IconButton>
          </Tooltip>{" "}
        </Box>{" "}
        <Button
          variant="outlined"
          size="small"
          startIcon={<PersonAddIcon />}
          sx={{
            display: { xs: "none", md: "flex" },
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          {" "}
          Share{" "}
        </Button>{" "}
        <FriendsModal
          open={isFriendsModalOpen}
          onClose={() => setIsFriendsModalOpen(false)}
        />
        <IconButton sx={{ color: "white" }}>
          {" "}
          <MoreHorizIcon />{" "}
        </IconButton>{" "}
      </Box>
    </Box>
  );
}

export default BoardBar;
