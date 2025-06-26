import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Select,
    MenuItem,
    Switch,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Class as ClassIcon,
    Save as SaveIcon,
    AddCircleOutline,
    ChildCare,
    MeetingRoom,
    Edit as EditIcon,
    School as SchoolIcon,
} from '@mui/icons-material';

const AGE_OPTIONS = [6, 7, 8, 9, 10];
const ROOM_OPTIONS = ['Phòng A1', 'Phòng A2', 'Phòng B1', 'Phòng B2'];

interface ClassRow {
    id: string;
    className: string;
    age: number;
    room: string;
    status: boolean;
    editing: boolean;
}

const generateInitialClasses = (): ClassRow[] => {
    const generated: ClassRow[] = [];
    for (let grade = 1; grade <= 5; grade++) {
        ['A', 'B', 'C', 'D'].forEach(letter => {
            generated.push({
                id: `${grade}${letter}`,
                className: `Lớp ${grade}${letter}`,
                age: grade + 5,
                room: 'Phòng A1',
                status: true,
                editing: false,
            });
        });
    }
    return generated;
};

export default function ClassCreateTable() {
    const [rows, setRows] = useState<ClassRow[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [editingCell, setEditingCell] = useState<string | null>(null);

    const currentYear = new Date().getFullYear();
    const schoolYear = `${currentYear} - ${currentYear + 1}`;

    useEffect(() => {
        if (!isInitialized) {
            const initial = generateInitialClasses();
            setRows(initial);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleChange = (id: string, field: string, value: unknown) => {
        setRows(prev =>
            prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const handleEditClassName = (id: string) => {
        setEditingCell(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingCell(null);
        }
    };

    const handleSave = () => {
        console.log('Dữ liệu lưu:', rows);
        alert('Đã lưu thông tin lớp học!');
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
                        {isInitialized ? 'Cập nhật lớp học' : 'Tạo mới lớp học'}
                    </Typography>
                </Box>

                {!isInitialized && (
                    <Tooltip title="Thêm lớp mới">
                        <IconButton color="primary">
                            <AddCircleOutline fontSize="large" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* 🎓 Năm học hiển thị phía trên bảng */}
            <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    sx={{ fontSize: '18px' }}
                >
                    Năm học: {schoolYear}
                </Typography>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 3,
                    maxHeight: 360,
                    overflowY: 'auto',
                    border: 'none',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#bbb',
                        borderRadius: '4px',
                    },
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
                        {rows.map(row => (
                            <TableRow
                                key={row.id}
                                hover
                                sx={{
                                    '&:last-child td': { borderBottom: 0 },
                                    '& td': {
                                        borderBottom: '1px solid #f0f0f0',
                                        fontSize: '14px',
                                        paddingY: 1,
                                    },
                                }}
                            >
                                <TableCell>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        minHeight="40px"
                                        sx={{ position: 'relative' }}
                                    >
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
                                        {ROOM_OPTIONS.map(room => (
                                            <MenuItem key={room} value={room}>
                                                <MeetingRoom sx={{ mr: 1 }} /> {room}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>

                                <TableCell align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <Switch
                                            checked={row.status}
                                            onChange={e => handleChange(row.id, 'status', e.target.checked)}
                                            color={row.status ? 'success' : 'default'}
                                        />
                                        <Box
                                            sx={{
                                                ml: 1,
                                                width: 60,
                                                textAlign: 'left',
                                            }}
                                        >
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

            <Box mt={4} textAlign="right">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
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
                    {isInitialized ? 'Cập nhật thông tin' : 'Lưu danh sách'}
                </Button>
            </Box>
        </Box>
    );
}
