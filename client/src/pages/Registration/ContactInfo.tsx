import { Typography, Box, Divider } from '@mui/material';

export const ContactInfo = () => {
    return (
        <Box sx={{ pl: { md: 5 }, fontFamily: 'Poppins, sans-serif' }}>
            <Box mb={5}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>Liên hệ trường mầm non Sakura</Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Cơ sở chính</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                    123 Đường Hoa Đào, Phường Nhật Tân, Quận Tây Hồ, TP. Hà Nội
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Cơ sở 2</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}>
                    456 Đường Hoa Mai, Phường Bưởi, Quận Ba Đình, TP. Hà Nội
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontFamily: 'Poppins, sans-serif' }}>Cơ sở 3</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    789 Đường Hoa Lan, Phường Xuân La, Quận Tây Hồ, TP. Hà Nội
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

        </Box>
    );
};