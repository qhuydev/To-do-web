import { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/* ================= MOCK DATA ================= */

/* ================= COMPONENT ================= */
export default function MyTasks({ board }) {
  const assignees = ["Me", "Huy", "Admin", "Tester"];

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design login screen",
      priority: "Medium",
      status: "Not started",
      assignee: "Me",
      dueDate: "2025-01-10",
    },
    {
      id: 2,
      title: "Fix API booking room",
      priority: "High",
      status: "In progress",
      assignee: "Me",
      dueDate: "2025-01-12",
    },
  ]);

  const handleUpdateTask = (id, field, value) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
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
                <TableCell>Priority</TableCell>

                <TableCell>Status</TableCell>

                <TableCell>Assignee</TableCell>

                <TableCell>Due date</TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{
                      color: "#fff",
                      textTransform: "none",
                      "& .MuiSvgIcon-root": { color: "#fff" },
                    }}
                  >
                    Add column
                  </Button>
                </TableCell>
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
                    <Checkbox size="small" />
                  </TableCell>

                  <TableCell>{task.title}</TableCell>

                  <TableCell
                    sx={{
                      // hover cả cell → hiện icon
                      "&:hover .MuiSelect-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Select
                      value={task.priority}
                      size="small"
                      onChange={(e) =>
                        handleUpdateTask(task.id, "priority", e.target.value)
                      }
                      sx={{
                        color: "#fff",

                        "& fieldset": {
                          border: "none",
                        },

                        // ẨN mũi tên mặc định
                        "& .MuiSelect-icon": {
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          color: "#90caf9", // xanh nhạt
                        },

                        // hover select → nền nhẹ + hiện icon
                        "&:hover": {
                          background: "rgba(255,255,255,0.08)",

                          "& .MuiSelect-icon": {
                            opacity: 1,
                          },
                        },

                        // focus → hiện icon + nền đậm hơn
                        "&.Mui-focused": {
                          background: "rgba(255,255,255,0.12)",

                          "& .MuiSelect-icon": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </TableCell>

                  {/* ✅ STATUS SELECT */}
                  <TableCell
                    sx={{
                      // hover vào cell thì hiện icon
                      "&:hover .MuiSelect-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Select
                      value={task.status}
                      size="small"
                      onChange={(e) =>
                        handleUpdateTask(task.id, "status", e.target.value)
                      }
                      sx={{
                        color: "#fff",

                        "& fieldset": {
                          border: "none",
                        },

                        // ẨN mũi tên mặc định
                        "& .MuiSelect-icon": {
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          color: "#90caf9", // xanh nhạt
                        },

                        // focus thì vẫn hiện
                        "&.Mui-focused .MuiSelect-icon": {
                          opacity: 1,
                        },

                        // hover riêng select (phòng trường hợp tab)
                        "&:hover .MuiSelect-icon": {
                          opacity: 1,
                        },
                      }}
                    >
                      <MenuItem value="Not started">Not started</MenuItem>
                      <MenuItem value="In progress">In progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell
                    sx={{
                      // hover cả cell → hiện mũi tên
                      "&:hover .MuiSelect-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Select
                      value={task.assignee}
                      size="small"
                      onChange={(e) =>
                        handleUpdateTask(task.id, "assignee", e.target.value)
                      }
                      sx={{
                        color: "#fff",

                        "& fieldset": {
                          border: "none",
                        },

                        // ẨN mũi tên mặc định
                        "& .MuiSelect-icon": {
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          color: "#90caf9",
                        },

                        // hover → nền + hiện icon
                        "&:hover": {
                          background: "rgba(255,255,255,0.08)",

                          "& .MuiSelect-icon": {
                            opacity: 1,
                          },
                        },

                        // focus → nền đậm hơn
                        "&.Mui-focused": {
                          background: "rgba(255,255,255,0.12)",

                          "& .MuiSelect-icon": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      {assignees.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

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

                        // ẨN ICON LỊCH
                        "&::-webkit-calendar-picker-indicator": {
                          opacity: 0,
                          cursor: "pointer",
                          filter: "invert(1)",
                        },
                      },

                      // HOVER ROW → hiện icon + viền xanh
                      "&:hover input": {
                        borderColor: "#636e72", // xanh nhạt giống hình
                        background: "rgba(144,202,249,0.08)",

                        "&::-webkit-calendar-picker-indicator": {
                          opacity: 1,
                        },
                      },

                      // FOCUS → xanh đậm hơn
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
                      value={task.dueDate}
                      onChange={(e) =>
                        handleUpdateTask(task.id, "dueDate", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell />
                </TableRow>
              ))}
              {/* ADD TASK */}{" "}
              <TableRow>
                {" "}
                <TableCell colSpan={7}>
                  {" "}
                  <Button
                    startIcon={<AddIcon />}
                    sx={{
                      color: "#fff",
                      textTransform: "none",
                      "& .MuiSvgIcon-root": { color: "#fff" },
                    }}
                  >
                    {" "}
                    Add new task{" "}
                  </Button>{" "}
                </TableCell>{" "}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
