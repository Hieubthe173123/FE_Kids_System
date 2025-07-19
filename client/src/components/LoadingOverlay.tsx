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
                bgcolor: "rgba(255,255,255,0.6)",
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
            }}
        >
            <CircularProgress color="primary" size={60} />
            <Typography variant="h6" color="primary" mt={2}>{text}</Typography>
        </Box>
    );
};

export default LoadingOverlay;
