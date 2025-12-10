import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import Typography from "@mui/material/Typography";
import Workspace from "./Menus/Workspace";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Profiles from "./Menus/Profiles";
function AppBar( { board } ) {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.todo.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "#2f3542"
            : board?.background || "#3742fa",
      }}
    >
      {/* Bên phải AppBar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
      >
        <AppsIcon
          sx={{ color: "white" }}
          fontSize="medium"
          onClick={() => navigate("/")}
        />
        <Typography
          component="span"
          variant="h6"
          sx={{ fontWeight: "bold", color: "white" }}
          onClick={() => navigate("/")}
        >
          To-do List
        </Typography>
        <Workspace />
        <Recent />
        <Starred />
        <Templates />
        <Button
          variant="outlined"
          startIcon={<LibraryAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
          onClick={() => navigate("/")}
        >
          Create
        </Button>
      </Box>

      {/* Bên trái AppBar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-basic"
          label="Search"
          type="text"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                fontSize="small"
                sx={{
                  color: searchValue ? "white" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => setSearchValue("")}
              />
            ),
            style: { color: "white" },
          }}
          sx={{
            minWidth: 120,
            maxWidth: 170,
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
        />
        {/* Đổi màu giao diện */}
        <ModeSelect />
        {/* Notification */}
        <Tooltip title="Notifications">
          <Badge color="warning" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon sx={{ color: "white" }} />
          </Badge>
        </Tooltip>

        {/* Trợ giúp */}
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: "pointer", color: "white" }} />
        </Tooltip>
        {/* Profiles */}
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
