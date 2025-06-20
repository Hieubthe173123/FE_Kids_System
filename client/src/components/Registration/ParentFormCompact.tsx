import { useState } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stack
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

export default function ParentFormCompact() {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : "");
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f2fafe",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 6
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    minHeight: 640,
                    width: 450,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#FFFCF8",
                    border: "1px solid #E0D8CC"
                }}
            >
                <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 3 }}>
                    Parent Information
                </Typography>

                <Stack spacing={2}>
                    <TextField label="Name" fullWidth placeholder="Student Name" />
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Gender:
                        </Typography>
                        <RadioGroup row defaultValue="male">
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </Box>
                    <TextField
                        label="Date of birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <TextField label="ID Card" fullWidth />

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Upload parent image:
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 1,
                                    backgroundColor: "#F0F0F0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <PhotoCamera sx={{ color: "#999", fontSize: 30 }} />
                            </Box>
                            <Stack spacing={0.5}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{ color: "#00B26F", borderColor: "#00B26F" }}
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <Typography variant="body2" color="text.secondary">
                                    {fileName || "No File Chosen"}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            Image size less than 100KB
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                px: 4,
                                backgroundColor: "#00B26F",
                                textTransform: "none",
                                borderRadius: 2,
                                "&:hover": { backgroundColor: "#009a61" }
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
