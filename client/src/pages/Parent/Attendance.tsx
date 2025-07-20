import { useMemo } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';

interface AttendanceRecord {
    _id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    checkInTime?: string;
    checkOutTime?: string;
    note?: string;
}

interface AttendanceProps {
    weekDates: dayjs.Dayjs[];
    attendanceData: AttendanceRecord[];
}

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RemoveIcon from '@mui/icons-material/Remove';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import DescriptionIcon from '@mui/icons-material/Description';

const renderAttendanceStatus = (att?: AttendanceRecord) => {
    if (!att)
        return <RemoveIcon sx={{ color: '#bdbdbd', verticalAlign: 'middle' }} titleAccess="Không có dữ liệu" />;
    if (att.status === 'absent')
        return <span title={att.note || ''}><CancelIcon sx={{ color: '#e53935', verticalAlign: 'middle' }} /> <span style={{ color: '#e53935', fontWeight: 600 }}>Vắng</span></span>;
    if (att.status === 'present')
        return <span><CheckCircleIcon sx={{ color: '#43a047', verticalAlign: 'middle' }} /> <span style={{ color: '#43a047', fontWeight: 600 }}>Có mặt</span></span>;
    if (att.status === 'late')
        return <span title={att.note || ''}><AccessTimeIcon sx={{ color: '#ffa726', verticalAlign: 'middle' }} /> <span style={{ color: '#ffa726', fontWeight: 600 }}>Đi muộn</span></span>;
    if (att.status === 'sick')
        return <span title={att.note || ''}><SentimentDissatisfiedIcon sx={{ color: '#fbc02d', verticalAlign: 'middle' }} /> <span style={{ color: '#fbc02d', fontWeight: 600 }}>Ốm</span></span>;
    if (att.status === 'leave')
        return <span title={att.note || ''}><DescriptionIcon sx={{ color: '#1976d2', verticalAlign: 'middle' }} /> <span style={{ color: '#1976d2', fontWeight: 600 }}>Nghỉ phép</span></span>;
    return <RemoveIcon sx={{ color: '#bdbdbd', verticalAlign: 'middle' }} titleAccess="Không có dữ liệu" />;
};

const getVietnameseDay = (dayIndex: number) => {
    return ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayIndex];
}

export default function AttendanceTable({ weekDates, attendanceData }: AttendanceProps) {

    const attendanceMap = useMemo(() => {
        return new Map(attendanceData.map(record => [dayjs(record.date).format('YYYY-MM-DD'), record]));
    }, [attendanceData]);

    const filteredWeekDates = weekDates.filter(date => date.day() !== 0 && date.day() !== 6);
    return (
        <Paper elevation={4} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', mt: 2, boxShadow: '0 4px 24px rgba(13, 71, 161, 0.08)' }}>
            <Table size="small" sx={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #f6fff7 100%)' }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#46a2da' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 16, border: '1px solid #90caf9' }}>Thứ</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 16, border: '1px solid #90caf9' }}>Ngày</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 16, border: '1px solid #90caf9' }}>Trạng thái</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 16, border: '1px solid #90caf9' }}>Giờ vào</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 16, border: '1px solid #90caf9' }}>Giờ ra</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 16, border: '1px solid #90caf9' }}>Ghi chú</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredWeekDates.map((date, idx) => {
                        const att = attendanceMap.get(date.format('YYYY-MM-DD'));
                        return (
                            <TableRow
                                key={date.toString()}
                                hover
                                sx={{
                                    background: idx % 2 === 0 ? '#f5f7fb' : '#e3f2fd',
                                    transition: 'background 0.2s',
                                    '&:hover': {
                                        background: '#bbdefb',
                                    },
                                }}
                            >
                                <TableCell sx={{ textAlign: 'center', fontWeight: 600, fontSize: 15, color: '#1976d2', border: '1px solid #90caf9', wordBreak: 'break-word' }}>
                                    {getVietnameseDay(date.day())}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#0d47a1', border: '1px solid #90caf9', wordBreak: 'break-word' }}>
                                    {date.format('DD/MM')}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 600, fontSize: 15, border: '1px solid #90caf9', wordBreak: 'break-word' }}>
                                    {renderAttendanceStatus(att)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#388e3c', border: '1px solid #90caf9', wordBreak: 'break-word' }}>
                                    {att?.checkInTime || <RemoveIcon sx={{ color: '#bdbdbd', verticalAlign: 'middle' }} />}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#d84315', border: '1px solid #90caf9', wordBreak: 'break-word' }}>
                                    {att?.checkOutTime || <RemoveIcon sx={{ color: '#bdbdbd', verticalAlign: 'middle' }} />}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 400, fontSize: 15, color: '#616161', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid #90caf9' }}>
                                    {att?.note || ''}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}