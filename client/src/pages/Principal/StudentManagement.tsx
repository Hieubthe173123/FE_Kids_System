import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, IconButton, Tooltip,
  Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, MenuItem
} from "@mui/material";
import {
  DataGrid, GridFooterContainer, GridPagination
} from "@mui/x-data-grid";
import { Add, Edit, Delete, Refresh, Search } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/ApiServices";

type Student = {
  _id: string;
  studentCode: string;
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  age: number;
  status: boolean;
  image?: string;
  note?: string;
};

function CustomFooter({ count }: { count: number }) {
  return (
    <GridFooterContainer sx={{ px: 2, py: 1, backgroundColor: "#f9f9f9" }}>
      <Typography fontSize={14} color="#666">
        Tổng cộng <strong>{count}</strong> học sinh
      </Typography>
      <GridPagination />
    </GridFooterContainer>
  );
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, "_id">>({
    studentCode: "",
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    age: 0,
    status: true,
    image: "",
    note: "",
  });

  const fetchData = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch {
      toast.error("Lỗi khi tải danh sách học sinh");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, form);
        toast.success("Cập nhật thành công");
      } else {
        await createStudent(form);
        toast.success("Tạo mới học sinh thành công");
      }

      setForm({
        studentCode: "",
        fullName: "",
        dob: "",
        gender: "",
        address: "",
        age: 0,
        status: true,
        image: "",
        note: "",
      });
      setEditingStudent(null);
      setOpenDialog(false);
      fetchData();
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xoá?")) {
      try {
        await deleteStudent(id);
        toast.success("Xoá học sinh thành công");
        fetchData();
      } catch {
        toast.error("Lỗi khi xoá học sinh");
      }
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: "studentCode", headerName: "Mã HS", flex: 1 },
    { field: "fullName", headerName: "Họ tên", flex: 1.5 },
    {
      field: "dob",
      headerName: "Ngày sinh",
      flex: 1,
      renderCell: (params: any) => new Date(params.value).toLocaleDateString(),
    },
    { field: "age", headerName: "Tuổi", flex: 0.5 },
    {
      field: "gender",
      headerName: "Giới tính",
      flex: 1,
      renderCell: (params: any) =>
        params.value === "male" ? "Nam" : params.value === "female" ? "Nữ" : "Khác",
    },
    { field: "address", headerName: "Địa chỉ", flex: 2 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      renderCell: (params: any) => (
        <>
          <Tooltip title="Sửa">
            <IconButton
              color="primary"
              onClick={() => {
                setEditingStudent(params.row);
                setForm(params.row);
                setOpenDialog(true);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá">
            <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold" color="#4194cb">
          Quản lý học sinh
        </Typography>
        <Box>
          <Tooltip title="Tải lại">
            <IconButton onClick={fetchData}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thêm học sinh mới">
            <IconButton
              onClick={() => {
                setEditingStudent(null);
                setForm({
                  studentCode: "",
                  fullName: "",
                  dob: "",
                  gender: "",
                  address: "",
                  age: 0,
                  status: true,
                  image: "",
                  note: "",
                });
                setOpenDialog(true);
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box my={2}>
        <TextField
          placeholder="Tìm kiếm theo tên hoặc mã học sinh"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
        />
      </Box>

      <Paper sx={{ height: 550, p: 2 }}>
        <DataGrid
          rows={filteredStudents.map((s) => ({ ...s, id: s._id }))}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50]}
          slots={{ footer: () => <CustomFooter count={filteredStudents.length} /> }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingStudent ? "Cập nhật học sinh" : "Thêm học sinh mới"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid {...({} as any)} item xs={12}>
              <TextField
                label="Mã học sinh"
                value={form.studentCode}
                onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid {...({} as any)} item xs={12}>
              <TextField
                label="Họ tên"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid {...({} as any)} item xs={6}>
              <TextField
                label="Ngày sinh"
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid {...({} as any)} item xs={6}>
              <TextField
                label="Tuổi"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
                fullWidth
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
                <MenuItem value="other">Khác</MenuItem>
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
                label="Ghi chú"
                fullWidth
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
