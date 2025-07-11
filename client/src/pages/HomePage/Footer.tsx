import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, YouTube } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#46a2da", color: "#fff", pt: 0, pb: 6, mt: 8 }}>

      <Box
        sx={{
          height: 6,
          background: "linear-gradient(to right, #46a2da, #4194cb, #3982b8)",
        }}
      />

      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">

          <Grid item xs={12} sm={6} md={4} {...({} as any)}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Sakura School
            </Typography>
            <Typography variant="body2">
              Địa chỉ: Khu Công Nghệ Cao Hòa Lạc, km 29
            </Typography>
            <Typography variant="body2">Hotline: 0000 000 000</Typography>
            <Typography variant="body2">
              Website:{" "}
              <Link href="https://sakura.edu.vn" color="inherit" underline="hover">
                sakura.edu.vn
              </Link>
            </Typography>
            <Typography variant="body2">
              Email:{" "}
              <Link href="mailto:sakura.edu@gmail.com" color="inherit" underline="hover">
                sakura.edu@gmail.com
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4} {...({} as any)}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Chính sách
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="inherit" underline="hover">
                Giới thiệu nhà trường
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Câu hỏi thường gặp
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Chính sách bảo mật
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Học phí & ưu đãi
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4} {...({} as any)}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Kết nối với chúng tôi
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTube />
              </IconButton>
            </Stack>
            <Typography variant="body2">
              © 2025 Sakura School. Thiết kế bởi{" "}
              <Link href="https://nina.vn" target="_blank" rel="noopener" color="inherit">
                MomUni Team
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
