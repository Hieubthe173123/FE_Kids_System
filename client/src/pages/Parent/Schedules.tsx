import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    borderRadius: '12px',
    backgroundColor: '#f4fbff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginTop: theme.spacing(3),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
        transform: 'scale(1.01)',
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: '#46a2da',
    borderRadius: '12px',
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        fontWeight: 700,
        fontSize: '1.1rem',
        color: '#ffffff',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#fff',
        transition: 'transform 0.3s ease-in-out',
    },
    '&.Mui-expanded .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(180deg)',
    },
}));

interface ScheduleItem {
    time: string;
    subject: string;
}

interface Props {
    title: string;
    panelKey: string;
    expanded: boolean;
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    scheduleData: { [key: string]: ScheduleItem[] };
    startOfWeekDate: string;
    holidays?: { [key: string]: string };
}

export default function Schedules({
    title,
    panelKey,
    expanded,
    onChange,
    scheduleData,
    startOfWeekDate,
    holidays = {},
}: Props) {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const startOfWeek = dayjs(startOfWeekDate);
    const weekDates = weekDays.map((_, idx) => startOfWeek.add(idx, 'day'));
    const timeSlots = useMemo(() => {
        const timeSet = new Set<string>();
        Object.values(scheduleData).forEach(dayItems => {
            dayItems.forEach(item => timeSet.add(item.time));
        });
        return Array.from(timeSet).sort();
    }, [scheduleData]);

    const isHolidayDay = (dayIdx: number) => {
        const dateStr = weekDates[dayIdx].format('YYYY-MM-DD');
        return holidays[dateStr];
    };

    return (
        <StyledAccordion expanded={expanded} onChange={onChange(panelKey)}>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #4194cb',
                        boxShadow: 'none',
                        bgcolor: '#f0f9ff',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#4194cb' }}>
                                <TableCell
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 700,
                                        minWidth: 110,
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        border: '1px solid #b3d3ea',
                                    }}
                                >
                                    ⏰ Thời gian
                                </TableCell>
                                {weekDays.map((day, idx) => (
                                    <TableCell
                                        key={day}
                                        sx={{
                                            color: '#fff',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                            verticalAlign: 'middle',
                                            padding: '8px 4px',
                                            border: '1px solid #b3d3ea',
                                        }}
                                    >
                                        <div style={{ fontSize: 13, color: '#e3f1fa', fontWeight: 600 }}>
                                            {weekDates[idx].format('DD/MM')}
                                        </div>
                                        <div style={{ fontSize: 16, color: '#fff', fontWeight: 700 }}>
                                            {day}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeSlots.map((time, index) => (
                                <TableRow
                                    key={time}
                                    sx={{ backgroundColor: index % 2 === 0 ? '#eaf6fd' : '#ffffff' }}
                                >
                                    <TableCell sx={{ textAlign: 'center', fontWeight: 500, color: '#0d47a1', border: '1px solid #b3d3ea' }}>
                                        {time}
                                    </TableCell>
                                    {weekDays.map((day, dayIdx) => {
                                        const holidayName = isHolidayDay(dayIdx);
                                        if (holidayName) {
                                            // Nếu là ngày nghỉ lễ, chỉ hiển thị tên ngày nghỉ lễ ở ô đầu tiên, các ô còn lại để trống
                                            return index === 0 ? (
                                                <TableCell
                                                    key={`${day}-${time}`}
                                                    rowSpan={timeSlots.length}
                                                    sx={{
                                                        textAlign: 'center',
                                                        fontWeight: 700,
                                                        color: '#d32f2f',
                                                        border: '1px solid #b3d3ea',
                                                        background: '#fff3e0',
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {holidayName}
                                                </TableCell>
                                            ) : null;
                                        }
                                        const activity = scheduleData[day]?.find(item => item.time === time);
                                        return (
                                            <TableCell
                                                key={`${day}-${time}`}
                                                sx={{
                                                    textAlign: 'center',
                                                    fontWeight: 500,
                                                    color: '#0d47a1',
                                                    border: '1px solid #b3d3ea',
                                                }}
                                            >
                                                {activity ? activity.subject : '—'}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </AccordionDetails>
        </StyledAccordion>
    );
}
