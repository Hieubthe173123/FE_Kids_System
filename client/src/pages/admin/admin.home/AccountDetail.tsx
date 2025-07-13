// AccountDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { getAccountById, updateAccount } from '../../../services/admin.service';

type Student = {
  id: string;
  studentCode: string;
  fullName: string;
  age: number;
  gender: string;
};

type AccountForm = {
  fullName: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  email: string;
  IDCard: string;
  address: string;
  account: {
    username: string;
    role: string;
    status: boolean;
  };
  student: Student[];
};

const AccountDetail = () => {
  const { id } = useParams();
  const [role, setRole] = useState('');
  const [editMode, setEditMode] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<AccountForm>({
    defaultValues: {
      fullName: '',
      dob: '',
      gender: '',
      phoneNumber: '',
      email: '',
      IDCard: '',
      address: '',
      account: {
        username: '',
        role: '',
        status: true,
      },
      student: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'student',
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAccountById(id as string);
      const { role, info } = response;
      setRole(role);
      reset(info);
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    await updateAccount(id as string, data);
    alert('Lưu thành công!');
    setEditMode(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        p: 3,
        backgroundColor: editMode ? '#e3f2fd' : '#fafafa',
        border: editMode ? '1px solid #90caf9' : '1px solid #ddd',
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={2} mb={3}>
        {editMode ? (
          <>
            <Button variant="contained" color="success" onClick={handleSubmit(onSubmit)}>Lưu</Button>
            <Button variant="outlined" color="inherit" onClick={() => setEditMode(false)}>Hủy bỏ</Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => setEditMode(true)}>Chỉnh sửa</Button>
        )}
      </Stack>

      <Typography variant="h6" gutterBottom>Thông tin cá nhân</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Controller name="fullName" control={control} render={({ field }) => (
            <TextField {...field} label="Họ tên" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Controller name="dob" control={control} render={({ field }) => (
            <TextField {...field} label="Ngày sinh" fullWidth type="date" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Controller name="gender" control={control} render={({ field }) => (
            <TextField {...field} label="Giới tính" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Controller name="IDCard" control={control} render={({ field }) => (
            <TextField {...field} label="CMND/CCCD" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Controller name="phoneNumber" control={control} render={({ field }) => (
            <TextField {...field} label="SĐT" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Controller name="email" control={control} render={({ field }) => (
            <TextField {...field} label="Email" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>
        <Grid item xs={12} {...({} as any)}>
          <Controller name="address" control={control} render={({ field }) => (
            <TextField {...field} label="Địa chỉ" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#eaeef1' } }} />
          )} />
        </Grid>

        {/* Account Info */}
        <Grid item xs={12} {...({} as any)}><Typography variant="subtitle1">Thông tin tài khoản</Typography></Grid>
        <Grid item xs={6} {...({} as any)}>
          <Controller name="account.username" control={control} render={({ field }) => (
            <TextField {...field} label="Tên đăng nhập" fullWidth InputProps={{ readOnly: true }} />
          )} />
        </Grid>
        <Grid item xs={6} {...({} as any)}>
          <Controller name="account.role" control={control} render={({ field }) => (
            <TextField {...field} label="Vai trò" fullWidth InputProps={{ readOnly: true }} />
          )} />
        </Grid>
        <Grid item xs={6} {...({} as any)}>
          <Controller name="account.status" control={control} render={({ field }) => (
            <TextField {...field} label="Trạng thái" fullWidth InputProps={{ readOnly: true }} value={field.value ? 'Hoạt động' : 'Ngừng'} />
          )} />
        </Grid>
      </Grid>

      {/* Student List */}
      {role === 'parent' && (
        <>
          <Typography variant="h6" mt={5} mb={2}>Danh sách các con</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã HS</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Tuổi</TableCell>
                  <TableCell>Giới tính</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((child, index) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.studentCode}</TableCell>
                    <TableCell>
                      <Controller name={`student.${index}.fullName`} control={control} render={({ field }) => (
                        <TextField {...field} variant="standard" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#f0f0f0' } }} />
                      )} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`student.${index}.age`} control={control} render={({ field }) => (
                        <TextField {...field} variant="standard" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#f0f0f0' } }} />
                      )} />
                    </TableCell>
                    <TableCell>
                      <Controller name={`student.${index}.gender`} control={control} render={({ field }) => (
                        <TextField {...field} variant="standard" fullWidth InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#ffffff' : '#f0f0f0' } }} />
                      )} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default AccountDetail;
