import React, { useMemo } from "react";
import {
    Box,
    Typography,
    Modal,
    TextField,
    InputAdornment,
    Button,
    Divider,
    Alert,
    IconButton,
    Stack,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Fade,
    Collapse
} from "@mui/material";
import {
    Search as SearchIcon,
    Close as CloseIcon,
    GroupAdd as GroupAddIcon
} from "@mui/icons-material";

const WEB_TONE_COLOR = "#4194cb";
const ACCENT_COLOR = "#e6687a";
const ACCENT_DARK_COLOR = "#d75c6e";

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

    const filteredAvailableTeachers = useMemo(() => {
        if (!teacherSearch) {
            return availableTeachers;
        }
        return availableTeachers.filter(t =>
            t.name.toLowerCase().includes(teacherSearch.toLowerCase())
        );
    }, [availableTeachers, teacherSearch]);

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
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
                        outline: 'none',
                    }}
                >
                    <Stack sx={{ p: 3 }} spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <GroupAddIcon sx={{ fontSize: '2.5rem', color: WEB_TONE_COLOR }} />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Chọn giáo viên phụ trách
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Mỗi lớp có thể có tối đa 2 giáo viên
                                    </Typography>
                                </Box>
                            </Stack>
                            <IconButton onClick={onClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider />

                        <Box>
                            {selectedTeachers.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                                        Đã chọn ({selectedTeachers.length}/2)
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {selectedTeachers.map((t) => (
                                            <Chip
                                                key={t.id}
                                                avatar={<Avatar sx={{ bgcolor: WEB_TONE_COLOR }}>{t.name.charAt(0)}</Avatar>}
                                                label={t.name}
                                                onDelete={() => onRemoveTeacher(t.id)}
                                                sx={{
                                                    bgcolor: '#e3f2fd',
                                                    color: '#1565c0',
                                                    fontWeight: 500,
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#1976d2',
                                                        '&:hover': {
                                                            color: '#1565c0'
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Tìm giáo viên theo tên..."
                                value={teacherSearch}
                                onChange={onSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Collapse in={alertTooMany}>
                            <Alert severity="warning" onClose={() => { }}>
                                Bạn chỉ được chọn tối đa 2 giáo viên.
                            </Alert>
                        </Collapse>

                        <Box sx={{ height: 250, overflowY: "auto", pr: 1 }}>
                            <List disablePadding>
                                {filteredAvailableTeachers.map((teacher) => (
                                    <ListItem
                                        key={teacher.id}
                                        secondaryAction={
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => onSelectTeacher(teacher)}
                                                disabled={selectedTeachers.length >= 2}
                                                sx={{
                                                    backgroundColor: ACCENT_COLOR,
                                                    "&:hover": { backgroundColor: ACCENT_DARK_COLOR }
                                                }}
                                            >
                                                Chọn
                                            </Button>
                                        }
                                        sx={{ bgcolor: 'grey.50', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'grey.100' } }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: ACCENT_COLOR, color: '#fff' }}>{teacher.name.charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={teacher.name}
                                            secondary={`SĐT: ${teacher.phone}`}
                                        />
                                    </ListItem>
                                ))}
                                {filteredAvailableTeachers.length === 0 && (
                                    <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                                        Không tìm thấy giáo viên nào.
                                    </Typography>
                                )}
                            </List>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                            <Button variant="outlined" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                disabled={selectedTeachers.length === 0}
                                onClick={onConfirm}
                                sx={{
                                    backgroundColor: WEB_TONE_COLOR,
                                    "&:hover": { backgroundColor: '#3b8ac0' }
                                }}
                            >
                                Xác nhận
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
}