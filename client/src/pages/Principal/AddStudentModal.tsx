import {
    Box,
    Typography,
    Modal,
    Paper,
    Button,
    Alert
} from "@mui/material";

const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";

type AddStudentModalProps = {
    open: boolean;
    onClose: () => void;
    availableStudents: Array<{
        studentId: string;
        name: string;
        dob: string;
    }>;
    onAddStudent: (student: {
        _id: string;
        studentId: string;
        name: string;
        dob: string;
    }) => void;
    selectedRoom: string;
};

export default function AddStudentModal({
    open,
    onClose,
    availableStudents,
    onAddStudent,
    selectedRoom
}: AddStudentModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 520,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Thêm học sinh vào lớp {selectedRoom}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Danh sách học sinh chưa có lớp.
                </Typography>
                <Box sx={{ maxHeight: 350, overflowY: "auto", p: 0.5 }}>
                    {availableStudents.length > 0 ? (
                        availableStudents.map((student) => (
                            <Paper
                                key={student.studentId}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography fontWeight="bold">{student.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ngày sinh: {student.dob}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        backgroundColor: PRIMARY_COLOR,
                                        "&:hover": { backgroundColor: PRIMARY_DARK },
                                    }}
                                    onClick={() =>
                                        onAddStudent({
                                            _id: student.studentId,
                                            studentId: student.studentId,
                                            name: student.name,
                                            dob: student.dob,
                                        })
                                    }
                                >
                                    Thêm vào lớp
                                </Button>
                            </Paper>
                        ))
                    ) : (
                        <Alert severity="info">
                            Không có học sinh nào chưa được xếp lớp.
                        </Alert>
                    )}
                </Box>
                <Button fullWidth variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
                    Đóng
                </Button>
            </Box>
        </Modal>
    );
}
