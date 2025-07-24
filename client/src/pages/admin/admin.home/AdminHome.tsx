import { useEffect, useState } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Paper,
  Box,
  Typography,
  Stack,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { AccountListItem } from "../../../model/Interface";
import { getAccounts } from "../../../services/admin.service";
import LoadingOverlay from "../../../components/LoadingOverlay";

export default function AccountHomePage() {
  const [accounts, setAccounts] = useState<AccountListItem[]>([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getAccounts();
        setAccounts(response);
      } catch (error) {
        console.error("Lỗi khi fetch account:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((acc) => {
    const searchMatch =
      acc.fullName.toLowerCase().includes(search.toLowerCase()) ||
      acc.phoneNumber.toString().includes(search) ||
      acc.email.toLowerCase().includes(search.toLowerCase());

    const roleMatch = filterRole === "all" || acc.role === filterRole;
    return searchMatch && roleMatch;
  });

  const roleChip = (role: string) => {
    if (role === "parent") {
      return <Chip label="Phụ huynh" size="small" sx={{ bgcolor: "#c8e6c9", color: "#2e7d32", fontWeight: 600 }} />;
    }
    if (role === "teacher") {
      return <Chip label="Giáo viên" size="small" sx={{ bgcolor: "#bbdefb", color: "#1565c0", fontWeight: 600 }} />;
    }
    return <Chip label="Khác" size="small" />;
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      {loading && <LoadingOverlay />}

      <Paper elevation={3} sx={{ borderRadius: 3, p: 4, maxWidth: 1500, mx: "auto", bgcolor: "#fff" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#4194cb", mb: 3 }}>
          Quản lý tài khoản
        </Typography>

        {/* Search + Filter */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            label="Tìm kiếm"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ minWidth: 150 }}>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              fullWidth
              sx={{ bgcolor: "white", borderRadius: 2 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="parent">Phụ huynh</MenuItem>
              <MenuItem value="teacher">Giáo viên</MenuItem>
            </Select>
          </Box>
        </Stack>

        {/* Table */}
        <Box sx={{ borderRadius: 3, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#4194cb" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Họ tên</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Vai trò</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>SĐT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts?.map((acc, idx) => (
                <TableRow
                  key={acc._id}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#eaf6fd" : "#ffffff",
                    "&:hover": { backgroundColor: "#d2ecfb", cursor: "pointer" },
                  }}
                  onClick={() => navigate(`/admin-home/account-management/${acc._id}`)}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#1976d2" }}>{acc.fullName}</TableCell>
                  <TableCell>{acc.email}</TableCell>
                  <TableCell>{roleChip(acc.role)}</TableCell>
                  <TableCell>{acc.phoneNumber}</TableCell>
                </TableRow>
              ))}
              {filteredAccounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không tìm thấy tài khoản nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
