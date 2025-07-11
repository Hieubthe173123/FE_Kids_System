import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Paper,
  Box as MuiBox,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import {
  DataGrid as MuiDataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  getAllParents,
  deleteParent,
} from "../../services/ApiServices";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Parent = {
  _id: string;
  fullName: string;
  dob: string;
  phoneNumber: string;
  email: string;
  IDCard: string;
  gender: string;
  address: string;
  status: boolean;
  account?: string;
  student?: any[];
};

function CustomFooter({ count }: { count: number }) {
  return (
    <GridFooterContainer sx={{ px: 2, py: 1, backgroundColor: "#f9f9f9" }}>
      <Typography fontSize={14} color="#666">
        Tổng cộng <strong>{count}</strong> phụ huynh
      </Typography>
      <GridPagination />
    </GridFooterContainer>
  );
}

export default function ParentManagement() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getAllParents();
      setParents(res.data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách phụ huynh");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xoá phụ huynh này?",
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
        await deleteParent(id);
        toast.success("Đã xoá phụ huynh thành công.");
        fetchData();
      } catch {
        toast.error("Xoá phụ huynh thất bại. Vui lòng thử lại.");
      }
    }
  };

  const mapGender = (value: string) => {
    switch (value) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const filteredParents = parents.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phoneNumber.toString().includes(search)
  );

  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Họ tên", flex: 1.2 },
    {
      field: "dob",
      headerName: "Ngày sinh",
      flex: 1,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "phoneNumber",
      headerName: "SĐT",
      flex: 1,
      renderCell: (params) => {
        const phone = params.value.toString();
        return phone.startsWith("0") ? phone : `0${phone}`;
      },
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "IDCard", headerName: "CMND", flex: 1 },
    {
      field: "gender",
      headerName: "Giới tính",
      flex: 0.8,
      renderCell: (params) => mapGender(params.value),
    },
    { field: "address", headerName: "Địa chỉ", flex: 1.5 },
    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 110,
      flex: 0.7,
      renderCell: (params) => (
        params.value ? (
          <MuiBox display="flex" alignItems="center" sx={{
            color: '#16a34a',
            fontWeight: 600,
            fontSize: 13,
            minWidth: 90,
            justifyContent: 'center',
            gap: 0.5
          }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a', mr: 0.5 }} />
            Hoạt động
          </MuiBox>
        ) : (
          <MuiBox display="flex" alignItems="center" sx={{
            color: '#64748b',
            fontWeight: 600,
            fontSize: 13,
            minWidth: 110,
            justifyContent: 'center',
            gap: 0.5
          }}>
            <BlockIcon sx={{ fontSize: 18, color: '#64748b', mr: 0.5 }} />
            Không hoạt động
          </MuiBox>
        )
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa">
            <IconButton
              color="primary"
              onClick={() => navigate(`/principal-home/parent-edit/${params.row._id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box p={3} bgcolor="#fefefe" sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#46a2da" }}>
          Quản lý phụ huynh
        </Typography>
        <Box>
          <Tooltip title="Tải lại">
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thêm phụ huynh mới">
            <IconButton onClick={() => navigate("/principal-home/parent-create")}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box my={2}>
        <TextField
          placeholder="Tìm kiếm theo tên hoặc SĐT"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon style={{ marginRight: 8 }} />,
          }}
          fullWidth
        />
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
        <Paper
          sx={{
            height: 460,
            borderRadius: 2,
            p: 2,
            border: "1px solid #ddd",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            width: '100%',
            minWidth: 0,
            overflowX: 'auto',
            transition: 'width 0.2s',
          }}
        >
          <MuiDataGrid
            rows={filteredParents.map((p) => ({ ...p, id: p._id }))}
            columns={columns}
            pagination
            pageSizeOptions={[10, 20, 50]}
            slots={{
              footer: () => <CustomFooter count={filteredParents.length} />,
            }}
            sx={{ width: '100%', minWidth: 0 }}
            autoHeight={false}
          />
        </Paper>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
