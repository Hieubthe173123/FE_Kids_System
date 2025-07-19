import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Paper,
  Menu,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
} from "@mui/material";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewColumn as ViewColumnIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllTeachers,
  deleteTeacher,
  createTeacher,
  updateTeacher,
  getLocationProvinces,
  getLocationDistrict,
  getLocationWards,
} from "../../services/PrincipalApi";

const PRIMARY_COLOR = "#4194cb";
const BACKGROUND_COLOR = "#fefefe";

function CustomFooter({ count }: { count: number }) {
  return (
    <GridFooterContainer
      sx={{
        px: 2,
        py: 1,
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography fontSize={14} color="#666">
        Đã tìm thấy <strong>{count}</strong> giáo viên
      </Typography>
      <GridPagination />
    </GridFooterContainer>
  );
}

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "fullName",
    "gender",
    "dob",
    "IDCard",
    "phoneNumber",
    "address",
    "actions",
  ]);
  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    email: "",
    IDCard: "",
    address: "",
    street: "",
  });
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await getAllTeachers();
      const data = res.data.map((t: any, index: number) => ({
        ...t,
        id: index + 1,
      }));
      setTeachers(data);
    } catch (err) {
      toast.error("Không thể tải danh sách giáo viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    getLocationProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvince && selectedProvince.id) {
      getLocationDistrict(selectedProvince.id).then(setDistricts);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict && selectedDistrict.id) {
      getLocationWards(selectedDistrict.id).then(setWards);
      setSelectedWard(null);
    } else {
      setWards([]);
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  const handleAdd = () => {
    setEditingTeacherId(null);
    setNewTeacher({
      fullName: "",
      dob: "",
      gender: "",
      phoneNumber: "",
      email: "",
      IDCard: "",
      address: "",
      street: "",
    });
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setOpenAddDialog(true);
  };

const handleEdit = async (row: any) => {
  setEditingTeacherId(row._id);
  let street = "";
  let province = null;
  let district = null;
  let ward = null;
  if (row.address) {
    const parts = row.address.split(",").map((s: string) => s.trim());
    street = parts[0] || "";
    province = provinces.find((p) => parts[3] && p.name === parts[3]);
    setSelectedProvince(province || null);

    if (province) {
      // 1. Load districts theo province
      const districtsData = await getLocationDistrict(province.id);
      setDistricts(districtsData);
      district = districtsData.find((d: any) => parts[2] && d.name === parts[2]);
      setSelectedDistrict(district || null);

      if (district) {
        // 2. Load wards theo district
        const wardsData = await getLocationWards(district.id);
        setWards(wardsData);
        ward = wardsData.find((w: any) => parts[1] && w.name === parts[1]);
        setSelectedWard(ward || null);
      } else {
        setWards([]);
        setSelectedWard(null);
      }
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
    }
  }

  setNewTeacher({
    fullName: row.fullName,
    dob: row.dob,
    gender: row.gender,
    phoneNumber: row.phoneNumber,
    email: row.email,
    IDCard: row.IDCard,
    address: row.address,
    street,
  });
  setOpenAddDialog(true);
};

  const handleDelete = async (row: any) => {
    const result = await Swal.fire({
      title: "Xác nhận xoá?",
      text: `Giáo viên: ${row.fullName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      const res = await deleteTeacher(row._id);
      if (res?.error) {
        const { errorList } = res.error;
        if (errorList?.length)
          errorList.forEach((e: any) => toast.error(e.message));
        else toast.error("Lỗi tại máy chủ. Vui lòng thử lại.");
      } else {
        toast.success("Đã xoá giáo viên.");
        fetchTeachers();
      }
    }
  };

  const handleSubmit = async () => {
    if (!newTeacher.fullName.trim())
      return toast.error("Họ và tên không được để trống");
    if (!newTeacher.street.trim())
      return toast.error("Vui lòng nhập số nhà, tên đường");
    if (!selectedProvince || !selectedDistrict || !selectedWard)
      return toast.error("Vui lòng chọn đầy đủ địa chỉ");

    const address = `${newTeacher.street}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
    const teacherData = {
      ...newTeacher,
      address,
    };

    const action = editingTeacherId ? updateTeacher : createTeacher;
    const res = editingTeacherId
      ? await action(teacherData, editingTeacherId)
      : await action(teacherData);

    if (res.error)
      toast.error(editingTeacherId ? "Cập nhật thất bại" : "Tạo thất bại");
    else {
      toast.success(editingTeacherId ? "Đã cập nhật" : "Đã thêm giáo viên");
      handleCloseDialog();
      fetchTeachers();
    }
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setNewTeacher({
      fullName: "",
      dob: "",
      gender: "",
      phoneNumber: "",
      email: "",
      IDCard: "",
      address: "",
      street: "",
    });
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    setEditingTeacherId(null);
  };

  const allColumns = [
    { field: "fullName", headerName: "Họ và tên", flex: 1.2 },
    {
      field: "dob",
      headerName: "Ngày sinh",
      flex: 1.2,
      renderCell: (params: any) =>
        params.value ? dayjs(params.value).format("DD-MM-YYYY") : "",
    },
    {
      field: "gender",
      headerName: "Giới tính",
      flex: 0.75,
      renderCell: (params: any) =>
        params.value === "male"
          ? "Nam"
          : params.value === "female"
            ? "Nữ"
            : params.value,
    },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "phoneNumber", headerName: "Số điện thoại", flex: 1.2 },
    { field: "IDCard", headerName: "Căn cước công dân", flex: 1.2 },
    { field: "address", headerName: "Địa chỉ", flex: 2.5 },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Sửa">
            <IconButton onClick={() => handleEdit(params.row)}>
              <EditIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xoá">
            <IconButton onClick={() => handleDelete(params.row)}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const filteredData = teachers.filter(
    (item) =>
      (item.fullName?.toLowerCase() ?? "").includes(searchText.toLowerCase()) ||
      item.IDCard?.toString().includes(searchText)
  );

  return (
    <Box sx={{ p: 3, bgcolor: BACKGROUND_COLOR, height: "90vh" }}>
      <Typography variant="h5" fontWeight="bold" color={PRIMARY_COLOR} mb={3}>
        Quản lý giáo viên
      </Typography>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Search + Buttons */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Tìm kiếm giáo viên..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280 }}
        />

        <Box display="flex" gap={1}>
          <Tooltip title="Làm mới">
            <IconButton onClick={fetchTeachers}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thêm giáo viên">
            <IconButton color="primary" onClick={handleAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chọn cột hiển thị">
            <IconButton onClick={(e) => setColumnAnchorEl(e.currentTarget)}>
              <ViewColumnIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      <Paper
        elevation={2}
        sx={{ height: "70vh", borderRadius: 2, overflow: "hidden" }}
      >
        <DataGrid
          rows={filteredData}
          columns={allColumns.filter((col) =>
            visibleColumns.includes(col.field)
          )}
          loading={loading}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          slots={{ footer: () => <CustomFooter count={filteredData.length} /> }}
          sx={{
            backgroundColor: "#fff",
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#d5f0ff",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#f0f9ff" },
          }}
        />
      </Paper>

      {/* Column toggle menu */}
      <Menu
        anchorEl={columnAnchorEl}
        open={Boolean(columnAnchorEl)}
        onClose={() => setColumnAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem disableRipple>
          <Typography fontWeight="bold">Chọn cột hiển thị</Typography>
        </MenuItem>
        <MenuItem disableRipple>
          <FormGroup>
            {allColumns.map((col) => (
              <FormControlLabel
                key={col.field}
                control={
                  <Checkbox
                    checked={visibleColumns.includes(col.field)}
                    onChange={() =>
                      setVisibleColumns((prev) =>
                        prev.includes(col.field)
                          ? prev.filter((f) => f !== col.field)
                          : [...prev, col.field]
                      )
                    }
                  />
                }
                label={col.headerName}
              />
            ))}
          </FormGroup>
        </MenuItem>
        <MenuItem disableRipple>
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={() => setColumnAnchorEl(null)}
          >
            Áp dụng
          </Button>
        </MenuItem>
      </Menu>

      {/* Dialog Add/Edit */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: PRIMARY_COLOR, color: "white" }}>
          {editingTeacherId
            ? "Chỉnh sửa thông tin giáo viên"
            : "Thêm giáo viên mới"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, backgroundColor: "#fdfdfd" }}>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Họ và tên"
              value={newTeacher.fullName}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, fullName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Ngày sinh"
              type="date"
              value={
                newTeacher.dob ? dayjs(newTeacher.dob).format("YYYY-MM-DD") : ""
              }
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, dob: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Giới tính"
              value={newTeacher.gender}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, gender: e.target.value })
              }
              fullWidth
              select
            >
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </TextField>
            <TextField
              label="Số điện thoại"
              value={newTeacher.phoneNumber}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, phoneNumber: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, email: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Căn cước công dân"
              value={newTeacher.IDCard}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, IDCard: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Số nhà, tên đường"
              value={newTeacher.street}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, street: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
              sx={{ gridColumn: "1 / 3" }}
            />

            <Select
              value={selectedProvince?.id || ""}
              onChange={(e) => {
                const province = provinces.find((p) => p.id === e.target.value);
                setSelectedProvince(province || null);
              }}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">
                <em>Chọn tỉnh/thành</em>
              </MenuItem>
              {provinces.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedDistrict?.id || ""}
              onChange={(e) => {
                const district = districts.find((d) => d.id === e.target.value);
                setSelectedDistrict(district || null);
              }}
              displayEmpty
              fullWidth
              disabled={!selectedProvince}
            >
              <MenuItem value="">
                <em>Chọn quận/huyện</em>
              </MenuItem>
              {districts.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedWard?.id || ""}
              onChange={(e) => {
                const ward = wards.find((w) => w.id === e.target.value);
                setSelectedWard(ward || null);
              }}
              displayEmpty
              fullWidth
              disabled={!selectedDistrict}
            >
              <MenuItem value="">
                <em>Chọn phường/xã</em>
              </MenuItem>
              {wards.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Huỷ
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingTeacherId ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
