import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TocIcon from "@mui/icons-material/Toc";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import LockIcon from "@mui/icons-material/Lock";

function BoardBar() {
  const [menuBoard, setMenuBoard] = React.useState(null);
  const openBoard = Boolean(menuBoard);

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
          theme.palette.mode === "dark" ? "#34495e" : "#1565c0",
        borderBottom: "1px solid white",
      }}
    >
      {/* LEFT */}
      <Box display="flex" alignItems="center">
        {/* My Design */}
        <Button
          color="inherit"
          onClick={(e) => setMenuDesign(e.currentTarget)}
          sx={{ color: "white" }}
        >
          My Design
        </Button>

        {/* Board menu */}
        <Button
          sx={{
            color: "white",
          }}
          color="inherit"
          onClick={(e) => setMenuBoard(e.currentTarget)}
          endIcon={<ExpandMoreIcon />}
          startIcon={<LeaderboardOutlinedIcon />}
        >
          Board
        </Button>

        <Menu
          anchorEl={menuBoard}
          open={openBoard}
          onClose={() => setMenuBoard(null)}
          PaperProps={{
            elevation: 3,
            sx: {
              width: 300,
              borderRadius: 2,
              p: 1.5,
              boxShadow: "0px 4px 16px rgba(0,0,0,0.15)"
            },
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              textAlign: "center",
              mb: 1,
              color: "#172b4d",
            }}
          >
            View
          </Typography>

          {/* Board */}
          <MenuItem>
            <ListItemIcon>
              <LeaderboardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Board</ListItemText>
          </MenuItem>

          {/* Table (locked) */}
          <MenuItem disabled>
            <ListItemIcon>
              <TocIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={{ color: "#7a869a" }}>Table</ListItemText>

            <Box sx={{ display: "flex", alignItems: "center", opacity: 0.8 }}>
              <LockIcon fontSize="small" />
            </Box>
          </MenuItem>

          {/* Calendar / Schedule (locked) */}
          <MenuItem disabled>
            <ListItemIcon>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText sx={{ color: "#7a869a" }}>Schedule</ListItemText>

            <Box sx={{ display: "flex", alignItems: "center", opacity: 0.8 }}>
              <LockIcon fontSize="small" />
            </Box>
          </MenuItem>

          <Box sx={{ p: 1, mt: 6, mb: 1 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#44546f", // màu cố định
                ":hover": { bgcolor: "#384559" }, // màu hover cố định
                textTransform: "none",
                borderRadius: 1.5,
              }}
            >
              Nâng cấp không gian làm việc
            </Button>
          </Box>
        </Menu>
      </Box>

      {/* RIGHT */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AvatarGroup
          max={3}
          sx={{
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
          {/* Ví dụ: Danh sách user — có thể thay sau bằng dữ liệu động */}
          {[...Array(5)].map((_, i) => (
            <Tooltip key={i} title="Huy">
              <Avatar
                alt="User avatar"
                src="https://avatars.githubusercontent.com/u/154976155?s=400&u=583d70f122d468a758f46896c349b38e886f6a2f&v=4"
              />
            </Tooltip>
          ))}
        </AvatarGroup>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          
          <IconButton sx={{ color: "white" }}>
          <StarBorderIcon />
        </IconButton>

          <IconButton sx={{ color: "white" }}>
          <PeopleOutlineIcon />
        </IconButton>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Share
        </Button>
        <IconButton sx={{ color: "white" }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default BoardBar;
