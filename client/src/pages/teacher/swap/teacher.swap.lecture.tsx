import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import {
  getTeacherClass,
  getTeacherSwappableSchedule,
  swapSchedule,
} from "../../../services/teacher.service";

type Curriculum = {
  _id: string;
  activityName: string;
};

type ScheduleSlot = {
  time: string;
  curriculum: Curriculum;
  fixed: boolean;
};

export default function SwapSchedule() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [schedule1, setSchedule1] = useState<ScheduleSlot[]>([]);
  const [schedule2, setSchedule2] = useState<ScheduleSlot[]>([]);
  const [selectedTime1, setSelectedTime1] = useState("");
  const [selectedTime2, setSelectedTime2] = useState("");
  const [classId, setClassId] = useState<string>("");

  useEffect(() => {
    const fetchTeacherClass = async () => {
      const res = await getTeacherClass();
      if (res && res.length > 0) {
        setClassId(res[0]._id);
      }
    };
    fetchTeacherClass();
  }, []);

  const fetchSchedule = async (date: string, setSchedule: (data: ScheduleSlot[]) => void) => {
    if (!date) return;
    try {
      const res = await getTeacherSwappableSchedule(classId, date);
      const filtered = res.schedule.filter((slot: ScheduleSlot) => !slot.fixed);
      setSchedule(filtered);
    } catch (error) {
      console.error("Lỗi khi lấy lịch:", error);
    }
  };

  useEffect(() => {
    if (date1) fetchSchedule(date1, setSchedule1);
  }, [date1]);

  useEffect(() => {
    if (date2) fetchSchedule(date2, setSchedule2);
  }, [date2]);

  const isFutureDate = (inputDate: string) => {
    const today = new Date().toISOString().split("T")[0];
    return inputDate > today;
  };

  const handleSwap = async () => {
    if (!selectedTime1 || !selectedTime2 || !date1 || !date2) {
      return alert("Vui lòng chọn đầy đủ thông tin");
    }
    if (!isFutureDate(date1) || !isFutureDate(date2)) {
      return alert("Chỉ được đổi tiết trong các ngày tương lai");
    }

    try {
      await swapSchedule({
        classId,
        date1,
        date2,
        time1: selectedTime1,
        time2: selectedTime2,
      });

      alert("Đổi tiết thành công");
      setSelectedTime1("");
      setSelectedTime2("");
      fetchSchedule(date1, setSchedule1);
      fetchSchedule(date2, setSchedule2);
    } catch (error) {
      alert("Đổi tiết thất bại");
      console.error(error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Đổi tiết học giữa hai ngày
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#f9fbfc", boxShadow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} {...({} as any)}>
            <Typography fontWeight={600}>Ngày 1</Typography>
            <input
              type="date"
              value={date1}
              onChange={(e) => {
                setDate1(e.target.value);
                setSelectedTime1("");
              }}
              style={{ marginTop: 4, width: "100%", padding: 8 }}
            />

            {schedule1.length > 0 && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Chọn tiết học</InputLabel>
                <Select
                  value={selectedTime1}
                  label="Chọn tiết học"
                  onChange={(e) => setSelectedTime1(e.target.value)}
                >
                  {schedule1.map((slot) => (
                    <MenuItem key={slot.time} value={slot.time}>
                      {slot.time} - {slot.curriculum.activityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          <Grid item xs={12} sm={6} {...({} as any)}>
            <Typography fontWeight={600}>Ngày 2</Typography>
            <input
              type="date"
              value={date2}
              onChange={(e) => {
                setDate2(e.target.value);
                setSelectedTime2("");
              }}
              style={{ marginTop: 4, width: "100%", padding: 8 }}
            />

            {schedule2.length > 0 && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Chọn tiết học</InputLabel>
                <Select
                  value={selectedTime2}
                  label="Chọn tiết học"
                  onChange={(e) => setSelectedTime2(e.target.value)}
                >
                  {schedule2.map((slot) => (
                    <MenuItem key={slot.time} value={slot.time}>
                      {slot.time} - {slot.curriculum.activityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>

        <Stack mt={4} direction="row" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleSwap}
            disabled={!selectedTime1 || !selectedTime2}
          >
            Đổi tiết
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
