import React from "react";
import {
    Box,
    Typography,
    Modal,
    TextField,
    InputAdornment,
    Button,
    Paper,
    Divider,
    Alert,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";

type Teacher = {
    id: string;
    name: string;
    phone: string;
};

type TeacherSelectionModalProps = {
    open: boolean;
    onClose: () => void;
    availableTeachers: Teacher[];
    selectedTeachers: Teacher[];
    onSelectTeacher: (teacher: Teacher) => void;
    onRemoveTeacher: (id: string) => void;
    onConfirm: () => void;
    alertTooMany: boolean;
    teacherSearch: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TeacherSelectionModal({
    open,
    onClose,
    availableTeachers,
    selectedTeachers,
    onSelectTeacher,
    onRemoveTeacher,
    onConfirm,
    alertTooMany,
    teacherSearch,
    onSearchChange,
}: TeacherSelectionModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 480,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Danh sách giáo viên chưa có lớp
                </Typography>

                <TextField
                    fullWidth
                    size="small"
                    label="Tìm giáo viên"
                    value={teacherSearch}
                    onChange={onSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                {selectedTeachers.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography fontWeight="bold" mb={1}>
                            Đã chọn:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {selectedTeachers.map((t) => (
                                <Paper
                                    key={t.id}
                                    elevation={1}
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        display: "flex",
                                        alignItems: "center",
                                        borderRadius: 4,
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        👩‍🏫 {t.name}
                                    </Typography>
                                    <IconButton
                                        onClick={() => onRemoveTeacher(t.id)}
                                        size="small"
                                        color="error"
                                        sx={{ p: 0.5 }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                )}

                {alertTooMany && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Bạn chỉ được chọn tối đa 2 giáo viên.
                    </Alert>
                )}

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {availableTeachers
                        .filter((t) => {
                            const name = t?.name?.toLowerCase?.() || "";
                            const search = teacherSearch?.toLowerCase?.() || "";
                            return name.includes(search);
                        })
                        .map((teacher) => (
                            <Paper
                                key={teacher.id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography fontWeight="bold">{teacher.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        📞 {teacher.phone}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => onSelectTeacher(teacher)}
                                    sx={{
                                        backgroundColor: PRIMARY_COLOR,
                                        "&:hover": { backgroundColor: PRIMARY_DARK },
                                    }}
                                >
                                    Chọn
                                </Button>
                            </Paper>
                        ))}
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    disabled={selectedTeachers.length === 0}
                    onClick={onConfirm}
                    sx={{
                        mt: 2,
                        backgroundColor: PRIMARY_COLOR,
                        "&:hover": { backgroundColor: PRIMARY_DARK },
                    }}
                >
                    Xác nhận
                </Button>
            </Box>
        </Modal>
    );
}
