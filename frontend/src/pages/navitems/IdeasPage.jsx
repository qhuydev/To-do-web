import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Chip,
  Stack,
  Divider
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import { useState } from "react"

export default function IdeasPage({ board }) {
  const [ideas, setIdeas] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")

  const addIdea = () => {
    if (!title.trim()) return
    setIdeas(prev => [
      {
        id: Date.now(),
        title,
        desc,
        status: "idea"
      },
      ...prev
    ])
    setTitle("")
    setDesc("")
  }

  const updateStatus = (id, status) => {
    setIdeas(prev =>
      prev.map(i => (i.id === id ? { ...i, status } : i))
    )
  }

  const convertToTask = (idea) => {
    updateStatus(idea.id, "converted")
  }

  const statusMap = {
    idea: { label: "Idea", color: "default" },
    approved: { label: "Approved", color: "success" },
    converted: { label: "Converted", color: "warning" }
  }

  return (
    <Box
      sx={{
        height: "100%",
        p: 3,
        overflowY: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "#1e272e"
            : board?.background || "#f1f2f6",
      }}
    >
      {/* ===== HEADER ===== */}
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <LightbulbIcon color="warning" />
        <Typography variant="h5" fontWeight={700}>
          Ideas
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
        Capture ideas and turn them into real tasks ✨
      </Typography>

      {/* ===== ADD IDEA ===== */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: 3
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Idea title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Description (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addIdea}
              sx={{ alignSelf: "flex-end", px: 3 }}
            >
              Add Idea
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ===== LIST ===== */}
      <Stack spacing={2}>
        {ideas.length === 0 && (
          <Typography sx={{ opacity: 0.6 }}>
            No ideas yet. Start by adding one 💭
          </Typography>
        )}

        {ideas.map((idea) => (
          <Card
            key={idea.id}
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              transition: "0.2s",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)"
              }
            }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontWeight={600}>
                    {idea.title}
                  </Typography>
                  <Chip
                    size="small"
                    label={statusMap[idea.status].label}
                    color={statusMap[idea.status].color}
                  />
                </Stack>

                {idea.desc && (
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {idea.desc}
                  </Typography>
                )}

                <Divider />

                <Stack direction="row" spacing={1}>
                  {idea.status === "idea" && (
                    <Button
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      color="success"
                      onClick={() => updateStatus(idea.id, "approved")}
                    >
                      Approve
                    </Button>
                  )}

                  {idea.status === "approved" && (
                    <Button
                      size="small"
                      startIcon={<SwapHorizIcon />}
                      color="warning"
                      onClick={() => convertToTask(idea)}
                    >
                      Convert to Task
                    </Button>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
