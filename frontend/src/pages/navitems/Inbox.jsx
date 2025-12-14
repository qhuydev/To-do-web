import React, { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Stack,
  Divider
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AssignmentIcon from "@mui/icons-material/Assignment"
import NotificationsIcon from "@mui/icons-material/Notifications"

function Inbox() {
  const [items, setItems] = useState([
    {
      title: "Task mới từ Ideas",
      date: "Today",
      type: "new",
    },
    {
      title: "Task chưa gán board",
      date: "Dec 29",
      type: "unassigned",
    },
    {
      title: "Task được giao cho bạn",
      date: "Dec 28",
      type: "assigned",
    },
    {
      title: "Reminder: Deadline sắp tới",
      date: "Tomorrow",
      type: "notification",
    },
  ])

  const [value, setValue] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleAdd = () => {
    if (!value.trim()) {
      setIsAdding(false)
      return
    }

    setItems(prev => [
      {
        title: value.trim(),
        date: "Today",
        type: "new",
      },
      ...prev,
    ])

    setValue("")
    setIsAdding(false)
  }

  const typeMap = {
    new: { label: "New Task", color: "primary" },
    unassigned: { label: "Unassigned", color: "warning" },
    assigned: { label: "Assigned to you", color: "success" },
    notification: { label: "Reminder", color: "error" },
  }

  return (
    <>
      <Box
        sx={{
          width: 340,
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          p: 2.5,
        }}
      >
        {/* ===== HEADER ===== */}
        <Typography variant="h6" fontWeight={700}>
          📥 Inbox
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
          All unprocessed tasks and notifications
        </Typography>

        {/* ===== QUICK ADD ===== */}
        {!isAdding ? (
          <Box
            onClick={() => setIsAdding(true)}
            sx={{
              mb: 2,
              p: 1.2,
              bgcolor: "#fff",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#888",
              boxShadow: 1,
            }}
          >
            + Add quick task
          </Box>
        ) : (
          <TextField
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type and press Enter"
            fullWidth
            size="small"
            onBlur={handleAdd}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
              if (e.key === "Escape") {
                setValue("")
                setIsAdding(false)
              }
            }}
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: "10px",
            }}
          />
        )}

        {/* ===== LIST ===== */}
        <Stack spacing={1.5}>
          {items.map((item, index) => (
            <Card
              key={index}
              onClick={() => {
                setSelectedItem(item)
                setOpen(true)
              }}
              sx={{
                borderRadius: "12px",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 3,
                  bgcolor: "#f0f3ff",
                },
              }}
            >
              <CardContent sx={{ p: 1.8 }}>
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={typeMap[item.type].label}
                      color={typeMap[item.type].color}
                    />
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="caption">
                      {item.date}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* ===== DETAIL DIALOG ===== */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Inbox Item</DialogTitle>
        <DialogContent>
          <Typography fontWeight={600} mb={1}>
            {selectedItem?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedItem?.date}
          </Typography>
          <Chip
            sx={{ mt: 2 }}
            label={selectedItem && typeMap[selectedItem.type].label}
            color={selectedItem && typeMap[selectedItem.type].color}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Inbox
