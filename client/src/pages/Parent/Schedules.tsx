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

import dayjs from 'dayjs';

interface Props {
    title: string;
    panelKey: string;
    expanded: boolean;
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    scheduleData: { [key: string]: ScheduleItem[] };
    startOfWeekDate: string;
}

export default function Schedules({ title, panelKey, expanded, onChange, scheduleData, startOfWeekDate }: Props) {
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const startOfWeek = dayjs(startOfWeekDate);
    const weekDates = weekDays.map((_, idx) => startOfWeek.add(idx, 'day'));

    const timeSlots = useMemo(() => {
        const allTimes = new Set<string>();
        Object.values(scheduleData).forEach(dayActivities => {
            dayActivities.forEach(activity => {
                allTimes.add(activity.time);
            });
        });
        return Array.from(allTimes).sort();
    }, [scheduleData]);

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
                                <TableCell sx={{ color: '#fff', fontWeight: 700, minWidth: 110, textAlign: 'center', verticalAlign: 'middle' }}>⏰ Thời gian</TableCell>
                                {weekDays.map((day, idx) => (
                                    <TableCell
                                        key={day}
                                        sx={{
                                            color: '#fff', fontWeight: 700, textAlign: 'center', verticalAlign: 'middle', padding: '8px 4px',
                                        }}
                                    >
                                        <div style={{ fontSize: 13, color: '#e3f1fa', fontWeight: 600, lineHeight: 1.1 }}>
                                            {weekDates[idx].date().toString().padStart(2, '0')}/{(weekDates[idx].month() + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div style={{ fontSize: 16, color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
                                            {day}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeSlots.map((time, index) => (
                                <TableRow key={time} sx={{ backgroundColor: index % 2 === 0 ? '#eaf6fd' : '#ffffff' }}>
                                    <TableCell sx={{ fontWeight: 500, borderBottom: '1px solid #d1eaf5', textAlign: 'center' }}>{time}</TableCell>
                                    {weekDays.map(day => {
                                        const activity = scheduleData[day]?.find(item => item.time === time);
                                        return (
                                            <TableCell key={`${day}-${time}`} sx={{ borderBottom: '1px solid #d1eaf5', textAlign: 'center', fontWeight: 500, color: '#0d47a1' }}>
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