import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const PRIMARY_COLOR = "#4194cb";

export default function CurriculumForm({
  open,
  onClose,
  onSubmit,
  editing,
  newActivity,
  setNewActivity,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editing: boolean;
  newActivity: any;
  setNewActivity: (val: any) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4, boxShadow: 6 } }}
    >
      <DialogTitle
        sx={{
          bgcolor: PRIMARY_COLOR,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 2,
          px: 3,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
        {editing ? "Cập nhật hoạt động" : "Thêm mới hoạt động"}
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, py: 3, backgroundColor: "#fafafa" }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Tên hoạt động"
            value={newActivity.activityName}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activityName: e.target.value })
            }
            fullWidth
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">Loại hoạt động</FormLabel>
            <RadioGroup
              row
              value={newActivity.activityFixed ? "fixed" : "normal"}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  activityFixed: e.target.value === "fixed",
                })
              }
            >
              <FormControlLabel value="normal" control={<Radio />} label="Thông thường" />
              <FormControlLabel value="fixed" control={<Radio />} label="Cố định" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Độ tuổi</InputLabel>
            <Select
              value={newActivity.age}
              label="Độ tuổi"
              onChange={(e) =>
                setNewActivity({ ...newActivity, age: e.target.value })
              }
            >
              {["1", "2", "3", "4", "5", "Tất cả"].map((age) => (
                <MenuItem key={age} value={age}>{age}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Số tiết học"
            type="number"
            value={newActivity.activityNumber}
            onChange={(e) =>
              setNewActivity({
                ...newActivity,
                activityNumber: Number(e.target.value),
              })
            }
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2.5, bgcolor: "#f5f5f5" }}>
        <Button onClick={onClose} variant="outlined">Huỷ</Button>
        <Button onClick={onSubmit} variant="contained" sx={{ backgroundColor: PRIMARY_COLOR }}>
          {editing ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
