import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, Avatar, Button, Divider, TextField, List, ListItem, ListItemAvatar, ListItemText, Collapse, IconButton, InputAdornment, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getStudentsByParentId, uploadPictureProfile } from '../../services/ParentApi';
import { resetPasswordApi } from '../../services/AuthApi';

function ParentProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [childrenList, setChildrenList] = useState<any[]>([]);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const getPasswordStrength = (password: string) => {
        let score = 0;
        if (!password) return score;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    const passwordStrength = getPasswordStrength(newPassword);
    const getStrengthLabel = (score: number) => {
        switch (score) {
            case 0:
            case 1:
                return 'Rất yếu';
            case 2:
                return 'Yếu';
            case 3:
                return 'Trung bình';
            case 4:
                return 'Mạnh';
            case 5:
                return 'Rất mạnh';
            default:
                return '';
        }
    };


    const handleResetPassword = async () => {
        try {
            await resetPasswordApi(user.email, newPassword, confirmPassword);
            toast.success('Đổi mật khẩu thành công!');
            setShowPasswordFields(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại!');
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const parentId = user._id;
        const fetchStudents = async () => {
            try {
                const res = await getStudentsByParentId(parentId);
                if (res.students && res.students.length > 0) {
                    setChildrenList(res.students);
                } else {
                    setChildrenList([]);
                }
            } catch (err) {
                setChildrenList([]);
                console.error("Failed to load students:", err);
            }
        };
        fetchStudents();
    }, []);

    return (
        <Box sx={{ p: 4, height: '100vh', bgcolor: '#f5f7fb', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
            {/* Cột thông tin phụ huynh */}
            <Paper sx={{ p: 4, borderRadius: 4, width: 340, minWidth: 280, boxShadow: 3, mb: { xs: 3, md: 0 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, position: 'relative' }}>
                    <Box sx={{ position: 'relative', width: 80, height: 80, mb: 2 }}>
                        <Avatar src={user.image} sx={{ width: 80, height: 80, bgcolor: '#1976d2', position: 'absolute', top: 0, left: 0 }}>
                            <PersonIcon fontSize="large" />
                        </Avatar>
                        <IconButton
                            component="label"
                            sx={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                bgcolor: 'background.paper',
                                boxShadow: 2,
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                p: 0,
                                zIndex: 2,
                                border: '2px solid #fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <EditIcon fontSize="small" />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            toast.info('Đang upload ảnh...');
                                            const res = await uploadPictureProfile(user._id, file);
                                            if (res && res.imageUrl) {
                                                toast.success('Cập nhật ảnh thành công!');
                                                user.image = res.imageUrl;
                                                localStorage.setItem('user', JSON.stringify(user));
                                                window.location.reload();
                                            } else {
                                                toast.error('Upload thất bại!');
                                            }
                                        } catch (err) {
                                            toast.error('Upload thất bại!');
                                        }
                                    }
                                }}
                            />
                        </IconButton>
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="#1976d2" gutterBottom>
                        {user.fullName || 'Phụ huynh'}
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>Email:</Typography>
                <Typography variant="body1" fontWeight={500} mb={2}>{user.email || 'Chưa cập nhật'}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Số điện thoại:</Typography>
                <Typography variant="body1" fontWeight={500} mb={2}>{user.phoneNumber || 'Chưa cập nhật'}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Địa chỉ:</Typography>
                <Typography variant="body1" fontWeight={500}>{user.address || 'Chưa cập nhật'}</Typography>
            </Paper>

            {/* Cột danh sách con và đổi mật khẩu */}
            <Paper sx={{ p: 4, borderRadius: 4, flex: 1, minWidth: 320, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight={700} color="#1976d2" gutterBottom>
                    Danh sách con
                </Typography>
                <List>
                    {childrenList.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mt: 1 }}>
                            Không có dữ liệu học sinh.
                        </Typography>
                    ) : (
                        childrenList.map((child: any) => (
                            <ListItem key={child.id || child._id}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#90caf9' }}>
                                        <ChildCareIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={child.name || child.fullName}
                                    secondary={child.age ? `Tuổi: ${child.age}` : child.dob ? `Ngày sinh: ${child.dob}` : ''}
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
                <Divider sx={{ my: 2 }} />
                {/* Phần đổi mật khẩu */}
                <Box sx={{ mt: 3 }}>
                    <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                        tabIndex={0}
                        role="button"
                        aria-expanded={showPasswordFields}
                    >
                        <Typography variant="h6" fontWeight={700} color="#1976d2">
                            Đổi mật khẩu
                        </Typography>
                        <IconButton tabIndex={-1} sx={{ pointerEvents: 'none' }}>
                            {showPasswordFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                    <Collapse in={showPasswordFields}>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Mật khẩu mới"
                                type={showNewPassword ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                variant="standard"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                edge="end"
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {/* Đo lường độ mạnh mật khẩu */}
                            {newPassword && (
                                <Box sx={{ mt: 1, mb: 1 }}>
                                    <LinearProgress variant="determinate" value={passwordStrength * 20} sx={{ height: 8, borderRadius: 5, mb: 0.5 }} />
                                    <Typography variant="caption" color={passwordStrength >= 4 ? 'success.main' : passwordStrength >= 2 ? 'warning.main' : 'error.main'}>
                                        Độ mạnh: {getStrengthLabel(passwordStrength)}
                                    </Typography>
                                </Box>
                            )}
                            <TextField
                                label="Nhập lại mật khẩu"
                                type={showConfirmPassword ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                variant="standard"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                <Button onClick={() => {
                                    setShowPasswordFields(false);
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}>
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleResetPassword}
                                    disabled={!newPassword || newPassword !== confirmPassword}
                                >
                                    Xác nhận
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            </Paper>
        </Box>
    );
}

export default ParentProfile;