import React from "react"
import Box from "@mui/material/Box"
import { Button, Typography } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Tooltip from "@mui/material/Tooltip"
import AddCardIcon from "@mui/icons-material/AddCard"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import CloudIcon from "@mui/icons-material/Cloud"
import DragHandleIcon from "@mui/icons-material/DragHandle"

import ListCards from "./ListCards/ListCards"

function Columns() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)
  return (
     <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
        ml: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: 'fit-content',
        maxHeight: (theme) =>
          `calc(${theme.todo.boardContentHeight} - ${theme.spacing(4)})`,
      }}
    >
    
      {/* Column Header */}
      <Box
        sx={{
          height: (theme) => theme.todo.columnHeaderHeight,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Column
        </Typography>

        <Tooltip title="More options">
          <ExpandMoreIcon
            id="basic-button-workspaces"
            aria-controls={open ? "basic-menu-workspaces" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ cursor: "pointer" }}
          />
        </Tooltip>

        <Menu
          id="basic-menu-workspaces"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AddCardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add new card</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove this column</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <CloudIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive this column</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* List Cards */}
      <ListCards />

      {/* Column Footer */}
      <Box
        sx={{
          height: (theme) => theme.todo.columnFooterHeight,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button startIcon={<AddCardIcon />}> Add New Card</Button>
        <Tooltip title="Drag to move">
          <DragHandleIcon sx={{ cursor: "grab" }} />
        </Tooltip>
      </Box>

   
    </Box>
  )
}

export default Columns