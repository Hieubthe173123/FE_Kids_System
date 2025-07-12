import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

const PRIMARY_COLOR = "#4194cb";
const BG_COLOR = "#f9f9f9";

export default function CurriculumTimeForm({
  open,
  onClose,
  ageFilter,
  setAgeFilter,
  activities,
  timeData,
  handleTimeChange,
  handleUpdate,
}: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredActivities = activities.filter((activity: any) => {
    const matchesAge =
      ageFilter === "Tất cả" ||
      activity.age === ageFilter ||
      activity.age === "Tất cả";
    const matchesSearch = activity.activityName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesAge && matchesSearch;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          width: "90vw",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: PRIMARY_COLOR,
          color: "white",
          fontWeight: "bold",
          fontSize: 20,
          px: 4,
          py: 2,
        }}
      >
        Cài giờ cho hoạt động cố định
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: BG_COLOR, py: 3, px: 0 }}>
        <Box display="flex">
          {/* Cột trái - menu độ tuổi */}
          <Box
            sx={{
              width: 220,
              borderRight: "1px solid #ddd",
              p: 2,
              bgcolor: "#fafafa",
              flexShrink: 0,
            }}
          >
            <Typography fontWeight={600} mb={1}>
              Chọn độ tuổi
            </Typography>
            {[1, 2, 3, 4, 5].map((age) => (
              <MenuItem
                key={age}
                selected={ageFilter === String(age)}
                onClick={() => setAgeFilter(String(age))}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  bgcolor:
                    ageFilter === String(age) ? "#e6f4ff" : "transparent",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                }}
              >
                Tuổi {age}
              </MenuItem>
            ))}
            <MenuItem
              selected={ageFilter === "Tất cả"}
              onClick={() => setAgeFilter("Tất cả")}
              sx={{
                borderRadius: 1,
                mt: 2,
                bgcolor: ageFilter === "Tất cả" ? "#e6f4ff" : "transparent",
              }}
            >
              Tất cả
            </MenuItem>
          </Box>

          <Box
            flex={1}
            sx={{
              px: 4,
              py: 3,
              height: "65vh",
              overflowY: "auto",
              pr: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Tìm kiếm hoạt động"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={vi}
            >
              {filteredActivities.map((activity: any) => {
                const timeItem = timeData.find(
                  (item: any) => item.activityId === activity._id
                );

                const startTime =
                  timeItem?.startTime ?? activity.startTime ?? null;
                const endTime = timeItem?.endTime ?? activity.endTime ?? null;

                return (
                  <Paper
                    key={activity._id}
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      border: "1px solid #ddd",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography fontWeight={600} fontSize={16}>
                      {activity.activityName}
                    </Typography>
                    <Box
                      display="flex"
                      gap={2}
                      flexDirection={{ xs: "column", sm: "row" }}
                    >
                      <TimePicker
                        label="Giờ bắt đầu"
                        value={startTime ? new Date(startTime) : null}
                        onChange={(newValue: any) =>
                          handleTimeChange(activity._id, "startTime", newValue)
                        }
                        sx={{ flex: 1 }}
                      />
                      <TimePicker
                        label="Giờ kết thúc"
                        value={endTime ? new Date(endTime) : null}
                        onChange={(newValue: any) =>
                          handleTimeChange(activity._id, "endTime", newValue)
                        }
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Paper>
                );
              })}
            </LocalizationProvider>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2, bgcolor: "#f1f1f1" }}>
        <Button variant="outlined" onClick={onClose}>
          Đóng
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          sx={{ bgcolor: PRIMARY_COLOR, color: "#fff" }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}
