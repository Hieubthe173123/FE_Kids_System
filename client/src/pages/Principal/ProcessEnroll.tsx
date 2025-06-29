import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  FormGroup,
} from "@mui/material";
import {
  DataGrid,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RefreshIcon from "@mui/icons-material/Refresh";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getListEnrollSchool,
  accessProcessEnroll,
} from "../../services/ApiServices";

const PRIMARY_COLOR = "#4194cb";
const BACKGROUND_COLOR = "#fefefe";
const allStates = ["Chờ xử lý", "Chờ xác nhận", "Xử lý lỗi", "Hoàn thành"];

function CustomFooter({ count }: { count: number }) {
  return (
    <GridFooterContainer
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1,
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #ccc",
      }}
    >
      <Typography fontSize={14} color="#666">
        Đã tìm thấy <strong>{count}</strong> hồ sơ
      </Typography>
      <GridPagination />
    </GridFooterContainer>
  );
}

export default function ProcessEnroll() {
  const [searchText, setSearchText] = useState("");
  const [selectedStates, setSelectedStates] = useState([
    "Chờ xử lý",
    "Chờ xác nhận",
    "Xử lý lỗi",
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [enrollData, setEnrollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getListEnrollSchool();
      const formatted = data.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }));
      setEnrollData(formatted);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hồ sơ:", error);
      toast.error("Lỗi khi tải danh sách hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEnroll = async () => {
    const { data, error } = await accessProcessEnroll();

    if (error) {
      toast.error("Không tìm thấy trạng thái chờ xác nhận");
    } else {
      toast.success("Xử lý email thành công!");
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStateToggle = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const filteredData = enrollData
    .filter((item) => selectedStates.includes(item.state))
    .filter(
      (item) =>
        item.enrollCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
    );

  const columns = [
    { field: "enrollCode", headerName: "Mã hồ sơ", flex: 1.5 },
    { field: "studentName", headerName: "Tên học sinh", flex: 1.2 },
    { field: "studentAge", headerName: "Tuổi học sinh", flex: 1.2 },
    { field: "parentName", headerName: "Tên Phụ huynh", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "IDCard", headerName: "CMND/CCCD", flex: 1 },
    { field: "state", headerName: "Trạng thái", flex: 1 },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: BACKGROUND_COLOR, minHeight: "100vh" }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: PRIMARY_COLOR,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AssignmentTurnedInIcon />
          Danh sách hồ sơ nhập học
        </Typography>
        <Box sx={{ mt: 1 }}>
          <ToastContainer position="top-right" autoClose={3000} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Tìm kiếm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280 }}
        />

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lọc trạng thái">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <FilterAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xử lý email">
            <IconButton onClick={handleProcessEnroll}>
              <EmailIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper
        elevation={2}
        sx={{ height: "70vh", borderRadius: 2, overflow: "hidden" }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          slots={{
            footer: () => <CustomFooter count={filteredData.length} />,
          }}
          sx={{
            backgroundColor: "#fff",
            border: "none",
            fontFamily: `"Comic Neue", "Roboto", sans-serif`,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#d5f0ff",
              color: "#000",
              fontWeight: "bold",
              fontSize: 15,
              borderBottom: "1px solid #ccc",
            },
            "& .MuiDataGrid-cell": {
              color: "#333",
              fontSize: 14,
              padding: "12px 8px",
              borderBottom: "1px solid #eee",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f0f9ff",
            },
          }}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem disableRipple>
          <Typography fontWeight="bold">Chọn trạng thái</Typography>
        </MenuItem>
        <MenuItem disableRipple>
          <FormGroup>
            {allStates.map((state) => (
              <FormControlLabel
                key={state}
                control={
                  <Checkbox
                    checked={selectedStates.includes(state)}
                    onChange={() => handleStateToggle(state)}
                  />
                }
                label={state}
              />
            ))}
          </FormGroup>
        </MenuItem>
        <MenuItem disableRipple>
          <Button
            onClick={() => setAnchorEl(null)}
            variant="contained"
            fullWidth
            size="small"
          >
            Áp dụng lọc
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
}
