import { Typography, Box, Divider, TextField, InputAdornment, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export const ContactInfo = () => {
    return (
        <Box sx={{ pl: { md: 5 }, fontFamily: 'Poppins, sans-serif' }}>
            {/* Thông tin trường Sakura */}
            <Box mb={5}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>Liên hệ trường mầm non Sakura</Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Cơ sở chính</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                    123 Đường Hoa Đào, Phường Sakura, Quận Bình Thạnh, TP. Hồ Chí Minh
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Cơ sở 2</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                    456 Đường Hoa Mai, Phường Sakura, Quận 1, TP. Hồ Chí Minh
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Cơ sở 3</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    789 Đường Hoa Lan, Phường Sakura, Quận 3, TP. Hồ Chí Minh
                </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Liên hệ nhanh */}
            <Box mb={5}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>Liên hệ nhanh</Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontFamily: 'Poppins, sans-serif' }}>
                    <span role="img" aria-label="phone" style={{ marginRight: 8 }}>📞</span> 0901 234 567
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins, sans-serif' }}>
                    <span role="img" aria-label="email" style={{ marginRight: 8 }}>✉️</span> lienhe@sakura.edu.vn
                </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Đăng ký nhận tin */}
            <Box>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>Bạn muốn nhận thông báo từ Sakura?</Typography>
                <TextField
                    fullWidth
                    label="Email của bạn"
                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                    InputProps={{
                        style: { fontFamily: 'Poppins, sans-serif' },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton sx={{ backgroundColor: '#e6687a', color: 'white', '&:hover': { backgroundColor: '#4194cb' }, fontFamily: 'Poppins, sans-serif' }}>
                                    <CheckIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{ style: { fontFamily: 'Poppins, sans-serif' } }}
                />
            </Box>
        </Box>
    );
};