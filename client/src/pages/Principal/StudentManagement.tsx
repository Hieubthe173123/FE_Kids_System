import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, IconButton, Tooltip,
  Paper
} from "@mui/material";
import {
  DataGrid, GridFooterContainer, GridPagination
} from "@mui/x-data-grid";
import { Add, Edit, Delete, Refresh, Search } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import {
  getAllStudents,
  deleteStudent,
} from "../../services/ApiServices";
import Swal from "sweetalert2";

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
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch {
      toast.error("Không thể tải danh sách học sinh. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xoá học sinh này?",
      text: "Thao tác này sẽ không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ"
    });
    if (result.isConfirmed) {
      try {
        await deleteStudent(id);
        toast.success("Đã xoá học sinh thành công.");
        fetchData();
      } catch {
        toast.error("Xoá học sinh thất bại. Vui lòng thử lại.");
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
            <IconButton color="primary" onClick={() => navigate(`/principal-home/students-edit/${params.row._id}`)}>
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
            <IconButton onClick={() => navigate("/principal-home/students-create")}>
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

      <Paper sx={{ height: 460, p: 2 }}>
        <DataGrid
          rows={filteredStudents.map((s) => ({ ...s, id: s._id }))}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50]}
          slots={{ footer: () => <CustomFooter count={filteredStudents.length} /> }}
        />
      </Paper>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
