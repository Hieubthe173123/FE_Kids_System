import {
    Box,
    Paper,
    Typography,
    TextField,
    Grid,
    Button,
    Stack
} from "@mui/material";

export default function ContactInformationForm() {
    return (
        <Box sx={{ backgroundColor: "#f2fafe", py: 6 }}>
            <Box
                sx={{
                    maxWidth: 700,
                    mx: "auto"
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        border: "1px solid #E0D8CC",
                        backgroundColor: "#FFFCF8"
                    }}
                >
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{ fontWeight: 600, mb: 3 }}
                    >
                        Contact Information
                    </Typography>

                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                Address:
                            </Typography>
                            <TextField placeholder="Address" fullWidth />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Phone:
                                </Typography>
                                <TextField placeholder="Phone" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Email:
                                </Typography>
                                <TextField placeholder="Email" fullWidth />
                            </Grid>
                        </Grid>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                Description:
                            </Typography>
                            <TextField
                                placeholder="Description"
                                fullWidth
                                multiline
                                minRows={3}
                            />
                        </Box>
                    </Stack>
                </Paper>

                {/* Button */}
                <Box textAlign="center" mt={4}>
                    <Button
                        variant="contained"
                        sx={{
                            px: 8,
                            py: 1.2,
                            fontSize: "1rem",
                            backgroundColor: "#00B26F",
                            borderRadius: 999,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#009a61" }
                        }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
