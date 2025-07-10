import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import {
  getAllStudentNoParent,
  getParentById,
  createParent,
  updateParent,
  getAccountParentUnused,
} from "../../services/ApiServices";
import { toast, ToastContainer } from "react-toastify";

export default function ParentFormPage() {
  const { id } = useParams(); // nếu có thì là sửa
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    phoneNumber: "",
    email: "",
    IDCard: "",
    gender: "",
    address: "",
    status: true,
    account: "",
    student: [],
  });
  type Student = {
    _id: string;
    fullName: string;
  };
  const [accountList, setAccountList] = useState([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      getParentById(id).then((res) => {
        setForm(res.data);
        setSelectedStudents(res.data.student?.map((s: any) => s._id) || []);
      });
    }

    getAccountParentUnused()
      .then((res) => setAccountList(res.data))
      .catch(() => toast.error("Lỗi tải tài khoản"));

    getAllStudentNoParent()
      .then((res) => setStudentList(res))
      .catch(() => toast.error("Lỗi tải học sinh"));
  }, [id]);

  const handleSave = async () => {
    try {
      const payload = { ...form, student: selectedStudents };

      if (id) {
        await updateParent(id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await createParent(payload);
        toast.success("Thêm mới thành công");
      }

      setTimeout(() => navigate("/principal-home/parent-management"), 1500);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        {id ? "Cập nhật phụ huynh" : "Thêm phụ huynh mới"}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid {...({} as any)} container spacing={2} direction="column">
          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Họ tên"
              fullWidth
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Ngày sinh"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Số điện thoại"
              fullWidth
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="CMND"
              fullWidth
              value={form.IDCard}
              onChange={(e) => setForm({ ...form, IDCard: e.target.value })}
            />
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Giới tính"
              select
              fullWidth
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
            </TextField>
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Địa chỉ"
              fullWidth
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Tài khoản"
              select
              fullWidth
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
            >
              {accountList.map((acc: any) => (
                <MenuItem key={acc._id} value={acc._id}>
                  {acc.username}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid {...({} as any)} item xs={12}>
            <TextField
              label="Thêm học sinh"
              select
              fullWidth
              SelectProps={{ multiple: true }}
              value={selectedStudents}
              onChange={(e) =>
                setSelectedStudents(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value
                )
              }
            >
              {studentList.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.fullName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>



        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => navigate("/parents")}
          >
            Quay lại
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </Box>
      </Paper>
      <ToastContainer />
    </Box>
  );
}
