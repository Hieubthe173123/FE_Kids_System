import {
    Paper,
    Box,
    Typography,
    TextField,
    MenuItem,
    List,
    ListItemButton,
    ListItemText,
    Button,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

type ClassListSidebarProps = {
    schoolYears: string[];
    selectedSchoolYear: string;
    onSchoolYearChange: (year: string) => void;
    rooms: string[];
    selectedRoom: string;
    onRoomChange: (room: string) => void;
    hasSchedule?: boolean;
    genSchedule?: boolean;
    onSetGenSchedule: (genSchedule: boolean) => void;
};

const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";
const SIDEBAR_BG = "white";

export const ScheduleListClassSidebar = ({
    schoolYears,
    selectedSchoolYear,
    onSchoolYearChange,
    rooms,
    selectedRoom,
    onRoomChange,
    hasSchedule,
    genSchedule,
    onSetGenSchedule,
}: ClassListSidebarProps) => (
    <Paper
        elevation={0}
        sx={{
            width: { xs: "100%", md: 280 },
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: SIDEBAR_BG,
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.10)",
            flexShrink: 0,
            minHeight: 400,
        }}
    >
        <Box
            sx={{
                p: 2.5,
                bgcolor: PRIMARY_COLOR,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderBottom: "2px solid #fff",
                boxShadow: "0 2px 8px 0 rgba(65,148,203,0.08)",
            }}
        >
            <SchoolIcon fontSize="medium" sx={{ mr: 1 }} />
            <Typography fontWeight="bold" fontSize="18px" letterSpacing={0.5}>
                Danh sách lớp học
            </Typography>
        </Box>
        <TextField
            select
            size="small"
            label="Năm học"
            value={selectedSchoolYear}
            onChange={(e) => onSchoolYearChange(e.target.value)}
            sx={{ m: 2, borderRadius: 2, bgcolor: "#f6faff" }}
            InputProps={{
                startAdornment: (
                    <CalendarMonthIcon sx={{ color: PRIMARY_COLOR, mr: 1 }} />
                ),
            }}
        >
            {schoolYears.map((year) => (
                <MenuItem key={year} value={year}>
                    {year}
                </MenuItem>
            ))}
        </TextField>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            {hasSchedule ? (
                <Box
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        bgcolor: '#e0f7fa',
                        color: '#00796b',
                        textAlign: 'center',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px 0 rgba(0,121,107,0.08)',
                        fontSize: 15,
                        width: '90%',
                        mb: 1.5,
                    }}
                >
                    Lịch học đã được phân công cho năm học này.
                </Box>
            ) : (
                <Button
                    variant="contained"
                    disabled={genSchedule || hasSchedule}
                    sx={{
                        bgcolor: PRIMARY_COLOR,
                        borderRadius: 2,
                        fontWeight: 700,
                        color: '#fff',
                        fontSize: 16,
                        px: 3,
                        py: 1.2,
                        boxShadow: '0 2px 8px 0 rgba(65,148,203,0.10)',
                        width: '90%',
                        mb: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: PRIMARY_DARK },
                    }}
                    onClick={() => {
                        onSetGenSchedule(true);
                    }}
                >
                    Tạo lịch học
                </Button>
            )}
        </Box>
        <Box sx={{ flexGrow: 1, px: 1.5, pb: 2, pt: 0 }}>
            <List
                disablePadding
                sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    bgcolor: "transparent",
                    mt: 1,
                    "& .MuiListItemButton-root": {
                        borderRadius: 2,
                        pl: 2,
                        pr: 1,
                        fontWeight: 500,
                        color: "#333",
                        mb: 0.5,
                        transition: "background 0.2s",
                        "&:hover": { backgroundColor: "#e6f7ff" },
                    },
                    "& .Mui-selected": {
                        backgroundColor: "#cdeeff",
                        color: PRIMARY_DARK,
                        borderLeft: `5px solid ${PRIMARY_COLOR}`,
                        fontWeight: 700,
                    },
                }}
            >
                {rooms.length === 0 ? (
                    <Box textAlign="center" py={3} color="#aaa">
                        <Typography fontSize={15}>
                            Không có phòng nào
                        </Typography>
                    </Box>
                ) : (
                    rooms.map((room) => (
                        <ListItemButton
                            key={room}
                            selected={room === selectedRoom}
                            onClick={() => {
                                onRoomChange(room);
                                // console.log(`Selected room: ${room}`);
                            }}
                        >
                            <MeetingRoomIcon
                                sx={{
                                    color:
                                        room === selectedRoom
                                            ? PRIMARY_COLOR
                                            : "#bdbdbd",
                                    fontSize: 20,
                                    mr: 1,
                                }}
                            />
                            <ListItemText
                                primary={room}
                                primaryTypographyProps={{
                                    fontWeight:
                                        room === selectedRoom ? 700 : 500,
                                    fontSize: 15,
                                }}
                            />
                        </ListItemButton>
                    ))
                )}
            </List>
        </Box>
    </Paper>
);
