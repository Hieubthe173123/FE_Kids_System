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
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                background: "none",
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2,
                    p: 3,
                    borderRadius: 4,
                    boxShadow: '0 4px 16px rgba(65,148,203,0.12)',
                    background: 'rgba(255,255,255,0.95)',
                    minWidth: 180,
                }}
            >
                <CircularProgress size={48} thickness={5} sx={{ color: '#4194cb' }} />
                <Typography variant="h6" color="primary" mt={2} sx={{ fontWeight: 600, letterSpacing: 1 }}>
                    {text}
                </Typography>
            </Box>
        </Box>
    );
};

export default LoadingOverlay;
