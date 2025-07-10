import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
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
    if (window.confirm("Bạn có chắc muốn xoá?")) {
      try {
        await deleteParent(id);
        toast.success("Đã xoá thành công");
        fetchData();
      } catch {
        toast.error("Lỗi khi xoá");
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
      flex: 0.8,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "Active" : "Inactive"}
        </Typography>
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
    <Box p={3} bgcolor="#fefefe">
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

      <Paper
        sx={{
          height: 550,
          borderRadius: 2,
          p: 2,
          mt: 2,
          border: "1px solid #ddd",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
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
        />
      </Paper>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
