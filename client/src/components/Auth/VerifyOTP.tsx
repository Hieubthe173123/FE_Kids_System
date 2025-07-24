import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    useMediaQuery,
    useTheme,
    Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import SchoolIcon from "@mui/icons-material/School";
import { verifyOTPApi, forgotPasswordApi } from "../../services/AuthApi";

const OTP_LENGTH = 6;

const VerifyOTP = () => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || localStorage.getItem("forgotPasswordEmail");

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        const currentOtp = newOtp.join("");
        if (currentOtp.length === OTP_LENGTH && newOtp.every((digit) => digit !== "")) {
            verifyOtpCode(currentOtp);
        }
    };

    const verifyOtpCode = async (otpCode: string) => {
        if (isVerifying) return;
        setIsVerifying(true);
        try {
            const res = await verifyOTPApi(otpCode);
            toast.success("Xác thực thành công!");

            setTimeout(() => {
                navigate("/reset-password", {
                    state: {
                        email,
                        accountId: res.accountId,
                    },
                });
            }, 2000);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Xác thực thất bại!";
            toast.error(msg);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Không tìm thấy email để gửi lại OTP");
            return;
        }

        try {
            await forgotPasswordApi(email);
            toast.success("Mã OTP mới đã được gửi lại!");
            setOtp(Array(OTP_LENGTH).fill(""));
            setCountdown(60);
            setCanResend(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Gửi lại OTP thất bại!";
            toast.error(msg);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(to bottom right, #e3f4fd, #ffffff)",
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={12}
                    sx={{
                        py: 6,
                        px: { xs: 3, sm: 6 },
                        borderRadius: "32px",
                        textAlign: "center",
                        background: "#fff",
                        boxShadow: "0 16px 40px rgba(70, 162, 218, 0.25)",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                        <SchoolIcon sx={{ fontSize: 40, color: "#46a2da", mr: 1 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: "#3982b8",
                                fontFamily: "'Quicksand', sans-serif",
                            }}
                        >
                            Sakura School
                        </Typography>
                    </Box>
                    <ToastContainer />
                    <Typography variant="h4" sx={{ color: "#4194cb", fontWeight: "bold", mb: 1 }}>
                        Nhập mã xác thực
                    </Typography>
                    <Typography sx={{ color: "#555", mb: 4 }}>
                        Mã OTP đã gửi đến email. Vui lòng nhập 6 chữ số bên dưới.
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
                        {otp.map((digit, index) => (
                            <Box
                                key={index}
                                component="input"
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => { inputRefs.current[index] = el as HTMLInputElement | null; }}
                                sx={{
                                    width: isMobile ? 40 : 52,
                                    height: isMobile ? 48 : 60,
                                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                                    textAlign: "center",
                                    borderRadius: "16px",
                                    border: "2px solid #46a2da",
                                    boxShadow: "0 4px 12px rgba(70,162,218,0.15)",
                                    transition: "0.3s",
                                    outline: "none",
                                    "&:focus": {
                                        borderColor: "#3982b8",
                                        boxShadow: "0 0 0 3px rgba(70,162,218,0.25)",
                                    },
                                }}

                            />
                        ))}
                    </Box>

                    <Button
                        disabled={!canResend}
                        onClick={handleResendOtp}
                        sx={{
                            background: canResend
                                ? "linear-gradient(to right, #e6687a, rgb(230,104,122))"
                                : "#ccc",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            px: 4,
                            py: 1.2,
                            fontSize: "1rem",
                            textTransform: "none",
                            boxShadow: canResend ? "0 4px 12px rgba(230,104,122,0.3)" : "none",
                            "&:hover": {
                                background: canResend
                                    ? "linear-gradient(to right, #e6687a, #d45768)"
                                    : "#ccc",
                            },
                        }}
                    >
                        {canResend ? "Gửi lại mã" : `Gửi lại sau ${countdown}s`}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default VerifyOTP;
