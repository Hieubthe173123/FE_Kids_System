import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";

interface Student {
  _id: string;
  fullName: string;
  parent?: {
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
    job?: string;
  };
}

interface ParentInfoDialogProps {
  open: boolean;
  onClose: () => void;
  selectedStudent: Student | null;
}

const ParentInfoDialog = ({ open, onClose, selectedStudent }: ParentInfoDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Thông tin phụ huynh</DialogTitle>
      <DialogContent>
        {selectedStudent?.parent ? (
          <Box mt={2}>
            <Typography variant="h6">Học sinh: {selectedStudent.fullName}</Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6} {...({} as any)}>
                <Typography>
                  <b>Họ tên:</b> {selectedStudent.parent.fullName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} {...({} as any)}>
                <Typography>
                  <b>SĐT:</b> {selectedStudent.parent.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} {...({} as any)}>
                <Typography>
                  <b>Email:</b> {selectedStudent.parent.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} {...({} as any)}>
                <Typography>
                  <b>Nghề nghiệp:</b> {selectedStudent.parent.job}
                </Typography>
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <Typography>
                  <b>Địa chỉ:</b> {selectedStudent.parent.address}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography>Không có thông tin phụ huynh.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentInfoDialog;