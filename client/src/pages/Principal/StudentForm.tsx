import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper,
    Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import {
    getStudentById,
    createStudent,
    updateStudent,
} from "../../services/ApiServices";

const defaultForm = {
    studentCode: "",
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    age: 0,
    status: true,
    image: "",
    note: "",
};

export default function StudentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        if (id) {
            getStudentById(id).then((res: any) => {
                const student = res.data;
                if (student.dob) {
                    student.dob = student.dob.substring(0, 10);
                }
                setForm(student);
            });
        }
    }, [id]);

    const handleSave = async () => {
        try {
            if (id) {
                await updateStudent(id, form);
                toast.success("Cập nhật thành công");
            } else {
                await createStudent(form);
                toast.success("Tạo mới thành công");
            }
            navigate("/principal-home/students-management");
        } catch {
            toast.error("Lỗi khi lưu học sinh");
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                maxWidth: 600,
                mx: "auto",
                mt: 4,
                backgroundColor: "#fefefe",
                borderRadius: 2,
            }}
        >
            <Typography variant="h6" mb={3} textAlign="center">
                {id ? "Cập nhật học sinh" : "Thêm học sinh mới"}
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Mã học sinh"
                    value={form.studentCode}
                    onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                    fullWidth
                />

                <TextField
                    label="Họ tên"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    fullWidth
                />

                <TextField
                    label="Ngày sinh"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    fullWidth
                />

                <TextField
                    label="Tuổi"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
                    fullWidth
                />

                <TextField
                    label="Giới tính"
                    select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    fullWidth
                >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                </TextField>

                <TextField
                    label="Địa chỉ"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    fullWidth
                />

                <TextField
                    label="Ghi chú"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    fullWidth
                />

                <Button
                    variant="contained"
                    sx={{ mt: 2, alignSelf: "center", px: 5 }}
                    onClick={handleSave}
                >
                    {id ? "Cập nhật" : "Lưu"}
                </Button>
            </Stack>
        </Paper>
    );
}
