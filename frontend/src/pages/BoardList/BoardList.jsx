import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppBar from "~/components/AppBar/AppBar";
import { useBoardStore, useAuthStore } from "~/stores";

const BOARD_COLORS = [
  "#1976d2",
  "#8c7ae6",
  "#6F1E51",
  "#218c74",
  "#182C61",
  "#be2edd",
  "#ED4C67",
  "#f1c40f",
  
];

function BoardList() {
  const navigate = useNavigate();
  const { boards, isLoading, fetchBoards, createBoard } = useBoardStore();
  const { user } = useAuthStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    setCreating(true);
    const board = await createBoard({
      title: newBoardTitle,
      background: selectedColor,
    });
    setCreating(false);

    if (board) {
      setOpenDialog(false);
      setNewBoardTitle("");
      navigate(`/boards/${board.id}`);
    }
  };

  const starredBoards = boards.filter((b) => b.isStarred);
  const otherBoards = boards.filter((b) => !b.isStarred);

  if (isLoading && boards.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "#2c3e50"
            : theme.palette.background.default,
      }}
    >
      <AppBar />

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={0.5}
            sx={{ color: "text.primary" }}
          >
            Welcome back, {user?.displayName?.split(" ")[0] || "there"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your boards and tasks
          </Typography>
        </Box>

        {starredBoards.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <StarIcon sx={{ color: "#f2d600", fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
              >
                Starred
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {starredBoards.map((board) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
                  <BoardCard
                    board={board}
                    onClick={() => navigate(`/boards/${board.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <DashboardIcon sx={{ fontSize: 20, color: "text.secondary" }} />
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Your boards
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {otherBoards.map((board) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
              <BoardCard
                board={board}
                onClick={() => navigate(`/boards/${board.id}`)}
              />
            </Grid>
          ))}

          {/* Card tạo board mới */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: 120,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#2c3e50" : "#f1f2f4",
                cursor: "pointer",
                border: "2px dashed",
                borderColor: "divider",
                boxShadow: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#34495e" : "#e4e6ea",
                },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setOpenDialog(true)}
              >
                <AddIcon sx={{ mr: 0.5, color: "text.secondary" }} />
                <Typography color="text.secondary" fontWeight={500}>
                  Create new board
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog tạo board */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Create Board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Board title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            margin="normal"
            onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
            sx={{
              "& .MuiInputBase-input": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : "#000",
              },
              "& .MuiInputLabel-root": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.text.secondary
                    : "#555",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.23)",
              },
            }}
          />

          <Typography variant="body2" color="text.secondary" mt={2} mb={1}>
            Background color
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {BOARD_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  width: 40,
                  height: 32,
                  bgcolor: color,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: selectedColor === color ? "2px solid #000" : "none",
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateBoard}
            disabled={!newBoardTitle.trim() || creating}
          >
            {creating ? <CircularProgress size={20} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function BoardCard({ board, onClick }) {
  return (
    <Card
      sx={{
        height: 120,
        bgcolor:
          board.background ||
          (theme.palette.mode === "dark" ? "#2c3e50" : "#fff"),

        position: "relative",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          bgcolor:
            board.background ||
            (theme.palette.mode === "dark" ? "#34495e" : "#0052cc"),
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)",
        },
      }}
    >
      <CardActionArea sx={{ height: "100%" }} onClick={onClick}>
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {board.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      {board.isStarred && (
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            color: "#f2d600",
            zIndex: 2,
          }}
        >
          <StarIcon sx={{ fontSize: 18 }} />
        </Box>
      )}
    </Card>
  );
}

export default BoardList;
