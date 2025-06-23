import {
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    FormControlLabel,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../helper/axiosInstance";
import { getUserFromToken } from "../../helper/authHelper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROLE } from "../../constants/roles";

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    console.log(setPasswordError, setPasswordErrorMessage, setUsername);
    console.log(username);



    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post("auth/login", {
                username,
                password,
            });

            const accessToken = response.data.accessToken;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                const userData = getUserFromToken(accessToken);

                console.log("User data from token:", userData);

                if (!userData || !userData.role) {
                    toast.error("Không xác định được role người dùng!");
                    return;
                }

                toast.success(`Xin chào ${userData.role}! 🎉`);
                console.log(userData.role);

                const navigateByRole = (role: string): string => {
                    const normalized = role.toLowerCase();
                    switch (normalized) {
                        case ROLE.ADMIN:
                            return "/admin-home";
                        case ROLE.PRINCIPAL:
                            return "/schoolprincipal-home";
                        case ROLE.TEACHER:
                            return "/teacher-home";
                        case ROLE.PARENT:
                            return "/parent-home";
                        default:
                            return "/";
                    }
                };
                navigate(navigateByRole(userData.role));
            } else {
                toast.error("Không nhận được accessToken từ server");
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            const errorMsg = error.response?.data?.message || "Đăng nhập thất bại";

            if (error.response?.status === 401) {
                setPasswordError(true);
                setPasswordErrorMessage(errorMsg);
            } else {
                toast.error(errorMsg);
            }
        }
    };


    const navigateToForgot = () => {
        navigate("/forgot-password");
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                    width: "100%",
                    maxWidth: 460,
                    px: 5,
                    py: 6,
                    gap: 3,
                    boxShadow: "0px 12px 28px rgba(57, 130, 184, 0.15)",
                    borderRadius: "20px",
                    backgroundColor: "#fff",
                    border: "1px solid #3982b8",
                }}
            >
                {/* Logo Header */}
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                    <SchoolIcon sx={{ fontSize: "2.5rem", color: "#46a2da", mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#4194cb" }}>
                        Sakura School
                    </Typography>
                </Box>

                {/* Form fields */}
                <form style={{ width: "100%" }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            type="text"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            // error={emailError}
                            // helperText={emailErrorMessage}
                            // placeholder="your@email.com"
                            required
                            InputProps={{ style: { borderRadius: "12px" } }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            placeholder="••••••"
                            InputProps={{ style: { borderRadius: "12px" } }}
                        />
                        <Link
                            component="button"
                            variant="body2"
                            sx={{ alignSelf: "flex-end", mt: 1, color: "#e6687a" }}
                            onClick={navigateToForgot}
                        >
                            Forgot Password?
                        </Link>
                    </Stack>

                    <FormControlLabel
                        control={<Checkbox value="remember" sx={{ color: "#46a2da" }} />}
                        label="Remember me"
                        sx={{ mt: 1 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            mt: 3,
                            py: 1.5,
                            borderRadius: "12px",
                            fontSize: "1rem",
                            backgroundColor: "#46a2da",
                            textTransform: "none",
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: "#3982b8"
                            }
                        }}
                    >
                        Đăng nhập vào Sakura
                    </Button>
                </form>

                <ToastContainer position="top-right" autoClose={3000} />


                <Divider sx={{ my: 2, color: "#bbb" }}>hoặc</Divider>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        // startIcon={<GoogleIcon />}
                        sx={{
                            borderRadius: "12px",
                            py: 1.5,
                            color: "#e6687a",
                            borderColor: "#e6687a",
                            textTransform: "none",
                            fontWeight: 500,
                            '&:hover': {
                                backgroundColor: "#fdecef",
                                borderColor: "#e6687a"
                            }
                        }}
                    >
                        Đăng nhập bằng Google
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

export default LoginForm;
