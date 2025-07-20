import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingOverlayProps {
    text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = "Đang xử lý..." }) => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
                background: `linear-gradient(120deg, #e3f2fd 0%, #fffde4 100%)`,
                backdropFilter: "blur(6px)",
                animation: "fadeIn 0.5s",
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2,
                    p: 4,
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(65,148,203,0.15)',
                    background: 'rgba(255,255,255,0.7)',
                    minWidth: 220,
                    animation: 'fadeIn 0.7s',
                }}
            >
                <Box sx={{ position: 'relative', width: 70, height: 70 }}>
                    <CircularProgress
                        size={70}
                        thickness={5}
                        sx={{
                            color: '#4194cb',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            animation: 'spin 1.2s linear infinite',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                            }
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e6687a 0%, #4194cb 100%)',
                            boxShadow: '0 2px 8px rgba(65,148,203,0.15)',
                        }}
                    />
                </Box>
                <Typography variant="h6" color="primary" mt={2} sx={{ fontWeight: 600, letterSpacing: 1, textShadow: '0 2px 8px #e3f2fd' }}>
                    {text}
                </Typography>
            </Box>
        </Box>
    );
};

export default LoadingOverlay;
