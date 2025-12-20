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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
/* ================= MOCK DATA ================= */
const mockTasks = [
  {
    id: 1,
    title: "Design login screen",
    priority: "Medium",
    status: "Not started",
    plan: "Private tasks",
    assignee: "Me",
    dueDate: "2025-01-10",
  },
  {
    id: 2,
    title: "Fix API booking room",
    priority: "High",
    status: "In progress",
    plan: "Assigned to me",
    assignee: "Me",
    dueDate: "2025-01-12",
  },
];

/* ================= COMPONENT ================= */
export default function MyTasks({ board }) {
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Private tasks", "Assigned to me", "Flagged emails"];
const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Impỏrtant</MenuItem>
          <MenuItem value={20}>Medium</MenuItem>
          <MenuItem value={30}>Low </MenuItem>
        </Select>
                <TableCell>Status</TableCell>
                       <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Chưa hoàn thành</MenuItem>
          <MenuItem value={20}>Đang Hoàn Thành </MenuItem>
          <MenuItem value={30}>Đã Hoàn Thành </MenuItem>
        </Select>
                <TableCell>Assignee</TableCell>
                 <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}></MenuItem>
          <MenuItem value={20}>h </MenuItem>
          <MenuItem value={30}> </MenuItem>
        </Select>
                <TableCell>Due date</TableCell>
                <DatePicker label="Basic date picker" />
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
              {mockTasks.map((task) => (
                <TableRow
                  key={task.id}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <TableCell>
                    <Checkbox size="small" />
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        color: "#fff",
                        bgcolor: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "& .MuiChip-label": { color: "#fff" },
                      }}
                    />
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell />
                </TableRow>
              ))}

              {/* ADD TASK */}
              <TableRow>
                <TableCell colSpan={7}>
                  <Button
                    startIcon={<AddIcon />}
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
    </Box>
  );
}
