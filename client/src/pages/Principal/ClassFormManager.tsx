import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box, Paper, Typography, Table, TableContainer, TableHead, TableRow,
    TableCell, TableBody, TextField, Select, MenuItem, Switch, Button,
    IconButton, Tooltip, InputAdornment, CircularProgress
} from '@mui/material';
import {
    Class as ClassIcon, Save as SaveIcon, ChildCare, MeetingRoom,
    Edit as EditIcon, School as SchoolIcon, Search as SearchIcon, InfoOutlined
} from '@mui/icons-material';
import {
    getAllClassBySchoolYear,
    updateClass,
    getAllRooms
} from '../../services/PrincipalApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AGE_OPTIONS = [1, 2, 3, 4, 5];

interface Room {
    _id: string;
    roomName: string;
}

interface ClassRow {
    id?: string;
    className: string;
    age: number;
    room: string;
    status: boolean;
    editing: boolean;
    studentCount?: number;
    teacherCount?: number;
}

export default function ClassCreateTable() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<ClassRow[]>([]);
    const [roomOptions, setRoomOptions] = useState<Room[]>([]);
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [schoolYear, setSchoolYear] = useState('');

    useEffect(() => {
        const yearFromParams = searchParams.get('schoolYear');
        if (yearFromParams) {
            setSchoolYear(decodeURIComponent(yearFromParams));
        } else {
            const currentYear = new Date().getFullYear();
            setSchoolYear(`${currentYear} - ${currentYear + 1}`);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const responseData = await getAllRooms();
                setRoomOptions(responseData || []);
            } catch (error) {
                toast.error("Lỗi khi tải danh sách phòng học");
                setRoomOptions([]);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!schoolYear) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await getAllClassBySchoolYear(schoolYear);
                const serverRows = result.data
                    .filter((item: any) => item.className && item.classAge)
                    .map((item: any) => ({
                        id: item._id,
                        className: item.className,
                        age: parseInt(item.classAge),
                        room: item.room?._id || '',
                        status: item.status,
                        editing: false,
                        studentCount: item.students?.length || 0,
                        teacherCount: item.teacher?.length || 0,
                    }));

                setRows(serverRows);
            } catch (error) {
                toast.error(`Lỗi khi tải danh sách lớp cho năm học ${schoolYear}`);
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [schoolYear]);

    const handleChange = (id: string | undefined, field: string, value: unknown) => {
        setRows(prev =>
            prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const handleEditClassName = (id: string | undefined) => {
        if (id) setEditingCell(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingCell(null);
        }
    };

    const usedRooms = useMemo(() => {
        return rows.reduce((acc, row) => {
            if (row.room && row.status) acc.add(row.room);
            return acc;
        }, new Set<string>());
    }, [rows]);

    const filteredRows = useMemo(() => {
        return rows.filter(row =>
            (row.className || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [rows, searchTerm]);

    const handleSave = async () => {
        try {
            setLoading(true);

            const invalidRows = rows.filter(row => !row.className || !row.age);
            if (invalidRows.length > 0) {
                toast.warn(`Vui lòng điền đủ thông tin cho tất cả các lớp.`);
                setLoading(false);
                return;
            }

            const updatePromises = rows.map(row => {
                return updateClass(
                    row.id ?? '',
                    row.className,
                    row.age.toString(),
                    row.room || '',
                    row.status
                );
            });

            await Promise.all(updatePromises);

            const result = await getAllClassBySchoolYear(schoolYear);
            const updatedRows = result.data.map((item: any) => ({
                id: item._id,
                className: item.className,
                age: parseInt(item.classAge),
                room: item.room?._id || '',
                status: item.status,
                editing: false,
                studentCount: item.students?.length || 0,
                teacherCount: item.teacher?.length || 0,
            }));
            setRows(updatedRows);

            toast.success('Đã lưu danh sách lớp thành công');
        } catch (error) {
            toast.error('Lỗi khi lưu danh sách lớp');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: '#ffffff',
                border: '2px solid #46a2da',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                margin: '20px',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 3,
                        color: '#1976d2',
                        borderColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#e3f2fd',
                            borderColor: '#1565c0',
                        }
                    }}
                >
                    Quay lại
                </Button>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems={{ xs: 'start', sm: 'center' }}
                flexDirection={{ xs: 'column', sm: 'row' }}
                mb={3}
                gap={1}
            >
                <Box display="flex" alignItems="center">
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                        display="flex"
                        alignItems="center"
                        mr={2}
                    >
                        <ClassIcon sx={{ mr: 1 }} />
                        Tạo và Cập nhật Lớp học
                    </Typography>
                </Box>

                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Tìm kiếm lớp..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    sx={{ fontSize: '18px' }}
                >
                    Năm học: {schoolYear || 'Đang tải...'}
                </Typography>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {filteredRows.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                mt: 2,
                                border: '2px dashed #ccc',
                                borderRadius: 3,
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <InfoOutlined sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Năm học này chưa có lớp học nào.
                            </Typography>
                            <Typography color="text.secondary">
                                Vui lòng thêm lớp mới hoặc tạo các lớp mặc định.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: 3,
                                maxHeight: 'calc(100vh - 420px)',
                                overflowY: 'auto',
                                border: 'none',
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                                '&::-webkit-scrollbar': { width: '8px' },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#bbb', borderRadius: '4px' },
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor: '#f5faff',
                                            '& th': {
                                                fontWeight: 'bold',
                                                fontSize: '15px',
                                                color: '#1976d2',
                                                borderBottom: '2px solid #e0e0e0',
                                            },
                                        }}
                                    >
                                        <TableCell align="left" sx={{ width: 200 }}>Tên lớp</TableCell>
                                        <TableCell align="left" sx={{ width: 160 }}>Độ tuổi</TableCell>
                                        <TableCell align="left" sx={{ width: 180 }}>Phòng</TableCell>
                                        <TableCell align="center" sx={{ width: 150 }}>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRows.map(row => (
                                        <TableRow key={row.id || row.className} hover>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" minHeight="40px">
                                                    {editingCell === row.id ? (
                                                        <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            autoFocus
                                                            value={row.className}
                                                            onChange={e => handleChange(row.id, 'className', e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            onBlur={() => setEditingCell(null)}
                                                        />
                                                    ) : (
                                                        <>
                                                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                                {row.className}
                                                            </Typography>
                                                            <Tooltip title="Sửa tên lớp">
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ ml: 1 }}
                                                                    onClick={() => handleEditClassName(row.id)}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    size="small"
                                                    value={row.age}
                                                    onChange={e => handleChange(row.id, 'age', e.target.value)}
                                                    fullWidth
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {AGE_OPTIONS.map(age => (
                                                        <MenuItem key={age} value={age}>
                                                            <ChildCare sx={{ mr: 1 }} /> {age} tuổi
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    size="small"
                                                    value={row.room}
                                                    onChange={e => handleChange(row.id, 'room', e.target.value)}
                                                    fullWidth
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {roomOptions
                                                        .filter(room => !usedRooms.has(room._id) || row.room === room._id)
                                                        .map(room => (
                                                            <MenuItem key={room._id} value={room._id}>
                                                                <MeetingRoom sx={{ mr: 1 }} /> {room.roomName}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                    <Switch
                                                        checked={row.status}
                                                        onChange={(e) => {
                                                            const hasTeacherOrStudent = (row.studentCount ?? 0) > 0 || (row.teacherCount ?? 0) > 0;
                                                            if (hasTeacherOrStudent) {
                                                                toast.warning("Không thể thay đổi trạng thái của lớp đã có học sinh hoặc giáo viên");
                                                                return;
                                                            }
                                                            handleChange(row.id, 'status', Boolean(e.target.checked));
                                                        }}
                                                        color={row.status ? 'success' : 'default'}
                                                    />
                                                    <Box ml={1} width={60} textAlign="left">
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: row.status ? 'success.main' : 'text.secondary',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {row.status ? 'Active' : 'Inactive'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}

            <Box mt={4} textAlign="right">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading || rows.length === 0}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                        px: 5,
                        py: 1.5,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #42a5f5, #1e88e5)',
                        boxShadow: '0px 4px 12px rgba(66,165,245,0.4)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #1e88e5, #1565c0)',
                        },
                    }}
                >
                    Cập nhật thông tin
                </Button>
            </Box>
        </Box>
    );
}