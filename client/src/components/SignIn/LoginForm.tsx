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

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

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
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            error={emailError}
                            helperText={emailErrorMessage}
                            placeholder="your@email.com"
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
