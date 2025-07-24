// AccountDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import LoadingOverlay from '../../../components/LoadingOverlay';
import { toast, ToastContainer } from 'react-toastify';

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
  const [loading, setLoading] = useState(false);
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

  const validateForm = (data: AccountForm): boolean => {
    const errors: string[] = [];
  
    // Thông tin cá nhân
    if (!data.fullName.trim()) errors.push('Họ tên không được để trống');
    if (!['nam', 'nữ', 'Nam', 'Nữ'].includes(data.gender)) errors.push('Giới tính phải là nam hoặc nữ');
    if (!data.phoneNumber.trim().match(/^0[0-9]{9}$/)) errors.push('Sai định dạng số điện thoại');
    if (!data.dob.trim()) {
      errors.push('Ngày sinh không được để trống');
    } else {
      const dobDate = new Date(data.dob);
      const now = new Date();
      if (dobDate > now) errors.push('Ngày sinh không được trong tương lai');
    }
    if (!data.email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Email sai định dạng');
    if (!data.IDCard.trim().match(/^[0-9]{9,12}$/)) errors.push('Căn cước công dân sai định dạng');
    if (!data.address.trim()) errors.push('Địa chỉ không được để trống');
  
    // Danh sách học sinh (nếu có)
    data.student.forEach((s, index) => {
      if (!s.fullName.trim()) errors.push(`Tên học sinh ${index + 1} không được để trống`);
      if (typeof s.age !== 'number' || isNaN(s.age)) {
        errors.push(`Tuổi của con số ${index + 1} phải là 1 số`);
      } else if (s.age === 0) {
        errors.push(`Tuổi của con số ${index + 1} phải khác 0`);
      }
  
      if (!['nam', 'nữ', 'Nam', 'Nữ'].includes(s.gender)) {
        errors.push(`Giới tính của con số ${index + 1} phải là nam hoặc nữ`);
      }
    });
  
    if (errors.length > 0) {
      errors.forEach((err) => alert(err)); // dùng alert hoặc custom toast
      return false;
    }
  
    return true;
  };
  
  const onSubmit = async (data: AccountForm) => {
    if (!validateForm(data)) return;
  
    try {
      setLoading(true);
      await updateAccount(id as string, data);
      toast.success("Chỉnh sửa thành công.");
      setLoading(false);
      setEditMode(false);
    } catch (e) {
      setLoading(false);
     toast.error("Lỗi tại máy chủ. Vui lòng thử lại.");
    }
  };
  

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        p: 0,
        backgroundColor: '#f5f7fb',
      }}
    >
        {loading && <LoadingOverlay />}
        <ToastContainer />
      <Paper elevation={2} sx={{ borderRadius: 3, p: 4, maxWidth: 1500, mx: 'auto', mt: 4, mb: 4, bgcolor: '#fff' }}>
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

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#4194cb', mb: 3 }}>
  Thông tin cá nhân
</Typography>

<Grid container spacing={2} mb={2}>
  {/* Họ tên - Giới tính */}
  <Grid item xs={6} {...({} as any)}>
    <Controller name="fullName" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="Họ tên"
        fullWidth
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>
  <Grid item xs={6} {...({} as any)}>
    <Controller name="gender" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="Giới tính"
        fullWidth
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>

  {/* SĐT - Ngày sinh */}
  <Grid item xs={6} {...({} as any)}>
    <Controller name="phoneNumber" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="SĐT"
        fullWidth
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>
  <Grid item xs={6} {...({} as any)}>
    <Controller name="dob" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="Ngày sinh"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>

  {/* Email - CMND/CCCD */}
  <Grid item xs={6} {...({} as any)}>
    <Controller name="email" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="Email"
        fullWidth
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>
  <Grid item xs={6} {...({} as any)}>
    <Controller name="IDCard" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="CMND/CCCD"
        fullWidth
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>

  {/* Địa chỉ – full width */}
  <Grid item xs={12} {...({} as any)} >
    <Controller name="address" control={control} render={({ field }) => (
      <TextField
        {...field}
        label="Địa chỉ"
        fullWidth
        InputProps={{ readOnly: !editMode, sx: { backgroundColor: editMode ? '#fff' : '#eaeef1' } }}
      />
    )} />
  </Grid>
</Grid>
    
        {/* Account Info */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0d47a1', mb: 2 }}>Thông tin tài khoản</Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4} {...({} as any)}>
            <Controller name="account.username" control={control} render={({ field }) => (
              <TextField {...field} label="Tên đăng nhập" fullWidth InputProps={{ readOnly: true,sx: { backgroundColor: '#eaeef1' }, }} sx={{ mb: 2 }} />
            )} />
          </Grid>
          <Grid item xs={12} md={4} {...({} as any)}>
            <Controller name="account.role" control={control} render={({ field }) => (
              <TextField {...field} label="Vai trò" fullWidth InputProps={{ readOnly: true,sx: { backgroundColor: '#eaeef1' }, }} sx={{ mb: 2 }} value={field.value === "parent" ? "Phụ huynh" : "Giáo viên"} />
            )} />
          </Grid>
          <Grid item xs={12} md={4} {...({} as any)}>
            <Controller name="account.status" control={control} render={({ field }) => (
              <TextField {...field} label="Trạng thái" fullWidth InputProps={{ readOnly: true,sx: { backgroundColor: '#eaeef1' }, }} value={field.value ? 'Hoạt động' : 'Ngừng'} sx={{ mb: 2 }} />
            )} />
          </Grid>
        </Grid>

        {/* Student List */}
        {role === 'parent' && (
          <>
            <Typography variant="h6" mt={5} mb={2} sx={{ fontWeight: 700, color: '#4194cb' }}>Danh sách các con</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: '#f9fbfc', boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#4194cb' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Mã HS</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tên</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tuổi</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Giới tính</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {fields.map((child, index) => (
    <TableRow
      key={child.id}
      sx={{
        backgroundColor: index % 2 === 0 ? '#eaf6fd' : '#ffffff',
      }}
    >
      <TableCell>{child.studentCode}</TableCell>

      <TableCell>
        <Controller
          name={`student.${index}.fullName`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                readOnly: !editMode,
                sx: {
                  backgroundColor: editMode ? '#fff' : '#f5f5f5',
                  borderRadius: 1,
                  paddingY: 0.5,
                  paddingX: 1,
                  fontSize: '0.875rem',
                  '& input': {
                    padding: '8px 10px',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#90caf9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          )}
        />
      </TableCell>

      <TableCell>
        <Controller
          name={`student.${index}.age`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                readOnly: !editMode,
                sx: {
                  backgroundColor: editMode ? '#fff' : '#f5f5f5',
                  borderRadius: 1,
                  paddingY: 0.5,
                  paddingX: 1,
                  fontSize: '0.875rem',
                  '& input': {
                    padding: '8px 10px',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#90caf9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          )}
        />
      </TableCell>

      <TableCell>
        <Controller
          name={`student.${index}.gender`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                readOnly: !editMode,
                sx: {
                  backgroundColor: editMode ? '#fff' : '#f5f5f5',
                  borderRadius: 1,
                  paddingY: 0.5,
                  paddingX: 1,
                  fontSize: '0.875rem',
                  '& input': {
                    padding: '8px 10px',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#90caf9',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          )}
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>

              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
     
    </Box>
  );
};

export default AccountDetail;
