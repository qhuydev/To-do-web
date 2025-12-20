import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { useAuthStore } from '~/stores'

function Profiles() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
        >
          <Avatar
            sx={{ width: 36, height: 36, bgcolor: '#1976d2' }}
            alt={user?.displayName}
            src={user?.avatar}
          >
            {getInitials(user?.displayName)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user?.displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleClose(); navigate('/'); }}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          My Boards
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
