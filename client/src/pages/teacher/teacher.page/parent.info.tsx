import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

interface Student {
  _id: string;
  fullName: string;
  parent?: {
    fullName: string;
    phoneNumber?: string;
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: 4, bgcolor: '#f9fbfc', minHeight: 480 } }}>
      <DialogTitle sx={{ fontWeight: 700, color: '#4194cb', display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon sx={{ color: '#4194cb', mr: 1 }} /> Thông tin phụ huynh
      </DialogTitle>
      <DialogContent>
        {selectedStudent?.parent ? (
          <Box mt={2} sx={{ p: 3, bgcolor: '#fff', borderRadius: 3, borderLeft: '6px solid #46a2da', boxShadow: 1, minHeight: 320 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0d47a1', mb: 3 }}>
              👶 Học sinh: <b>{selectedStudent.fullName}</b>
            </Typography>
            <Grid container spacing={50} alignItems="flex-start">
              <Grid item xs={12} md={6} {...({} as any)}>
                <Box mb={3}>
                  <Typography fontSize={15} mb={2}><b>Họ tên:</b> {selectedStudent.parent.fullName}</Typography>
                  <Typography fontSize={15} mb={2}><b>SĐT:</b> {selectedStudent.parent.phoneNumber}</Typography>
                  <Typography fontSize={15}><b>Email:</b> {selectedStudent.parent.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <Box mb={3}>
                  <Typography fontSize={15} mb={2}><b>Nghề nghiệp:</b> {selectedStudent.parent.job}</Typography>
                  <Typography fontSize={15}><b>Địa chỉ:</b> {selectedStudent.parent.address}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography sx={{ color: '#e6687a', fontWeight: 600 }}>Không có thông tin phụ huynh.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#4194cb', color: '#fff', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: '#1976d2' } }}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentInfoDialog;