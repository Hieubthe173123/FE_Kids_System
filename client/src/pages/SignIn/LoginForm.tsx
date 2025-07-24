import {
    Box,
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROLE } from "../../constants/roles";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getUser, login } from "../../redux/auth/authAPI";
import { useAppSelector } from "../../hooks/useAppSelector";

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);

    const handleLogin = async () => {
        try {
            const resultAction = await dispatch(login({ username, password }));

            if (login.fulfilled.match(resultAction)) {
                const getUserResult = await dispatch(getUser());
                if (getUser.fulfilled.match(getUserResult)) {
                    const userData = getUserResult.payload;

                    if (!userData) {
                        toast.error("Không xác định được thông tin người dùng!");
                        return;
                    }
                    toast.success(`Xin chào ${userData.account.role}! 🎉`);

                    const navigateByRole = (role: string): string => {
                        const normalized = role.toLowerCase();
                        switch (normalized) {
                            case ROLE.ADMIN:
                                return "/admin-home";
                            case ROLE.PRINCIPAL:
                                return "/principal-home";
                            case ROLE.TEACHER:
                                return "/teacher-home";
                            case ROLE.PARENT:
                                return "/parent-home";
                            default:
                                return "/";
                        }
                    };
                    navigate(navigateByRole(userData.account.role));
                }
            } else if (login.rejected.match(resultAction)) {
                const errorMsg = resultAction.payload as string;
                toast.error(errorMsg);
                setPasswordError(true);
                setPasswordErrorMessage(errorMsg);
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra khi đăng nhập");
        }
    };

    const navigateToForgot = () => {
        navigate("/forgot-password");
    };

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
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                    <SchoolIcon sx={{ fontSize: "2.5rem", color: "#46a2da", mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#4194cb" }}>
                        Sakura School
                    </Typography>
                </Box>

                <form
                    style={{ width: "100%" }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <Stack spacing={2}>
                        <TextField
                            label="Username"
                            type="text"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
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
                    </Stack>

                    <FormControlLabel
                        control={<Checkbox value="remember" sx={{ color: "#46a2da" }} />}
                        label="Remember me"
                        sx={{ mt: 1 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        disabled={loading}
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
                        type="submit"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập vào Sakura"}
                    </Button>
                </form>

                <Link
                    component="button"
                    variant="body2"
                    sx={{ alignSelf: "flex-end", mt: 1, color: "#e6687a" }}
                    onClick={navigateToForgot}
                >
                    Quên mật khẩu?
                </Link>

                <ToastContainer position="top-right" autoClose={3000} />
            </Card>
        </Box>
    );
};

export default LoginForm;
