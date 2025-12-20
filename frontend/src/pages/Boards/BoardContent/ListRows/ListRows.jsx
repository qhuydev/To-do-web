import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Tabs,
    Tab,
    Chip,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    Button,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBoardStore } from "~/stores";
import EditCardModal from "../ListColumns/Columns/ListCards/Card/EditCardModal";

/* ================= COMPONENT ================= */
export default function ListRows({ board }) {
    const { deleteCard, updateCard } = useBoardStore();
    
    // Lấy tất cả cards từ board
    const allCards = useMemo(() => {
        if (!board?.lists) return [];
        return board.lists.flatMap((list) => 
            (list.cards || []).map(card => ({
                ...card,
                listId: list.id,
                listTitle: list.title
            }))
        );
    }, [board]);

    const [tasks, setTasks] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Cập nhật tasks khi allCards thay đổi
    useEffect(() => {
        setTasks(allCards);
    }, [allCards]);

    const handleUpdateCard = async (cardId, field, value) => {
        try {
            // Tìm card để lấy title
            const currentCard = tasks.find(task => task.id === cardId);
            if (!currentCard) return;

            // Luôn gửi title kèm theo để tránh lỗi validation
            const updateData = { 
                title: currentCard.title,
                [field]: value 
            };
            await updateCard(cardId, updateData);
            setTasks((prev) =>
                prev.map((task) => (task.id === cardId ? { ...task, [field]: value } : task))
            );
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm("Bạn có chắc muốn xóa task này?")) {
            try {
                await deleteCard(cardId);
                setTasks((prev) => prev.filter((task) => task.id !== cardId));
            } catch (error) {
                console.error("Error deleting card:", error);
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    const handleOpenEditModal = (task) => {
        setSelectedCard(task);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedCard(null);
    };

    const handleSaveCard = async (updatedCard) => {
        try {
            // Gọi API update card
            await updateCard(updatedCard.id, {
                title: updatedCard.title,
                startDate: updatedCard.startDate,
                dueDate: updatedCard.dueDate,
                cover: updatedCard.cover,
                labels: updatedCard.labels,
            });
            
            // Cập nhật local state
            setTasks((prev) =>
                prev.map((task) => (task.id === updatedCard.id ? { ...task, ...updatedCard } : task))
            );
            
            handleCloseEditModal();
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    const handleOpenAddModal = () => {
        setAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };

    const handleAddNewTask = () => {
        // Modal assign sẽ tự gọi API createWithoutList và gửi message
        // Sau đó reload board để cập nhật
        handleCloseAddModal();
    };

    const [view, setView] = useState("list");
    const [filter, setFilter] = useState("All");

    const filters = ["All", "Private tasks", "Assigned to me", "Flagged emails"];

    return (
        <Box
            sx={{
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? "#2f3542"
                        : board?.background || "#3742fa",
                width: "100%",
                height: (theme) => theme.todo.boardContentHeight,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                p: 2,
                color: "#fff",
            }}
        >
            {/* ================= HEADER ================= */}
            <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: "#fff" }}>
                My Tasks
            </Typography>

            {/* ================= TABS ================= */}
            <Tabs
                value={view}
                onChange={(_, v) => setView(v)}
                sx={{
                    minHeight: 36,
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#fff",
                    },
                }}
            >
                <Tab
                    label="List"
                    value="list"
                    sx={{
                        textTransform: "none",
                        minHeight: 36,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.7)",
                        "&.Mui-selected": {
                            color: "#fff",
                        },
                    }}
                />
            </Tabs>

            {/* ================= FILTERS ================= */}
            <Box display="flex" gap={1} my={1} flexWrap="wrap">
                {filters.map((item) => (
                    <Chip
                        key={item}
                        label={item}
                        clickable
                        size="small"
                        onClick={() => setFilter(item)}
                        sx={{
                            color: "#fff",
                            bgcolor:
                                filter === item
                                    ? "rgba(255,255,255,0.25)"
                                    : "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            "& .MuiChip-label": { color: "#fff" },
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,0.3)",
                            },
                        }}
                    />
                ))}
            </Box>

            {/* ================= CONTENT ================= */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                        bgcolor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.3)",
                        backdropFilter: "blur(6px)",

                        "& .MuiTableCell-root": {
                            color: "#fff",
                            borderColor: "rgba(255,255,255,0.15)",
                        },

                        "& .MuiCheckbox-root": {
                            color: "#fff",
                            "&.Mui-checked": { color: "#fff" },
                        },

                        "& .MuiSvgIcon-root": {
                            color: "#fff",
                        },
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell width={40} />
                                <TableCell>Task</TableCell>
                                <TableCell>Assignee</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Start date</TableCell>
                                <TableCell>Due date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow
                                    key={task.id}
                                    hover
                                    sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
                                >
                                    <TableCell>
                                        <Checkbox 
                                            size="small" 
                                            checked={!!task.completed}
                                            onChange={(e) => handleUpdateCard(task.id, "completed", e.target.checked)}
                                        />
                                    </TableCell>

                                    <TableCell>{task.title || "Untitled"}</TableCell>

                                    <TableCell>
                                        {task.memberIds && task.memberIds.length > 0 
                                            ? task.memberIds.join(", ") 
                                            : "Me"}
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <Chip
                                            label={task.completed ? "Completed" : "In progress"}
                                            size="small"
                                            clickable
                                            onClick={() => handleUpdateCard(task.id, "completed", !task.completed)}
                                            sx={{
                                                bgcolor: task.completed 
                                                    ? "rgba(76, 175, 80, 0.3)" 
                                                    : "rgba(255, 152, 0, 0.3)",
                                                color: "#fff",
                                                border: "1px solid rgba(255,255,255,0.3)",
                                                "&:hover": {
                                                    bgcolor: task.completed 
                                                        ? "rgba(76, 175, 80, 0.5)" 
                                                        : "rgba(255, 152, 0, 0.5)",
                                                }
                                            }}
                                        />
                                    </TableCell>

                                    {/* START DATE */}
                                    <TableCell
                                        sx={{
                                            position: "relative",

                                            "& input": {
                                                background: "transparent",
                                                color: "#fff",
                                                border: "1px solid transparent",
                                                padding: "4px 6px",
                                                borderRadius: "4px",
                                                fontSize: "13px",
                                                cursor: "pointer",

                                                "&::-webkit-calendar-picker-indicator": {
                                                    opacity: 0,
                                                    cursor: "pointer",
                                                    filter: "invert(1)",
                                                },
                                            },

                                            "&:hover input": {
                                                borderColor: "#636e72",
                                                background: "rgba(144,202,249,0.08)",

                                                "&::-webkit-calendar-picker-indicator": {
                                                    opacity: 1,
                                                },
                                            },

                                            "& input:focus": {
                                                outline: "none",
                                                borderColor: "#64b5f6",
                                                background: "rgba(144,202,249,0.12)",

                                                "&::-webkit-calendar-picker-indicator": {
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                    >
                                        <input
                                            type="date"
                                            value={formatDate(task.startDate || task.createdAt)}
                                            onChange={(e) =>
                                                handleUpdateCard(task.id, "startDate", e.target.value)
                                            }
                                        />
                                    </TableCell>

                                    {/* DUE DATE */}
                                    <TableCell
                                        sx={{
                                            position: "relative",

                                            "& input": {
                                                background: "transparent",
                                                color: "#fff",
                                                border: "1px solid transparent",
                                                padding: "4px 6px",
                                                borderRadius: "4px",
                                                fontSize: "13px",
                                                cursor: "pointer",

                                                "&::-webkit-calendar-picker-indicator": {
                                                    opacity: 0,
                                                    cursor: "pointer",
                                                    filter: "invert(1)",
                                                },
                                            },

                                            "&:hover input": {
                                                borderColor: "#636e72",
                                                background: "rgba(144,202,249,0.08)",

                                                "&::-webkit-calendar-picker-indicator": {
                                                    opacity: 1,
                                                },
                                            },

                                            "& input:focus": {
                                                outline: "none",
                                                borderColor: "#64b5f6",
                                                background: "rgba(144,202,249,0.12)",

                                                "&::-webkit-calendar-picker-indicator": {
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                    >
                                        <input
                                            type="date"
                                            value={formatDate(task.dueDate)}
                                            onChange={(e) =>
                                                handleUpdateCard(task.id, "dueDate", e.target.value)
                                            }
                                        />
                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color: "#fff",
                                                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                                                }}
                                                onClick={() => handleOpenEditModal(task)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color: "#f44336",
                                                    "&:hover": { bgcolor: "rgba(244,67,54,0.1)" },
                                                }}
                                                onClick={() => handleDeleteCard(task.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* ADD TASK */}
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={handleOpenAddModal}
                                        sx={{
                                            color: "#fff",
                                            textTransform: "none",
                                            "& .MuiSvgIcon-root": { color: "#fff" },
                                        }}
                                    >
                                        Add new task
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Edit Card Modal */}
            <EditCardModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                card={selectedCard}
                onSave={handleSaveCard}
                mode="edit"
            />

            {/* Add New Task Modal */}
            <EditCardModal
                open={addModalOpen}
                onClose={handleCloseAddModal}
                card={null}
                onSave={handleAddNewTask}
                mode="assign"
            />
        </Box>
    );
}
