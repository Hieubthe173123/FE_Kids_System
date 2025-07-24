import React, { useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel, MenuItem, FormControl, InputLabel, Select, Stack } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEnrollSchool } from '../../services/GuestApi';


const genders = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
];

const relationships = [
    { value: 'father', label: 'Bố' },
    { value: 'mother', label: 'Mẹ' },
    { value: 'grandfather', label: 'Ông' },
    { value: 'grandmother', label: 'Bà' },
    { value: 'sibling', label: 'Anh/Chị' },
    { value: 'other', label: 'Khác' },
];

export const ContactForm = () => {
    const [formState, setFormState] = useState({
        studentName: '', studentAge: '', studentDob: '', studentGender: '',
        parentName: '', parentDob: '', parentGender: '', IDCard: '', address: '', phoneNumber: '',
        email: '', relationship: '', reason: '', note: '', nda: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;
        if (type === 'checkbox') {
            setFormState(prev => ({ ...prev, [name]: (event.target as HTMLInputElement).checked }));
        } else {
            if (name === 'studentDob') {
                const dob = value;
                let age = '';
                if (dob) {
                    const dobDate = new Date(dob);
                    const today = new Date();
                    let years = today.getFullYear() - dobDate.getFullYear();
                    const m = today.getMonth() - dobDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                        years--;
                    }
                    age = years > 0 ? years.toString() : '0';
                }
                setFormState(prev => ({ ...prev, [name]: value, studentAge: age }));
            } else {
                setFormState(prev => ({ ...prev, [name]: value }));
            }
        }
    };

    const handleSubmit = async () => {
        const requiredFields = [
            'studentName', 'studentAge', 'studentDob', 'studentGender',
            'parentName', 'parentDob', 'parentGender', 'IDCard', 'address', 'phoneNumber',
            'email', 'relationship', 'reason'
        ];
        const missingFields = requiredFields.filter(field => !formState[field as keyof typeof formState] || (typeof formState[field as keyof typeof formState] === 'string' && (formState[field as keyof typeof formState] as string).trim() === ''));
        if (missingFields.length > 0) {
            toast.warning('Vui lòng điền đầy đủ tất cả các trường bắt buộc!');
            return;
        }
        // Kiểm tra số điện thoại
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(formState.phoneNumber)) {
            toast.warning('Số điện thoại không hợp lệ!');
            return;
        }
        // Kiểm tra ID Card (CMND/CCCD: 9 hoặc 12 số)
        const idCardRegex = /^\d{9}$|^\d{12}$/;
        if (!idCardRegex.test(formState.IDCard)) {
            toast.warning('CMND/CCCD phải gồm 9 hoặc 12 số!');
            return;
        }
        // Kiểm tra độ tuổi (chỉ nhận 1-5 tuổi)
        const ageNum = Number(formState.studentAge);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 5) {
            toast.warning('Độ tuổi học sinh phải từ 1 đến 5 tuổi!');
            return;
        }
        if (!formState.nda) {
            toast.warning('Vui lòng xác nhận cam kết trước khi đăng ký!');
            return;
        }
        try {
            setLoading(true);
            const res = await createEnrollSchool(formState);
            toast.success('Đăng ký thành công!');
            console.log('API response:', res);
            setFormState({
                studentName: '', studentAge: '', studentDob: '', studentGender: '',
                parentName: '', parentDob: '', parentGender: '', IDCard: '', address: '', phoneNumber: '',
                email: '', relationship: '', reason: '', note: '', nda: false,
            });
        } catch (error) {
            toast.error('Đăng ký thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };



    return (
        <Box sx={{ fontFamily: 'Poppins, sans-serif', position: 'relative' }}>
            {loading && <LoadingOverlay />}
            <Stack spacing={4} sx={{ minWidth: 0, fontFamily: 'Poppins, sans-serif' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Poppins, sans-serif' }}>Thông tin học sinh</Typography>
                    <Stack direction="row" spacing={2} sx={{ minWidth: 0, flexWrap: 'wrap' }}>
                        <Box flex={1} minWidth={200} mb={2}><TextField name="studentName" value={formState.studentName} onChange={handleChange} label="Tên học sinh" variant="standard" fullWidth InputProps={{ style: { color: '#111', fontWeight: 500 } }} InputLabelProps={{ style: { color: '#111' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' } }} /></Box>
                        <Box flex={1} minWidth={180} mb={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Ngày sinh"
                                    value={formState.studentDob ? dayjs(formState.studentDob) : null}
                                    onChange={(date) => {
                                        let value = (date && typeof (date as any).format === 'function') ? (date as any).format('YYYY-MM-DD') : '';
                                        let age = '';
                                        if (value) {
                                            const dobDate = new Date(value);
                                            const today = new Date();
                                            let years = today.getFullYear() - dobDate.getFullYear();
                                            const m = today.getMonth() - dobDate.getMonth();
                                            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                                                years--;
                                            }
                                            age = years > 0 ? years.toString() : '0';
                                        }
                                        setFormState(prev => ({ ...prev, studentDob: value, studentAge: age }));
                                    }}
                                    slotProps={{
                                        textField: {
                                            variant: 'standard',
                                            fullWidth: true,
                                            InputLabelProps: { shrink: true, style: { color: '#111' } },
                                            InputProps: { style: { color: '#111', fontWeight: 500 } },
                                            sx: {
                                                '& .MuiInput-underline:after': { borderBottomColor: '#111' },
                                                '& .MuiInput-underline:before': { borderBottomColor: '#111' },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' },
                                                '& .MuiSvgIcon-root': { color: '#111' },
                                                '& .MuiPickersDay-root': { color: '#111' },
                                                '& .MuiOutlinedInput-root': { color: '#111' },
                                                '& .MuiButtonBase-root': { color: '#111' },
                                            }
                                        }
                                    }}
                                    slots={{ openPickerIcon: undefined }}
                                    sx={{
                                        '& .MuiSvgIcon-root': { color: '#111' },
                                        '& .MuiPickersDay-root': { color: '#111' },
                                        '& .MuiOutlinedInput-root': { color: '#111' },
                                        '& .MuiButtonBase-root': { color: '#111' },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box flex={1} minWidth={120} mb={2}><TextField name="studentAge" value={formState.studentAge} onChange={handleChange} label="Tuổi" variant="standard" fullWidth InputProps={{ style: { color: '#111', fontWeight: 500 } }} InputLabelProps={{ style: { color: '#111' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' } }} /></Box>

                        <Box flex={1} minWidth={180} mb={2}>
                            <FormControl variant="standard" fullWidth sx={{
                                '& .MuiInputLabel-root': { color: '#111 !important' },
                                '& .MuiSelect-root': { color: '#111' },
                                '& .MuiSelect-icon': { color: '#111' },
                                '& .MuiInput-underline:after': { borderBottomColor: '#111' },
                                '& .MuiInput-underline:before': { borderBottomColor: '#111' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' },
                            }}>
                                <InputLabel id="student-gender-label" shrink>Giới tính</InputLabel>
                                <Select
                                    labelId="student-gender-label"
                                    id="student-gender-select"
                                    name="studentGender"
                                    value={formState.studentGender}
                                    onChange={(event) => {
                                        const { name, value } = event.target as { name: string; value: string };
                                        setFormState(prev => ({ ...prev, [name]: value }));
                                    }}
                                    label="Giới tính"
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (!selected) {
                                            return <span style={{ color: '#aaa' }}>Chọn giới tính</span>;
                                        }
                                        return genders.find(g => g.value === selected)?.label || '';
                                    }}
                                    MenuProps={{ disableScrollLock: true, PaperProps: { style: { maxHeight: 300, minWidth: 150, overflowY: 'auto' } } }}
                                    sx={{ minWidth: 0, color: '#111', '& .MuiSelect-icon': { color: '#111' } }}
                                >
                                    <MenuItem value=""><em>Chọn giới tính</em></MenuItem>
                                    {genders.map(g => (
                                        <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </Box>
                <Box my={3}><hr style={{ border: '3px solid #3982b8' }} /></Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Poppins, sans-serif' }}>Thông tin phụ huynh</Typography>
                    <Stack spacing={2} sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                            <Box flex={1} minWidth={200}><TextField name="parentName" value={formState.parentName} onChange={handleChange} label="Tên phụ huynh" variant="standard" fullWidth autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} InputLabelProps={{ style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                            <Box flex={1} minWidth={180}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Ngày sinh"
                                        value={formState.parentDob ? dayjs(formState.parentDob) : null}
                                        onChange={(date) => {
                                            let value = '';
                                            if (date && typeof (date as any).format === 'function') {
                                                value = (date as any).format('YYYY-MM-DD');
                                            }
                                            setFormState(prev => ({ ...prev, parentDob: value }));
                                        }}
                                        slotProps={{
                                            textField: {
                                                variant: 'standard',
                                                fullWidth: true,
                                                autoComplete: 'off',
                                                InputLabelProps: { shrink: true, style: { color: '#111', fontFamily: 'Poppins, sans-serif' } },
                                                InputProps: { style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } },
                                                sx: {
                                                    '& .MuiInput-underline:after': { borderBottomColor: '#111' },
                                                    '& .MuiInput-underline:before': { borderBottomColor: '#111' },
                                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' },
                                                    fontFamily: 'Poppins, sans-serif',
                                                    '& .MuiSvgIcon-root': { color: '#111' },
                                                    '& .MuiPickersDay-root': { color: '#111' },
                                                    '& .MuiOutlinedInput-root': { color: '#111' },
                                                    '& .MuiButtonBase-root': { color: '#111' },
                                                }
                                            }
                                        }}
                                        slots={{ openPickerIcon: undefined }}
                                        sx={{
                                            '& .MuiSvgIcon-root': { color: '#111' },
                                            '& .MuiPickersDay-root': { color: '#111' },
                                            '& .MuiOutlinedInput-root': { color: '#111' },
                                            '& .MuiButtonBase-root': { color: '#111' },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box flex={1} minWidth={180}>
                                <FormControl variant="standard" fullWidth sx={{
                                    '& .MuiInputLabel-root': { color: '#111 !important' },
                                    '& .MuiSelect-root': { color: '#111' },
                                    '& .MuiSelect-icon': { color: '#111' },
                                    '& .MuiInput-underline:after': { borderBottomColor: '#111' },
                                    '& .MuiInput-underline:before': { borderBottomColor: '#111' },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' },
                                }}>
                                    <InputLabel id="parent-gender-label" shrink>Giới tính</InputLabel>
                                    <Select
                                        labelId="parent-gender-label"
                                        id="parent-gender-select"
                                        name="parentGender"
                                        value={formState.parentGender}
                                        onChange={(event) => {
                                            const { name, value } = event.target as { name: string; value: string };
                                            setFormState(prev => ({ ...prev, [name]: value }));
                                        }}
                                        label="Giới tính"
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return <span style={{ color: '#aaa' }}>Chọn giới tính</span>;
                                            }
                                            return genders.find(g => g.value === selected)?.label || '';
                                        }}
                                        MenuProps={{ disableScrollLock: true, PaperProps: { style: { maxHeight: 300, minWidth: 150, overflowY: 'auto' } } }}
                                        sx={{ minWidth: 0, color: '#111', '& .MuiSelect-icon': { color: '#111' } }}
                                    >
                                        <MenuItem value=""><em>Chọn giới tính</em></MenuItem>
                                        {genders.map(g => (
                                            <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                            <Box flex={1} minWidth={160}><TextField name="IDCard" value={formState.IDCard} onChange={handleChange} label="CMND/CCCD" variant="standard" fullWidth autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} InputLabelProps={{ style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                            <Box flex={1} minWidth={160}><TextField name="phoneNumber" value={formState.phoneNumber} onChange={handleChange} label="Số điện thoại" variant="standard" fullWidth autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} InputLabelProps={{ style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                            <Box flex={1} minWidth={200}><TextField name="email" value={formState.email} onChange={handleChange} label="Email" type="email" variant="standard" fullWidth autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} InputLabelProps={{ style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                            <Box flex={1} minWidth={180}>
                                <FormControl variant="standard" fullWidth sx={{
                                    '& .MuiInputLabel-root': { color: '#111 !important' },
                                    '& .MuiSelect-root': { color: '#111' },
                                    '& .MuiSelect-icon': { color: '#111' },
                                    '& .MuiInput-underline:after': { borderBottomColor: '#111' },
                                    '& .MuiInput-underline:before': { borderBottomColor: '#111' },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' },
                                }}>
                                    <InputLabel id="relationship-label" shrink>Quan hệ với học sinh</InputLabel>
                                    <Select
                                        labelId="relationship-label"
                                        id="relationship-select"
                                        name="relationship"
                                        value={formState.relationship}
                                        onChange={(event) => {
                                            const { name, value } = event.target as { name: string; value: string };
                                            setFormState(prev => ({ ...prev, [name]: value }));
                                        }}
                                        label="Quan hệ với học sinh"
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return <span style={{ color: '#aaa' }}>Chọn quan hệ</span>;
                                            }
                                            return relationships.find(r => r.value === selected)?.label || '';
                                        }}
                                        MenuProps={{ disableScrollLock: true, PaperProps: { style: { maxHeight: 300, minWidth: 150, overflowY: 'auto' } } }}
                                        sx={{ minWidth: 0, color: '#111', '& .MuiSelect-icon': { color: '#111' } }}
                                    >
                                        <MenuItem value=""><em>Chọn quan hệ</em></MenuItem>
                                        {relationships.map(r => (
                                            <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box flex={2} minWidth={220}><TextField name="address" value={formState.address} onChange={handleChange} label="Địa chỉ" variant="standard" fullWidth autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} InputLabelProps={{ style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                            <Box flex={1} minWidth={180}><TextField name="reason" value={formState.reason} onChange={handleChange} label="Lý do đăng ký" variant="standard" fullWidth InputLabelProps={{ shrink: true, style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                            <Box flex={1} minWidth={180}><TextField name="note" value={formState.note} onChange={handleChange} label="Ghi chú (sức khỏe)" variant="standard" fullWidth InputLabelProps={{ shrink: true, style: { color: '#111', fontFamily: 'Poppins, sans-serif' } }} autoComplete="off" InputProps={{ style: { color: '#111', fontWeight: 500, fontFamily: 'Poppins, sans-serif' } }} sx={{ '& .MuiInput-underline:after': { borderBottomColor: '#111' }, '& .MuiInput-underline:before': { borderBottomColor: '#111' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#111' }, fontFamily: 'Poppins, sans-serif' }} /></Box>
                        </Stack>
                    </Stack>
                </Box>
                <Box mt={4}>
                    <FormControlLabel
                        control={<Checkbox name="nda" checked={formState.nda} onChange={handleChange} sx={{ color: '#e6687a', '&.Mui-checked': { color: '#e6687a' }, fontFamily: 'Poppins, sans-serif' }} />}
                        label={<span style={{ color: '#e6687a', fontWeight: 600, fontSize: '1.05rem', fontFamily: 'Poppins, sans-serif' }}>
                            Tôi cam kết chịu trách nhiệm về tính chính xác của thông tin đăng ký và đồng ý với các quy định của trường Sakura
                        </span>}
                        sx={{ alignItems: 'flex-start', mt: 1, mb: 1, fontFamily: 'Poppins, sans-serif' }}
                    />
                </Box>
                <Button
                    fullWidth
                    size="medium"
                    onClick={handleSubmit}
                    sx={{
                        mt: 3,
                        background: '#e6687a',
                        color: 'white',
                        py: 1.1,
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: 1,
                        boxShadow: '0 4px 16px 0 rgba(230,104,122,0.18)',
                        textTransform: 'uppercase',
                        transition: '0.2s',
                        border: '2px solid #e6687a',
                        fontFamily: 'Poppins, sans-serif',
                        '&:hover': {
                            background: '#c94a5e',
                            color: '#fff',
                            border: '2.5px solid #c94a5e',
                            boxShadow: '0 6px 24px 0 rgba(230,104,122,0.22)',
                            letterSpacing: 2,
                        },
                    }}
                >
                    Đăng ký
                </Button>
            </Stack>
            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    );
};