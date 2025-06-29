import { Paper, Box, Typography, TextField, MenuItem, List, ListItemButton, ListItemText } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

type ClassListSidebarProps = {
    schoolYears: string[];
    selectedSchoolYear: string;
    onSchoolYearChange: (year: string) => void;
    rooms: string[];
    selectedRoom: string;
    onRoomChange: (room: string) => void;
};

const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";
const SIDEBAR_BG = "white";

export const ClassListSidebar = ({
    schoolYears,
    selectedSchoolYear,
    onSchoolYearChange,
    rooms,
    selectedRoom,
    onRoomChange
}: ClassListSidebarProps) => (
    <Paper elevation={0} sx={{ width: { xs: "100%", md: 260 }, display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden", bgcolor: SIDEBAR_BG, boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.1)", flexShrink: 0 }}>
        <Box sx={{ p: 2, bgcolor: PRIMARY_COLOR, color: "#fff", display: "flex", alignItems: "center", gap: 1, borderBottom: "2px solid white" }}>
            <SchoolIcon fontSize="small" />
            <Typography fontWeight="bold" fontSize="16px">Danh sách lớp</Typography>
        </Box>
        <TextField
            select
            size="small"
            label="📅 Năm học"
            value={selectedSchoolYear}
            onChange={(e) => onSchoolYearChange(e.target.value)}
            sx={{ m: 2 }}
        >
            {schoolYears.map((year) => (
                <MenuItem key={year} value={year}>
                    {year}
                </MenuItem>
            ))}
        </TextField>
        <List disablePadding sx={{ flexGrow: 1, overflowY: "auto", p: 1, "& .MuiListItemButton-root": { borderRadius: 2, pl: 2, pr: 1, fontWeight: 500, color: "#333", "&:hover": { backgroundColor: "#e6f7ff" } }, "& .Mui-selected": { backgroundColor: "#cdeeff", color: PRIMARY_DARK, borderLeft: `5px solid ${PRIMARY_COLOR}` } }}>
            {rooms.map((room) => (
                <ListItemButton key={room} selected={room === selectedRoom} onClick={() => onRoomChange(room)}>
                    <ListItemText primary={room} />
                </ListItemButton>
            ))}
        </List>
    </Paper>
);
