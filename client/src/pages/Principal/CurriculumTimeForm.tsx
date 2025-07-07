import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function CurriculumTimeForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cài giờ hoạt động cố định</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          (Phần này sẽ hiển thị các hoạt động có <strong>activityFixed = true</strong> và cho phép gán giờ.)
        </Typography>
        {/* TODO: Thêm form chọn hoạt động và giờ tại đây */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" onClick={() => alert("Đã lưu giờ!")} autoFocus>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
