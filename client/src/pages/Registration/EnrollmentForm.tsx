import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import ParentFormCompact from "./ParentFormCompact";
import StudentFormCompact from "./StudentFormCompact";

export default function EnrollmentForm() {
    return (
        <Box sx={{ p: { xs: 2, md: 6 }, backgroundColor: "#f2fafe", minHeight: "100vh" }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
                Registration Form
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                <StudentFormCompact />
                <ParentFormCompact />
            </Grid>
        </Box>
    );
}
