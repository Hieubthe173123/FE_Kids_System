import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid, // ✅ layout Grid từ MUI
  MenuItem,
} from "@mui/material";

import {
  DataGrid as MuiDataGrid, // ✅ Đổi tên để không bị trùng
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Person,
  Email,
  Phone,
  Badge,
  Home,
  Cake,
  Wc,
  AccountBox,
} from "@mui/icons-material"
import {
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  getAccountParentUnused,
  getAllStudentNoParent,
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
  student?: [];
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [studentList, setStudentList] = useState<
    { _id: string; fullName: string }[]
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [form, setForm] = useState<Omit<Parent, "_id"> & { account?: string }>({
    fullName: "",
    dob: "",
    phoneNumber: "",
    email: "",
    IDCard: "",
    gender: "",
    address: "",
    status: true,
    account: "",
    student: []
  });
  console.log("form: ", form);

  const [accountList, setAccountList] = useState<
    { _id: string; username: string }[]
  >([]);

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
    getAccountParentUnused()
      .then((res) => setAccountList(res.data))
      .catch(() => toast.error("Lỗi khi tải tài khoản chưa sử dụng"));

    getAllStudentNoParent()
      .then((res) => setStudentList(res))
      .catch(() => toast.error("Lỗi khi tải danh sách học sinh chưa có phụ huynh"));
  }, []);


  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        student: selectedStudents,
      };

      if (editingParent) {
        await updateParent(editingParent._id, payload);
        toast.success("Cập nhật thành công");
      } else {
        await createParent(payload);
        toast.success("Thêm mới thành công");
      }

      // ✅ Reset form state sau khi lưu
      setForm({
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
      setSelectedStudents([]);
      setEditingParent(null);
      setOpenDialog(false);

      // ✅ Refresh data
      fetchData();
      getAccountParentUnused()
        .then((res) => setAccountList(res.data))
        .catch(() => toast.error("Lỗi khi tải lại tài khoản chưa dùng"));

      getAllStudentNoParent()
        .then((res) => setStudentList(res))
        .catch(() => toast.error("Lỗi khi tải danh sách học sinh chưa có phụ huynh"));

    } catch (err) {
      toast.error("Có lỗi xảy ra");
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
      field: "actions",
      headerName: "Hành động",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Sửa">
            <IconButton
              color="primary"
              onClick={() => {
                setEditingParent(params.row);
                setForm(params.row);
                setSelectedStudents(
                  params.row.student?.map((s: any) => s._id) || []
                );
                setOpenDialog(true);
              }}
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
          <Tooltip title="Thêm phụ huynh mới" >
            <IconButton
              onClick={async () => {
                setEditingParent(null);
                setForm({
                  fullName: "",
                  dob: "",
                  phoneNumber: "",
                  email: "",
                  IDCard: "",
                  gender: "",
                  address: "",
                  status: true,
                  account: "",
                });
                setOpenDialog(true);
                setSelectedStudents([]); // ✅ thêm dòng này
              }}
            >
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
          slots={{ footer: () => <CustomFooter count={filteredParents.length} /> }}
        />
      </Paper>

      ;

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "#f4fbff",
            borderRadius: "20px",
            border: "3px solid #4194cb",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "24px",
            color: "#3982b8",
            fontFamily: "Comic Sans MS",
          }}
        >
          {editingParent ? "Cập nhật thông tin phụ huynh" : "Thêm phụ huynh mới"}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            ❌
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} {...({} as any)}>
              <TextField
                label="Họ tên"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Person sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <TextField
                label="Ngày sinh"
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <Cake sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <TextField
                label="Số điện thoại"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Phone sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <TextField
                label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Email sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <TextField
                label="CMND/CCCD"
                value={form.IDCard}
                onChange={(e) => setForm({ ...form, IDCard: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Badge sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} {...({} as any)}>
              <TextField
                label="Giới tính"
                select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Wc sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              >
                <MenuItem value="male">Nam 👦</MenuItem>
                <MenuItem value="female">Nữ 👧</MenuItem>
                <MenuItem value="other">Khác 🌈</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} {...({} as any)}>
              <TextField
                label="Tài khoản"
                select
                value={form.account || "11111111"}
                onChange={(e) => setForm({ ...form, account: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <AccountBox sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              >
                {accountList.map((acc) => (
                  <MenuItem key={acc._id} value={acc._id}>
                    {acc.username}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} {...({} as any)}>
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
                InputProps={{
                  startAdornment: <Person sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              >
                {studentList.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.fullName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} {...({} as any)}>
              <TextField
                label="Địa chỉ"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                fullWidth
                multiline
                rows={2}
                InputProps={{
                  startAdornment: <Home sx={{ color: "#4194cb", mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", pr: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              backgroundColor: "#e6687a",
              color: "white",
              borderRadius: "30px",
              fontWeight: "bold",
              px: 4,
              py: 1,
              "&:hover": {
                backgroundColor: "rgb(230,104,122)",
              },
            }}
          >
            ❌ Hủy
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              backgroundColor: "#4194cb",
              color: "white",
              borderRadius: "30px",
              fontWeight: "bold",
              px: 4,
              py: 1,
              ml: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#3982b8",
              },
            }}
          >
            💾 Lưu
          </Button>
        </DialogActions>
      </Dialog>


      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}
