import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LoadingOverlay from '../../components/LoadingOverlay';
import {
  getParentById,
  createParent,
  updateParent,
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
    student: [],
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getParentById(id).then((res) => {
        setForm(res.data);
        setSelectedStudents(res.data.student?.map((s: any) => s._id) || []);
      });
    }
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
      setLoading(true);
      // Chuyển dob sang ISO string nếu có
      let dobISO = form.dob;
      if (form.dob && /\d{2}\/\d{2}\/\d{4}/.test(form.dob)) {
        const [day, month, year] = form.dob.split('/');
        dobISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      const payload = { ...form, dob: dobISO, student: selectedStudents };
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} position="relative">
      {loading && <LoadingOverlay />}
      <Typography variant="h5" mb={2}>
        {id ? "Cập nhật phụ huynh" : "Thêm phụ huynh mới"}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {/* Cột trái */}
          <Box flex={1}>
            <TextField id="standard-basic" label="Họ tên" variant="standard" fullWidth value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày sinh"
                format="DD/MM/YYYY"
                value={form.dob ? dayjs(form.dob, ["DD/MM/YYYY", "YYYY-MM-DD"]) : null}
                onChange={(date) => {
                  let value = (date && typeof (date as any).format === 'function') ? (date as any).format('DD/MM/YYYY') : '';
                  setForm({ ...form, dob: value });
                }}
                slotProps={{
                  textField: {
                    variant: 'standard',
                    fullWidth: true,
                    InputLabelProps: { shrink: true },
                    sx: { mt: 2 }
                  }
                }}
              />
            </LocalizationProvider>
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
