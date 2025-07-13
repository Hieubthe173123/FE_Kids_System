// pages/admin/accounts/index.tsx
import { useEffect, useState } from "react";
import { TextField, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, InputLabel, Link } from "@mui/material";
import type { AccountListItem } from "../../../model/Interface";
import { getAccounts } from "../../../services/admin.service";
import { useNavigate } from "react-router-dom";


export default function AccountHomePage() {
  const [accounts, setAccounts] = useState<AccountListItem[]>([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [accountDetail, setAccountDetail] = useState<AccountListItem | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts();
        setAccounts(response);
      } catch (error) {
        console.error("Lỗi khi fetch account:", error);
      }
    };
  
    fetchAccounts();
  }, []);
  console.log('check accounts',accounts);
  

  const filteredAccounts = accounts.filter(acc => {
    const searchMatch = acc.fullName.toLowerCase().includes(search.toLowerCase()) 
    || acc.phoneNumber.toString().includes(search)
    || acc.email.toLowerCase().includes(search.toLowerCase())
    ;
    const roleMatch = filterRole === "all" || acc.role === filterRole;
    return searchMatch && roleMatch;
  });

  return (
    <div>
      <h2>Quản lý tài khoản</h2>
      <TextField label="Tìm kiếm" fullWidth onChange={e => setSearch(e.target.value)} />
      <InputLabel>Vai trò</InputLabel>
      <Select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="parent">Phụ huynh</MenuItem>
        <MenuItem value="teacher">Giáo viên</MenuItem>

      </Select>

      <Table>
        <TableHead>
          <TableRow>
         
            <TableCell>Họ tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>SĐT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAccounts?.map(acc => (
            <TableRow key={acc._id} >
              <TableCell sx={{cursor: 'pointer'}} onClick={() => navigate(`/admin-home/account-management/${acc._id}`)}>
                {acc.fullName}
              </TableCell>
              <TableCell>{acc.email}</TableCell>
              <TableCell>{acc.role}</TableCell>
              <TableCell>{acc.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
