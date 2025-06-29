import dayjs from "dayjs";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Checkbox,
    Alert,
} from "@mui/material";

type Student = {
    id: number;
    stt: number;
    studentId: number;
    studentName: string;
    dob: string;
    age: string;
};

type StudentTableProps = {
    students: Student[];
    selectedStudents: number[];
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRowClick: (event: React.MouseEvent<unknown>, id: number) => void;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function StudentTable({
    students,
    selectedStudents,
    onSelectAllClick,
    onRowClick,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: StudentTableProps) {
    const columns = [
        { id: "stt", label: "STT", width: 70 },
        { id: "studentId", label: "Mã HS", width: 100 },
        { id: "studentName", label: "Tên học sinh", flex: 1 },
        { id: "dob", label: "Ngày sinh", width: 130 },
        { id: "age", label: "Tuổi", width: 80 },
    ];

    const isSelected = (id: number) => selectedStudents.indexOf(id) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0;

    return (
        <Paper elevation={2} sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "60vh" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow
                            sx={{
                                "& .MuiTableCell-root": {
                                    backgroundColor: "#d5f0ff",
                                    color: "#333",
                                    fontWeight: 700,
                                    fontSize: 15,
                                },
                            }}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={
                                        selectedStudents.length > 0 &&
                                        selectedStudents.length < students.length
                                    }
                                    checked={
                                        students.length > 0 &&
                                        selectedStudents.length === students.length
                                    }
                                    onChange={onSelectAllClick}
                                />
                            </TableCell>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    style={{ width: col.width, flex: col.flex }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.length > 0 ? (
                            (rowsPerPage > 0
                                ? students.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                : students
                            ).map((row) => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => onRowClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ "& > td, & > th": { fontSize: 14 } }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox color="primary" checked={isItemSelected} />
                                        </TableCell>
                                        {columns.map((col) => (
                                            <TableCell key={col.id}>
                                                {col.id === "dob"
                                                    ? dayjs(row.dob).format("DD/MM/YYYY")
                                                    : row[col.id as keyof Student]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    <Alert
                                        severity="info"
                                        sx={{ mt: 2, border: "none", background: "transparent" }}
                                    >
                                        Không tìm thấy học sinh nào.
                                    </Alert>
                                </TableCell>
                            </TableRow>
                        )}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={columns.length + 1} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                labelRowsPerPage="Số dòng mỗi trang:"
            />
        </Paper>
    );
}
