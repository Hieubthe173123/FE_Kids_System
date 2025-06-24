import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../../services/AuthApi";

const evaluatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: "Yếu", color: "#e53935" };
    if (score <= 3) return { label: "Trung bình", color: "#f9a825" };
    return { label: "Mạnh", color: "#43a047" };
};

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [matchStatus, setMatchStatus] = useState<null | boolean>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email || localStorage.getItem("forgotPasswordEmail");

    const strength = evaluatePasswordStrength(newPassword);

    useEffect(() => {
        if (!confirmPassword) {
            setMatchStatus(null);
            return;
        }
        setMatchStatus(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            toast.warning("Vui lòng nhập đầy đủ mật khẩu.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const res = await resetPasswordApi(email, newPassword, confirmPassword);
            toast.success(res.message || "Đổi mật khẩu thành công!");
            localStorage.removeItem("forgotPasswordEmail");
            navigate("/sign-in");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const msg =
                error?.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu.";
            toast.error(msg);
        }
    };

    const handleBackToLogin = () => {
        localStorage.removeItem("forgotPasswordEmail");
        navigate("/sign-in");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f3faff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                overflow: "hidden",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        px: { xs: 3, sm: 5 },
                        py: 6,
                        borderRadius: "28px",
                        backgroundColor: "#fff",
                        boxShadow: "0 12px 36px rgba(70, 162, 218, 0.25)",
                        textAlign: "center",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                        <SchoolIcon sx={{ fontSize: 40, color: "#46a2da", mr: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#3982b8" }}>
                            Sakura School
                        </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#4194cb" }}>
                        Đặt lại mật khẩu
                    </Typography>
                    <Typography sx={{ color: "#555", mb: 4 }}>
                        Nhập mật khẩu mới cho tài khoản của bạn bên dưới.
                    </Typography>

                    <OutlinedInput
                        fullWidth
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        sx={{
                            mb: 1,
                            borderRadius: "16px",
                            backgroundColor: "#f4faff",
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

                    {newPassword && (
                        <Typography sx={{ color: strength.color, fontWeight: 600, mb: 2, textAlign: "left", pl: 1 }}>
                            Mức độ mật khẩu: {strength.label}
                        </Typography>
                    )}

                    <OutlinedInput
                        fullWidth
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        sx={{
                            mb: 1,
                            borderRadius: "16px",
                            backgroundColor: "#f4faff",
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

                    {confirmPassword && matchStatus !== null && (
                        <Typography
                            sx={{
                                color: matchStatus ? "#43a047" : "#e53935",
                                fontWeight: 600,
                                textAlign: "left",
                                pl: 1,
                                mb: 3,
                            }}
                        >
                            {matchStatus ? "Mật khẩu khớp ✔" : "Mật khẩu chưa khớp ✖"}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            background: "linear-gradient(to right, #46a2da, #4194cb)",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            py: 1.3,
                            fontSize: "1rem",
                            textTransform: "none",
                            "&:hover": {
                                background: "linear-gradient(to right, #3982b8, #46a2da)",
                            },
                        }}
                    >
                        Đổi mật khẩu
                    </Button>

                    <Typography sx={{ mt: 4, color: "#666" }}>
                        Quay về{" "}
                        <Box
                            component="span"
                            sx={{
                                cursor: "pointer",
                                color: "#e6687a",
                                fontWeight: "bold",
                                textDecoration: "none",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: "rgb(230,104,122)",
                                },
                            }}
                            onClick={handleBackToLogin}
                        >
                            trang đăng nhập
                        </Box>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default ResetPassword;
