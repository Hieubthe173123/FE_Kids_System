import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Alert,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import CreateIcon from "@mui/icons-material/Create";
import dayjs from "dayjs";

const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";
const BACKGROUND_COLOR = "#fefefe";
const SIDEBAR_BG = "white";

const mockClassData = [
    {
        id: "c1",
        room: "Lớp Mầm 1",
        teacher: { name: "Cô Hạnh" },
        student: {
            studentId: 1,
            name: "Nguyễn Hoàng Nam",
            dob: "2023-10-09",
        },
    },
    {
        id: "c2",
        room: "Lớp Lá 2",
        teacher: { name: "Cô Lan" },
        student: {
            studentId: 2,
            name: "Vũ Phương Linh",
            dob: "2022-09-01",
        },
    },
];

function calculateAge(dob: string) {
    const now = dayjs();
    const birth = dayjs(dob);
    const age = now.diff(birth, "year");
    return `${age} tuổi`;
}

export default function ClassManagementPage() {
    const rooms = [...new Set(mockClassData.map((c) => c.room))];
    const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
    const [search, setSearch] = useState("");
    const [ageFilter, setAgeFilter] = useState("");
    const navigate = useNavigate();

    const handleNavigateToCreateClass = () => {
        navigate("/principal-home/create-class");
    }

    const filteredStudents = mockClassData
        .filter((c) => c.room === selectedRoom)
        .filter(
            (c) =>
                c.student.name.toLowerCase().includes(search.toLowerCase()) ||
                c.student.studentId.toString().includes(search)
        )
        .filter((c) =>
            ageFilter ? calculateAge(c.student.dob) === ageFilter : true
        )
        .map((c, index) => ({
            id: index + 1,
            studentId: c.student.studentId,
            studentName: c.student.name,
            dob: c.student.dob,
            age: calculateAge(c.student.dob),
            room: c.room,
            lecturer: c.teacher.name,
        }));

    const columns = [
        { field: "id", headerName: "STT", width: 70 },
        { field: "studentId", headerName: "Mã HS", width: 100 },
        { field: "studentName", headerName: "Tên học sinh", flex: 1 },
        { field: "dob", headerName: "Ngày sinh", width: 130 },
        { field: "age", headerName: "Tuổi", width: 80 },
        { field: "room", headerName: "Lớp", width: 130 },
        { field: "lecturer", headerName: "Giáo viên", width: 160 },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                height: "90vh",
                bgcolor: BACKGROUND_COLOR,
                overflow: "hidden",
                p: 2,
                gap: 3,
                boxSizing: "border-box",
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            {/* 🌈 Sidebar */}
            <Paper
                elevation={0}
                sx={{
                    width: { xs: "100%", md: 260 },
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: SIDEBAR_BG,
                    boxShadow: "0px 2px 16px rgba(0, 0, 0, 0.1)",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        bgcolor: PRIMARY_COLOR,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderBottom: "2px solid white",
                    }}
                >
                    <SchoolIcon fontSize="small" />
                    <Typography fontWeight="bold" fontSize="16px">
                        Danh sách lớp
                    </Typography>
                </Box>

                <List
                    disablePadding
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        p: 1,
                        "& .MuiListItemButton-root": {
                            borderRadius: 2,
                            pl: 2,
                            pr: 1,
                            fontWeight: 500,
                            color: "#333",
                            "&:hover": {
                                backgroundColor: "#e6f7ff",
                            },
                        },
                        "& .Mui-selected": {
                            backgroundColor: "#cdeeff",
                            color: PRIMARY_DARK,
                            borderLeft: `5px solid ${PRIMARY_COLOR}`,
                        },
                    }}
                >
                    {rooms.map((room) => (
                        <ListItemButton
                            key={room}
                            selected={room === selectedRoom}
                            onClick={() => setSelectedRoom(room)}
                        >
                            <ListItemText primary={room} />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>

            {/* 📋 Main content */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#f9fbfd",
                        borderRadius: 3,
                        p: 3,
                        boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
                        overflow: "auto",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: "bold",
                            color: PRIMARY_DARK,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <GroupsIcon /> Học sinh của {selectedRoom}
                    </Typography>

                    {/* 🔍 Filter + Button tạo lớp */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                            justifyContent: "space-between",
                            gap: 2,
                            mb: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Filter search + age */}
                        <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
                            <TextField
                                variant="outlined"
                                label="🔍 Tìm học sinh"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                size="small"
                                sx={{ minWidth: 220 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                select
                                label="🎂 Độ tuổi"
                                value={ageFilter}
                                onChange={(e) => setAgeFilter(e.target.value)}
                                size="small"
                                sx={{ minWidth: 160 }}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[1, 2, 3, 4, 5].map((age) => (
                                    <MenuItem key={age} value={`${age} tuổi`}>
                                        {age} tuổi
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* Button tạo/chỉnh sửa lớp */}
                        <Button
                            variant="contained"
                            startIcon={<CreateIcon />}
                            sx={{
                                whiteSpace: "nowrap",
                                minWidth: 180,
                                backgroundColor: "#e6687a",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#d75c6e",
                                },
                            }}
                            onClick={handleNavigateToCreateClass}
                        >
                            Tạo / Chỉnh sửa lớp
                        </Button>
                    </Box>

                    {/* 📊 Data table */}
                    <Paper
                        elevation={2}
                        sx={{
                            height: "65vh",
                            borderRadius: 2,
                            overflow: "hidden",
                        }}
                    >
                        {filteredStudents.length > 0 ? (
                            <DataGrid
                                rows={filteredStudents}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                disableSelectionOnClick
                                sx={{
                                    backgroundColor: "#fff",
                                    border: "none",
                                    fontFamily: `"Comic Neue", "Roboto", sans-serif`,
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: "#d5f0ff",
                                        color: "#333",
                                        fontWeight: 700,
                                        fontSize: 15,
                                    },
                                    "& .MuiDataGrid-cell": {
                                        color: "#333",
                                        fontSize: 14,
                                        padding: "12px 8px",
                                    },
                                    "& .MuiDataGrid-row:hover": {
                                        backgroundColor: "#f0f9ff",
                                    },
                                    "& .MuiDataGrid-footerContainer": {
                                        backgroundColor: "#f9f9f9",
                                    },
                                }}
                            />
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Không tìm thấy học sinh nào phù hợp.
                            </Alert>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
