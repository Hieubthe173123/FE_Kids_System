import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import {
  // getAllStudentNoParent,
  getParentById,
  createParent,
  updateParent,
  // getAccountParentUnused,
} from "../../services/PrincipalApi";
import { toast, ToastContainer } from "react-toastify";

export default function ParentFormPage() {
  const { id } = useParams();
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
    // account: [],
    student: [],
  });
  // type Student = {
  //   _id: string;
  //   fullName: string;
  // };
  // const [accountList, setAccountList] = useState([]);
  // const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      getParentById(id).then((res) => {
        setForm(res.data);
        setSelectedStudents(res.data.student?.map((s: any) => s._id) || []);
      });
    }

    // getAccountParentUnused()
    //   .then((res) => setAccountList(res.data))
    //   .catch(() => toast.error("Lỗi tải tài khoản"));

    // getAllStudentNoParent()
    //   .then((res) => setStudentList(res))
    //   .catch(() => toast.error("Lỗi tải học sinh"));
  }, [id]);

  const handleSave = async () => {
    console.log("form", form);
    
    if (!form.fullName || !form.dob || !form.phoneNumber || !form.email || !form.IDCard || !form.gender || !form.address) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phoneNumber)) {
      toast.info("Số điện thoại không hợp lệ. Chỉ nhập số, 10 số bắt đầu bằng 0.");
      return;
    }
    if (form.IDCard.length < 12) {
      toast.info("CCCD phải tối thiểu 12 số.");
      return;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(form.email)) {
      toast.info("Email không hợp lệ. Vui lòng nhập đúng định dạng email.");
      return;
    }

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
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {/* Cột trái */}
          <Box flex={1}>
            <TextField id="standard-basic" label="Họ tên" variant="standard" fullWidth value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <TextField id="standard-dob" label="Ngày sinh" type="date" variant="standard" fullWidth InputLabelProps={{ shrink: true }} value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} sx={{ mt: 2 }} />
            <TextField id="standard-phone" label="Số điện thoại" type="number" variant="standard" fullWidth value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value.replace(/[^0-9]/g, "") })} sx={{ mt: 2 }} />
            <TextField id="standard-email" label="Email" variant="standard" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ mt: 2 }} />
            <TextField id="standard-idcard" label="CCCD" type="number" variant="standard" fullWidth value={form.IDCard} onChange={(e) => setForm({ ...form, IDCard: e.target.value.replace(/[^0-9]/g, "") })} sx={{ mt: 2 }} />
          </Box>
          {/* Cột phải */}
          <Box flex={1}>
            <TextField id="standard-gender" label="Giới tính" select variant="standard" fullWidth value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
            </TextField>
            <TextField id="standard-address" label="Địa chỉ" variant="standard" fullWidth value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} sx={{ mt: 2 }} />
            {/* <TextField id="standard-account" label="Tài khoản" select variant="standard" fullWidth value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} sx={{ mt: 2 }}>
              {accountList.map((acc: any) => (
                <MenuItem key={acc._id} value={acc._id}>
                  {acc.username}
                </MenuItem>
              ))}
            </TextField>
            <TextField id="standard-student" label="Thêm học sinh" select variant="standard" fullWidth SelectProps={{ multiple: true }} value={selectedStudents} onChange={(e) => setSelectedStudents(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value)} sx={{ mt: 2 }}>
              {studentList.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.fullName}
                </MenuItem>
              ))}
            </TextField> */}
          </Box>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/principal-home/parent-management")}>Quay lại</Button>
          <Button variant="contained" onClick={handleSave}>Lưu</Button>
        </Box>
      </Paper>
      <ToastContainer />
    </Box>
  );
}
