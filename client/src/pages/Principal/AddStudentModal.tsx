import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Modal,
    Button,
    Alert,
    Stack,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField,
    InputAdornment,
    Fade
} from "@mui/material";
import {
    Close as CloseIcon,
    PersonAdd as PersonAddIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import dayjs from "dayjs";

const WEB_TONE_COLOR = "#4194cb";
const ACCENT_COLOR = "#e6687a";
const ACCENT_DARK_COLOR = "#d75c6e";

const calculateAge = (dob: string) => {
    if (!dob) return '(N/A)';
    const birthDate = dayjs(dob);
    const age = dayjs().diff(birthDate, "year");
    return `${age} tuổi`;
};

type Student = {
    _id: string;
    studentId: string;
    name: string;
    dob: string;
};

type AddStudentModalProps = {
    open: boolean;
    onClose: () => void;
    availableStudents: Student[];
    onAddStudent: (student: Student) => void;
    selectedRoom: string;
};

export default function AddStudentModal({
    open,
    onClose,
    availableStudents,
    onAddStudent,
    selectedRoom
}: AddStudentModalProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!searchTerm) {
            return availableStudents;
        }
        return availableStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableStudents, searchTerm]);

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Fade in={open}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: '90%', sm: 600 },
                        bgcolor: "background.paper",
                        borderRadius: 4,
                        boxShadow: 24,
                        outline: 'none'
                    }}
                >
                    <Stack sx={{ p: 3 }} spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <PersonAddIcon sx={{ fontSize: '2.5rem', color: WEB_TONE_COLOR }} />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Thêm học sinh vào lớp {selectedRoom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Chọn học sinh từ danh sách chưa được xếp lớp
                                    </Typography>
                                </Box>
                            </Stack>
                            <IconButton onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider />

                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Tìm kiếm học sinh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ maxHeight: 350, overflowY: "auto", pr: 1 }}>
                            {filteredStudents.length > 0 ? (
                                <List disablePadding>
                                    {filteredStudents.map((student) => (
                                        <ListItem
                                            key={student.studentId}
                                            disablePadding
                                            sx={{
                                                bgcolor: 'grey.50',
                                                borderRadius: 2,
                                                mb: 1,
                                                p: 1.5,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemAvatar sx={{ minWidth: 50 }}>
                                                    <Avatar sx={{ bgcolor: WEB_TONE_COLOR }}>
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={student.name}
                                                    secondary={calculateAge(student.dob)}
                                                />
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => onAddStudent(student)}
                                                sx={{
                                                    backgroundColor: ACCENT_COLOR,
                                                    '&:hover': { backgroundColor: ACCENT_DARK_COLOR }
                                                }}
                                            >
                                                Thêm vào lớp
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Không có học sinh nào phù hợp hoặc tất cả đã được xếp lớp.
                                </Alert>
                            )}
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="outlined" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}