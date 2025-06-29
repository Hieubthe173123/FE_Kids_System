import { useState, useMemo, useEffect } from "react";
import {
    Box, Typography, TextField, InputAdornment,
    Button, IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import { ClassListSidebar } from "./ClassListSidebar";
import StudentTable from "./StudentTable";
import TeacherSelectionModal from "./TeacherSelectionModal";
import AddStudentModal from "./AddStudentModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    getClassBySchooYear,
    getTeachersInClass,
    getStudentsInClass,
    addTeachersToClass,
    addStudentsToClass,
    removeStudentFromClass,
    getAllSchoolYears,
    getAvailableStudents,
    getAvailableTeachers,
    removeTeacherFromClass
} from "../../services/PrincipalApi";


const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";
const BACKGROUND_COLOR = "#fefefe";

const initialMockClassData: Array<{ id: string; room: string; schoolYear: string; teacher: { name: string }; students: Array<{ _id: string; studentId: number; name: string; dob: string }> }> = [];
const initialMockAvailableTeachers: Array<{ id: string; name: string; phone: string }> = [];
const initialMockAvailableStudents: Array<{ studentId: string; name: string; dob: string }> = [];
const calculateAge = (dob: string) => {
    const birthDate = dayjs(dob);
    const age = dayjs().diff(birthDate, "year");
    return `(${age} tuổi)`;
};


export default function ClassMannager() {
    const [classData, setClassData] = useState(initialMockClassData);
    const [availableStudents, setAvailableStudents] = useState(initialMockAvailableStudents);
    const [availableTeachers, setAvailableTeachers] = useState(initialMockAvailableTeachers);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
    const [allSchoolYears, setAllSchoolYears] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [teacherSearch, setTeacherSearch] = useState("");
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [selectedTeachers, setSelectedTeachers] = useState<Array<{ id: string; name: string; phone: string }>>([]);
    const [alertTooMany, setAlertTooMany] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    const [teacherPerClass, setTeacherPerClass] = useState<{ [key: string]: string }>(() => {
        const initial: { [key: string]: string } = {};
        initialMockClassData.forEach(c => { initial[`${c.room}_${c.schoolYear}`] = c.teacher.name; });
        return initial;
    });

    const handleCloseModal = () => {
        setSelectedTeachers([]);
        setTeacherSearch("");
        setIsTeacherModalOpen(false);
    };


    useEffect(() => {
        if (!selectedSchoolYear) return;
        getClassBySchooYear(selectedSchoolYear)
            .then(data => {
                if (!Array.isArray(data)) {
                    setClassData([]);
                    return;
                }
                setClassData(data);
            })
            .catch(error => {
                console.error("Failed to fetch class data:", error);
                setClassData([]);
            });
    }, [selectedSchoolYear]);


    useEffect(() => {
        if (!selectedRoom || !selectedSchoolYear) return;
        const currentClass = classData.find(c => c.room === selectedRoom && c.schoolYear === selectedSchoolYear);
        if (!currentClass) return;

        const classKey = `${selectedRoom}_${selectedSchoolYear}`;

        getTeachersInClass(currentClass.id)
            .then(data => {
                const names = data.map((t: any) => t.name).join(", ");
                setTeacherPerClass(prev => ({ ...prev, [classKey]: names }));
            })
            .catch(error => {
                console.error("Failed to fetch teachers:", error);
            });

        getStudentsInClass(currentClass.id)
            .then(data => {
                setClassData(prev => prev.map(c =>
                    c.id === currentClass.id ? { ...c, students: data } : c
                ));
            })
            .catch(error => {
                console.error("Failed to fetch students:", error);
            });
    }, [selectedRoom, selectedSchoolYear]);

    useEffect(() => {
        getAllSchoolYears()
            .then(data => {
                if (!Array.isArray(data?.data)) {
                    setAllSchoolYears([]);
                    return;
                }

                const allYears = data.data;
                const sortedYears = [...allYears].sort((a, b) => {
                    const yearA = parseInt(a.split(' - ')[0]);
                    const yearB = parseInt(b.split(' - ')[0]);
                    return yearB - yearA;
                });

                setAllSchoolYears(sortedYears);
                if (sortedYears.length > 0) {
                    setSelectedSchoolYear(sortedYears[0]);
                }
            })
            .catch(error => {
                console.error("Failed to fetch all school years:", error);
                setAllSchoolYears([]);
            });
    }, []);


    useEffect(() => {
        getAvailableStudents()
            .then(data => {
                if (!Array.isArray(data)) {
                    setAvailableStudents([]);
                    return;
                }

                const mapped = data.map((s: any) => ({
                    studentId: s._id,
                    name: s.fullName,
                    dob: s.dob
                }));

                setAvailableStudents(mapped);
            })
            .catch(error => {
                console.error("Failed to fetch available students:", error);
                setAvailableStudents([]);
            });
    }, []);

    useEffect(() => {
        getAvailableTeachers()
            .then(data => {
                if (!Array.isArray(data)) {
                    setAvailableTeachers([]);
                    return;
                }
                const mapped = data.map((t: any) => ({
                    id: t._id,
                    name: t.fullName,
                    phone: t.phoneNumber
                }));
                setAvailableTeachers(mapped);
            })
            .catch(error => {
                console.error("Failed to fetch available teachers:", error);
                setAvailableTeachers([]);
            });
    }, [])

    useEffect(() => {
        if (isTeacherModalOpen && selectedRoom && selectedSchoolYear) {
            const currentClass = classData.find(c => c.room === selectedRoom && c.schoolYear === selectedSchoolYear);
            if (!currentClass) return;

            getTeachersInClass(currentClass.id).then(classTeachers => {
                const classTeacherIds = classTeachers.map((t: any) => t._id);
                setAvailableTeachers(prev => prev.filter(t => !classTeacherIds.includes(t.id)));
            });
        }
    }, [isTeacherModalOpen, selectedRoom, selectedSchoolYear, classData]);



    const rooms = useMemo(() => [...new Set(classData.map(c => c.room))], [classData]);
    const classKey = `${selectedRoom}_${selectedSchoolYear}`;
    const currentTeacher = teacherPerClass[classKey] || "Chưa phân công";
    const filteredStudents = useMemo(() => {
        const currentClass = classData.find(c => c.schoolYear === selectedSchoolYear && c.room === selectedRoom);
        if (!currentClass) return [];
        return currentClass.students
            .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toString().includes(search))
            .map((s, index) => ({ id: s.studentId, stt: index + 1, studentId: s.studentId, studentName: s.name, dob: s.dob, age: calculateAge(s.dob) }));
    }, [classData, selectedSchoolYear, selectedRoom, search]);

    const handleSelectTeacher = (teacher: { id: string; name: string; phone: string }) => {
        if (selectedTeachers.length >= 2) {
            setAlertTooMany(true);
            setTimeout(() => setAlertTooMany(false), 3000);
            return;
        }
        setSelectedTeachers(prev => [...prev, { id: String(teacher.id), name: teacher.name, phone: teacher.phone }]);
        setAvailableTeachers(prev => prev.filter(t => t.id !== teacher._id));
    };

    const handleConfirmTeacherSelection = async () => {
        const currentClass = classData.find(c => c.room === selectedRoom && c.schoolYear === selectedSchoolYear);
        if (!currentClass) return;

        if (selectedTeachers.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một giáo viên!");
            return;
        }
        try {
            await addTeachersToClass(currentClass.id, selectedTeachers.map(t => t.id.toString()));
            const updatedTeachers = await getTeachersInClass(currentClass.id);
            const names = updatedTeachers.map((t: any) => t.name).join(", ");
            setTeacherPerClass(prev => ({ ...prev, [classKey]: names }));
            setAvailableTeachers(prev => prev.filter(t => !selectedTeachers.some(sel => sel.id === t.id)));

            toast.success("Thêm giáo viên vào lớp thành công!");

            setSelectedTeachers([]);
            setIsTeacherModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.warning("Mỗi lớp chỉ được chọn tối đa 2 giáo viên!");
        }
    };




    const handleAddStudentToClass = async (studentToAdd: {
        [x: string]: string; studentId: string; name: string; dob: string
    }) => {
        const currentClass = classData.find(c => c.room === selectedRoom && c.schoolYear === selectedSchoolYear);
        if (!currentClass) return;

        try {
            await addStudentsToClass(currentClass.id, [studentToAdd._id]);
            const updatedStudents = await getStudentsInClass(currentClass.id);

            setClassData(prev =>
                prev.map(c => c.id === currentClass.id ? { ...c, students: updatedStudents } : c)
            );
            setAvailableStudents(prev =>
                prev.filter(s => s.studentId !== String(studentToAdd.studentId))
            );

            toast.success(`Đã thêm học sinh ${studentToAdd.name} vào lớp`);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm học sinh");
        }
    };


    const handleRemoveSelectedStudents = async () => {
        if (selectedStudents.length === 0) return;

        const currentClass = classData.find(c => c.room === selectedRoom && c.schoolYear === selectedSchoolYear);
        if (!currentClass) return;

        const removedStudentIds: number[] = [];
        const removedStudentObjects: typeof currentClass.students = [];

        for (const studentCode of selectedStudents) {
            const studentObj = currentClass.students.find(s => s.studentId === studentCode);
            if (!studentObj) continue;

            try {
                await removeStudentFromClass(currentClass.id, studentObj._id);
                removedStudentObjects.push(studentObj);
                removedStudentIds.push(studentCode);
            } catch (error) {
                console.error(`Failed to remove student ${studentCode}`, error);
                toast.error(`Lỗi khi xóa học sinh ${studentObj?.name || studentCode}`);
            }
        }

        setClassData(prev =>
            prev.map(c =>
                c.id === currentClass.id
                    ? {
                        ...c,
                        students: c.students.filter(s => !removedStudentIds.includes(s.studentId))
                    }
                    : c
            )
        );

        setAvailableStudents(prev => [
            ...prev,
            ...removedStudentObjects.map(s => ({
                studentId: s._id,
                name: s.name,
                dob: s.dob
            }))
        ]);
        setSelectedStudents([]);

        if (removedStudentObjects.length > 0) {
            toast.success(`Đã xóa ${removedStudentObjects.length} học sinh khỏi lớp`);
        }
    };

    const handleRemoveTeacher = async (teacherName: string) => {
        const currentClass = classData.find(c => c.room === selectedRoom && c.schoolYear === selectedSchoolYear);
        if (!currentClass) return;

        try {
            const teacherList = await getTeachersInClass(currentClass.id);
            const teacherToRemove = teacherList.find((t: any) => t.name === teacherName);
            if (!teacherToRemove || !teacherToRemove._id) {
                console.error("Không tìm thấy _id của giáo viên:", teacherToRemove);
                toast.error("Không tìm thấy ID của giáo viên để xóa");
                return;
            }


            await removeTeacherFromClass(currentClass.id, String(teacherToRemove._id || teacherToRemove.id));
            console.log("teacherToRemove:", teacherToRemove);

            const updatedTeachers = teacherList.filter((t: any) => t.name !== teacherName);
            const updatedNames = updatedTeachers.map((t: any) => t.name).join(", ");
            setTeacherPerClass(prev => ({ ...prev, [classKey]: updatedNames }));
            setAvailableTeachers(prev => [...prev, { id: teacherToRemove.id, name: teacherToRemove.name, phone: teacherToRemove.phone }]);

            toast.success(`Đã xóa giáo viên ${teacherName} khỏi lớp`);
        } catch (err) {
            console.error(err);
            toast.error(`Lỗi khi xóa giáo viên ${teacherName}`);
        }
    };



    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedStudents(event.target.checked ? filteredStudents.map(n => n.id) : []);
    };

    const handleRowClick = (_event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selectedStudents.indexOf(id);
        let newSelected: number[] = [];
        if (selectedIndex === -1) newSelected = newSelected.concat(selectedStudents, id);
        else if (selectedIndex === 0) newSelected = newSelected.concat(selectedStudents.slice(1));
        else if (selectedIndex === selectedStudents.length - 1) newSelected = newSelected.concat(selectedStudents.slice(0, -1));
        else if (selectedIndex > 0) newSelected = newSelected.concat(selectedStudents.slice(0, selectedIndex), selectedStudents.slice(selectedIndex + 1));
        setSelectedStudents(newSelected);
    };

    return (
        <Box sx={{ display: "flex", height: "90vh", bgcolor: BACKGROUND_COLOR, overflow: "hidden", p: 2, gap: 3, boxSizing: "border-box", flexDirection: { xs: "column", md: "row" } }}>
            <ClassListSidebar
                schoolYears={allSchoolYears}
                selectedSchoolYear={selectedSchoolYear}
                onSchoolYearChange={setSelectedSchoolYear}
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomChange={setSelectedRoom}
            />

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", bgcolor: "#f9fbfd", borderRadius: 3, p: 3, boxShadow: "0px 4px 16px rgba(0,0,0,0.06)", overflow: "auto" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, mb: 2, bgcolor: "#eaf7ff", borderRadius: 2, flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography fontWeight="bold">👩‍🏫 Giáo viên:</Typography>
                            {currentTeacher.split(", ").map((name, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        bgcolor: "#e3f2fd",
                                        color: "#1565c0",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: "999px",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        boxShadow: 1,
                                        transition: "all 0.2s ease-in-out"
                                    }}
                                >
                                    <Typography>{name}</Typography>
                                    {name !== "Chưa phân công" && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveTeacher(name)}
                                            sx={{
                                                color: "#c62828",
                                                ml: 0.5,
                                                p: "2px",
                                                "&:hover": {
                                                    bgcolor: "#ffcdd2"
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            <IconButton
                                size="small"
                                onClick={() => setIsTeacherModalOpen(true)}
                                sx={{
                                    bgcolor: "#e3f2fd",
                                    color: "#1565c0",
                                    borderRadius: "50%",
                                    "&:hover": {
                                        bgcolor: "#bbdefb"
                                    }
                                }}
                            >
                                <PersonSearchIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography fontWeight="bold">🏫 Lớp: {selectedRoom}</Typography>
                        <Typography fontWeight="bold">📅 Năm học: {selectedSchoolYear}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap", alignItems: "center" }}>
                            <TextField
                                variant="outlined"
                                label="🔍 Tìm học sinh"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                size="small"
                                sx={{ minWidth: 220 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {selectedStudents.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleRemoveSelectedStudents}
                                >
                                    Xóa {selectedStudents.length} học sinh
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<PersonAddAlt1Icon />}
                                sx={{ backgroundColor: PRIMARY_COLOR, "&:hover": { backgroundColor: PRIMARY_DARK } }}
                                onClick={() => setIsStudentModalOpen(true)}
                            >
                                Thêm học sinh
                            </Button>
                            {/* <Button
                                variant="contained"
                                startIcon={<CreateIcon />}
                                sx={{ backgroundColor: "#e6687a", color: "#fff", "&:hover": { backgroundColor: "#d75c6e" } }}
                                onClick={() => navigate("/principal-home/create-class")}
                            >
                                Tạo / Sửa lớp
                            </Button> */}

                            <Button
                                variant="contained"
                                startIcon={<CreateIcon />}
                                sx={{ backgroundColor: "#e6687a", color: "#fff", "&:hover": { backgroundColor: "#d75c6e" } }}
                                onClick={() => {
                                    if (selectedSchoolYear) {
                                        navigate(`/principal-home/create-class?schoolYear=${encodeURIComponent(selectedSchoolYear)}`);
                                    } else {
                                        toast.warn("Vui lòng chọn một năm học trước.");
                                    }
                                }}
                            >
                                Tạo / Sửa lớp
                            </Button>
                        </Box>
                    </Box>
                    <StudentTable
                        students={filteredStudents}
                        selectedStudents={selectedStudents}
                        onSelectAllClick={handleSelectAllClick}
                        onRowClick={handleRowClick}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(_e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Box>
            </Box>
            <TeacherSelectionModal
                open={isTeacherModalOpen}
                onClose={handleCloseModal}
                onRemoveTeacher={(id) =>
                    setSelectedTeachers(prev => prev.filter(t => t.id !== id))
                }
                availableTeachers={availableTeachers.filter(
                    (t) => !selectedTeachers.some(sel => sel.id === t.id)
                )}
                selectedTeachers={selectedTeachers}
                onSelectTeacher={handleSelectTeacher}
                onConfirm={handleConfirmTeacherSelection}
                alertTooMany={alertTooMany}
                teacherSearch={teacherSearch}
                onSearchChange={(e) => setTeacherSearch(e.target.value)}
            />
            <AddStudentModal
                open={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                availableStudents={availableStudents.map(s => ({ ...s, studentId: s.studentId.toString() }))}
                onAddStudent={handleAddStudentToClass}
                selectedRoom={selectedRoom}
            />
        </Box>
    );
}