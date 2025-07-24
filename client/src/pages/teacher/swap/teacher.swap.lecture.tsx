import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Grid, Paper, Stack, CircularProgress,
  Snackbar, Alert, Card, CardContent, Dialog, DialogActions,
  DialogContent, DialogTitle, DialogContentText, Container, Divider,
  Chip, CssBaseline, ThemeProvider, createTheme
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BackspaceIcon from '@mui/icons-material/Backspace';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult, DraggableStateSnapshot } from "@hello-pangea/dnd";
import {
  getTeacherClass,
  getTeacherSwappableSchedule,
  swapSchedule,
} from "../../../services/teacher.service";

type Curriculum = { _id: string; activityName: string };
type ScheduleSlot = { time: string; curriculum: Curriculum; fixed: boolean };

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4194cb',
      light: 'rgba(65, 148, 203, 0.1)',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e0e0e0'
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
        },
      },
    },
  },
});

import type { Theme } from "@mui/material/styles";
import LoadingOverlay from "../../../components/LoadingOverlay";

const getCardStyle = (snapshot: DraggableStateSnapshot, isStaged: boolean) => {
  if (snapshot.isDropAnimating) {
    return { visibility: 'hidden' };
  }
  return {
    opacity: isStaged ? 0.5 : 1,
    cursor: isStaged ? 'not-allowed' : 'grab',
    transition: 'opacity 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
      transform: isStaged ? 'none' : 'translateY(-2px)',
      boxShadow: (theme: Theme) => isStaged ? 'none' : theme.shadows[4],
    },
  };
};

export default function SwapSchedule() {
  const [date1, setDate1] = useState<Dayjs | null>(null);
  const [date2, setDate2] = useState<Dayjs | null>(null);
  const [schedule1, setSchedule1] = useState<ScheduleSlot[]>([]);
  const [schedule2, setSchedule2] = useState<ScheduleSlot[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [classId, setClassId] = useState<string>("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" } | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [stagedSlot1, setStagedSlot1] = useState<ScheduleSlot | null>(null);
  const [stagedSlot2, setStagedSlot2] = useState<ScheduleSlot | null>(null);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTeacherClass = async () => {
      setLoading(true);
      const res = await getTeacherClass();
      if (res && res.data.classes.length > 0) {
        setClassId(res.data.classes[0]._id)

      };
      setLoading(false);
    };
    fetchTeacherClass();
  }, []);

  const fetchSchedule = async (
    date: Dayjs | null,
    setSchedule: (data: ScheduleSlot[]) => void,
    setLoading: (loading: boolean) => void,
    resetStaged: () => void
  ) => {
    resetStaged();
    if (!date || !classId) {
      setSchedule([]);
      return;
    }
    setLoading(true);
    setSchedule([]);
    try {
      const dateString = date.format("YYYY-MM-DD");
      setLoading(true);
      const res = await getTeacherSwappableSchedule(classId, dateString);
      setLoading(false);
      setSchedule(res.schedule.filter((slot: ScheduleSlot) => !slot.fixed));
    } catch (error) {
      setSnackbar({ open: true, message: "Lấy lịch học thất bại", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedule(date1, setSchedule1, setLoading1, () => setStagedSlot1(null)); }, [date1, classId]);
  useEffect(() => { fetchSchedule(date2, setSchedule2, setLoading2, () => setStagedSlot2(null)); }, [date2, classId]);

  const handleSwap = async () => {
    if (!stagedSlot1 || !stagedSlot2 || !date1 || !date2) return;
    try {
      setLoading(true);
      await swapSchedule({
        classId,
        date1: date1.format("YYYY-MM-DD"),
        date2: date2.format("YYYY-MM-DD"),
        time1: stagedSlot1.time,
        time2: stagedSlot2.time,
      });
      setLoading(false);
      setSnackbar({ open: true, message: "Đổi lịch học thành công!", severity: "success" });
      fetchSchedule(date1, setSchedule1, setLoading1, () => setStagedSlot1(null));
      fetchSchedule(date2, setSchedule2, setLoading2, () => setStagedSlot2(null));
    } catch (error) {
      setLoading(false);
      setSnackbar({ open: true, message: "Đổi lịch học thất bại. Vui lòng thử lại.", severity: "error" });
    } finally {
      setLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.droppableId === "swap-zone-1" && source.droppableId === "schedule1") {
      setStagedSlot1(schedule1[source.index]);
    } else if (destination.droppableId === "swap-zone-2" && source.droppableId === "schedule2") {
      setStagedSlot2(schedule2[source.index]);
    }
  };

  const handleCloseDialog = () => setOpenConfirmDialog(false);
  const handleCloseSnackbar = () => { if (snackbar) setSnackbar({ ...snackbar, open: false }); };

  const renderScheduleColumn = (schedule: ScheduleSlot[], droppableId: string, loading: boolean, stagedSlot: ScheduleSlot | null) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}><CircularProgress /></Stack>
      ) : (
        <Droppable droppableId={droppableId} isDropDisabled={!!stagedSlot}>
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef} sx={{ flexGrow: 1, p: 1.5, borderRadius: 2 }}>
              {schedule.length > 0 ? (
                schedule.map((slot, index) => {
                  const isStaged = stagedSlot?.time === slot.time;
                  return (
                    <Draggable key={`${droppableId}-${slot.time}`} draggableId={`${droppableId}-${slot.time}`} index={index} isDragDisabled={isStaged}>
                      {(provided, snapshot) => (
                        <Card {...({} as any)} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} elevation={0} sx={{ ...getCardStyle(snapshot, isStaged), mb: 2 }}>
                          <CardContent sx={{ p: '12px !important' }}>
                            <Chip label={slot.time} color="primary" variant="outlined" size="small" sx={{ mb: 1 }} />
                            <Typography variant="body2">{slot.curriculum.activityName}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  );
                })
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', minHeight: 300 }}>
                  <Typography variant="body2" color="text.secondary">Chưa có lịch để đổi</Typography>
                </Stack>
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      )}
    </Box>
  );

  const renderSwapZoneSlot = (droppableId: string, stagedSlot: ScheduleSlot | null, label: string) => (
    <Droppable droppableId={droppableId} isDropDisabled={!!stagedSlot}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef} {...provided.droppableProps}
          sx={{
            p: 2, borderRadius: 2, border: '2px dashed',
            borderColor: snapshot.isDraggingOver ? 'primary.main' : 'grey.300',
            bgcolor: snapshot.isDraggingOver ? 'primary.light' : 'transparent',
            height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s ease',
          }}
        >
          {stagedSlot ? (
            <Stack alignItems="center" spacing={1}>
              <Card elevation={0}>
                <CardContent sx={{ p: '12px !important' }}>
                  <Chip label={stagedSlot.time} color="primary" size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2">{stagedSlot.curriculum.activityName}</Typography>
                </CardContent>
              </Card>
              <Button size="small" variant="text" color="error" startIcon={<BackspaceIcon />} onClick={() => (droppableId === "swap-zone-1" ? setStagedSlot1(null) : setStagedSlot2(null))}>
                Bỏ chọn
              </Button>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              Kéo tiết học {label} vào đây
            </Typography>
          )}
        </Box>
      )}
    </Droppable>
  );

  return (
    <ThemeProvider theme={customTheme}>
      {loading && <LoadingOverlay />}
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <DragDropContext onDragEnd={onDragEnd}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h4" fontWeight={700}>Đổi Lịch Học</Typography>
              </Box>
              <Alert severity="info" icon={<InfoOutlinedIcon fontSize="inherit" />} sx={{ borderRadius: 2 }}>
                <b>Hướng dẫn:</b> Kéo một tiết học từ mỗi cột vào "Khu Vực Đổi Lịch". Nhấn nút "Thực hiện đổi lịch" để xác nhận.
              </Alert>

              <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
                <Grid item xs={12} lg={4} {...({} as any)}>
                  <Paper sx={{ borderRadius: 3, bgcolor: 'white' }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
                      <CalendarMonthIcon color="primary" />
                      <DatePicker label="Lịch ngày đầu tiên" value={date1} onChange={(d) => setDate1(d as Dayjs | null)} disablePast format="DD/MM/YYYY" sx={{ flexGrow: 1 }} />
                    </Stack>
                    <Divider />
                    {renderScheduleColumn(schedule1, "schedule1", loading1, stagedSlot1)}
                  </Paper>
                </Grid>

                <Grid item xs={12} lg={4} {...({} as any)}>
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'white', position: 'sticky', top: '24px' }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" fontWeight={600} align="center">Khu Vực Đổi Lịch</Typography>
                      {renderSwapZoneSlot("swap-zone-1", stagedSlot1, `từ ngày ${date1 ? date1.format("DD/MM") : '...'}`)}
                      <Stack alignItems="center"><SwapHorizIcon color="disabled" /></Stack>
                      {renderSwapZoneSlot("swap-zone-2", stagedSlot2, `từ ngày ${date2 ? date2.format("DD/MM") : '...'}`)}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!stagedSlot1 || !stagedSlot2}
                        onClick={() => setOpenConfirmDialog(true)}
                        sx={{ mt: 2 }}
                      >
                        Thực hiện đổi lịch
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} lg={4} {...({} as any)}>
                  <Paper sx={{ borderRadius: 3, bgcolor: 'white' }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
                      <CalendarMonthIcon sx={{ color: '#673ab7' }} />
                      <DatePicker label="Lịch ngày thứ hai" value={date2} onChange={(d) => setDate2(d as Dayjs | null)} disablePast format="DD/MM/YYYY" sx={{ flexGrow: 1 }} />
                    </Stack>
                    <Divider />
                    {renderScheduleColumn(schedule2, "schedule2", loading2, stagedSlot2)}
                  </Paper>
                </Grid>
              </Grid>
            </Stack>

            <Dialog open={openConfirmDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 3 } }}>
              <DialogTitle fontWeight={600}>Xác nhận đổi lịch học</DialogTitle>
              <DialogContent>
                {stagedSlot1 && stagedSlot2 && (
                  <DialogContentText>
                    Bạn có chắc chắn muốn đổi tiết <b>"{stagedSlot1.curriculum.activityName}"</b> với tiết <b>"{stagedSlot2.curriculum.activityName}"</b> không?
                  </DialogContentText>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCloseDialog} color="inherit">Hủy bỏ</Button>
                <Button onClick={handleSwap} variant="contained" autoFocus>Xác nhận</Button>
              </DialogActions>
            </Dialog>

            <Snackbar open={snackbar?.open} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <Alert onClose={handleCloseSnackbar} severity={snackbar?.severity} variant="filled" sx={{ width: '100%', boxShadow: 6 }}>
                {snackbar?.message}
              </Alert>
            </Snackbar>
          </Container>
        </DragDropContext>
      </LocalizationProvider>
    </ThemeProvider>
  );
}