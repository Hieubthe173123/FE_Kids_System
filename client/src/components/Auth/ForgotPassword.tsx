import {
    Box,
    Button,
    OutlinedInput,
    Typography,
    Paper
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

const ForgotPassword = () => {
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                background: "linear-gradient(to right, #e3f4fd, #ffffff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth: "960px",
                    borderRadius: "28px",
                    overflow: "hidden",
                    display: "flex",
                    minHeight: 480,
                    boxShadow: "0px 16px 48px rgba(70, 162, 218, 0.2)",
                }}
            >
                {/* Left side image or illustration */}
                <Box
                    sx={{
                        width: "50%",
                        background: "linear-gradient(to bottom right, #46a2da, #4194cb)",
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                        p: 4,
                    }}
                >
                    <Box
                        component="img"
                        src="/1.jpg"
                        alt="forgot password illustration"
                        sx={{ maxWidth: "100%", maxHeight: "360px" }}
                    />
                </Box>

                {/* Right side form */}
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        backgroundColor: "#ffffff",
                        p: { xs: 4, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <SchoolIcon sx={{ fontSize: 40, color: "#46a2da", mr: 1 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "bold",
                                color: "#3982b8",
                                fontFamily: "'Quicksand', sans-serif",
                            }}
                        >
                            Sakura School
                        </Typography>
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: "#4194cb",
                            fontSize: "1.6rem",
                        }}
                    >
                        Quên mật khẩu?
                    </Typography>

                    <Typography sx={{ color: "#666", mb: 3, fontSize: "0.95rem" }}>
                        Nhập email đã đăng ký để nhận mã xác thực OTP và đặt lại mật khẩu của bạn.
                    </Typography>

                    <OutlinedInput
                        fullWidth
                        placeholder="Email của bạn"
                        required
                        sx={{
                            backgroundColor: "#f4faff",
                            borderRadius: "12px",
                            color: "#333",
                            mb: 2,
                            fontSize: "1rem",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#46a2da",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#4194cb",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3982b8",
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "#46a2da",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            textTransform: "none",
                            py: 1.3,
                            mt: 1,
                            "&:hover": {
                                backgroundColor: "#3982b8",
                            },
                        }}
                    >
                        Gửi mã OTP
                    </Button>

                    <Typography sx={{ color: "#888", fontSize: "0.9rem", mt: 3 }}>
                        Nhớ mật khẩu rồi?{" "}
                        <Box
                            component="a"
                            href="/sign-in"
                            sx={{
                                color: "#e6687a",
                                fontWeight: "bold",
                                textDecoration: "none",
                                ml: 0.5,
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "rgb(230,104,122)",
                                },
                            }}
                        >
                            Đăng nhập
                        </Box>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
