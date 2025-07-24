// pages/admin/accounts/index.tsx
import { useEffect, useState } from "react";
import { TextField, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Paper, Box, Typography, Stack } from "@mui/material";
import type { AccountListItem } from "../../../model/Interface";
import { getAccounts } from "../../../services/admin.service";
import { useNavigate } from "react-router-dom";
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Lỗi khi fetch account:", error);
      }
    };
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc => {
    const searchMatch = acc.fullName.toLowerCase().includes(search.toLowerCase())
      || acc.phoneNumber.toString().includes(search)
      || acc.email.toLowerCase().includes(search.toLowerCase())
      ;
    const roleMatch = filterRole === "all" || acc.role === filterRole;
    return searchMatch && roleMatch;
  });

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
      {loading && <LoadingOverlay />}

      <Paper elevation={2} sx={{ borderRadius: 3, p: 4, maxWidth: 1500, mx: 'auto', bgcolor: '#fff' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#4194cb', mb: 3 }}>
          Quản lý tài khoản
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
          <TextField
            label="Tìm kiếm"
            fullWidth
            onChange={e => setSearch(e.target.value)}
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />
          <Box sx={{ minWidth: 150 }}>

            <Select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              fullWidth
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="parent">Phụ huynh</MenuItem>
              <MenuItem value="teacher">Giáo viên</MenuItem>
            </Select>
          </Box>
        </Stack>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#4194cb' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Họ tên</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Vai trò</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SĐT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts?.map((acc, idx) => (
              <TableRow key={acc._id} sx={{ backgroundColor: idx % 2 === 0 ? '#eaf6fd' : '#ffffff' }}>
                <TableCell
                  sx={{ cursor: 'pointer', color: '#1976d2', fontWeight: 600, textDecoration: 'underline', '&:hover': { color: '#0d47a1', textDecoration: 'underline' } }}
                  onClick={() => navigate(`/admin-home/account-management/${acc._id}`)}
                >
                  {acc.fullName}
                </TableCell>
                <TableCell>{acc.email}</TableCell>
                <TableCell>{acc.role === "parent" ? "Phụ huynh" : "Giáo viên"}</TableCell>
                <TableCell>{acc.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
