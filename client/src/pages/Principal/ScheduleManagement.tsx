import { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    LinearProgress,
} from "@mui/material";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScheduleEditableTable } from "./ScheduleEditableTable";

import {
    getClassBySchooYear,
    getTeachersInClass,
    getAllSchoolYears,
    checkYearExistedSchedule,
    genScheduleWithAI,
    getScheduleByClassNameAndYear,
    saveClassSchedule,
} from "../../services/PrincipalApi";
import { ScheduleListClassSidebar } from "./ScheduleListClassSidebar";

const PRIMARY_COLOR = "#4194cb";
const PRIMARY_DARK = "#63a4d9";
const BACKGROUND_COLOR = "#fefefe";

const initialMockClassData: Array<{
    id: string;
    room: string;
    schoolYear: string;
    teacher: { name: string };
    students: Array<{
        _id: string;
        studentId: number;
        name: string;
        dob: string;
    }>;
}> = [];

export default function ScheduleManagement() {
    const [classData, setClassData] = useState(initialMockClassData);
    const [progress, setProgress] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
    const [allSchoolYears, setAllSchoolYears] = useState<string[]>([]);
    const [hasSchedule, setHasSchedule] = useState(false);
    const [genSchedule, setGenSchedule] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedSchedules, setGeneratedSchedules] = useState<{
        [year: string]: any;
    }>({});
    const [currentSchedule, setCurrentSchedule] = useState<any>(null);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [initialSchoolYear, setInitialSchoolYear] = useState<string>("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [teacherPerClass, setTeacherPerClass] = useState<{
        [key: string]: string;
    }>(() => {
        const initial: { [key: string]: string } = {};
        initialMockClassData.forEach((c) => {
            initial[`${c.room}_${c.schoolYear}`] = c.teacher.name;
        });
        return initial;
    });


    useEffect(() => {
        if (!selectedSchoolYear) return;
        checkYearExistedSchedule(selectedSchoolYear)
            .then((data) => {
                setHasSchedule(data.exists);
            })
            .catch((error) => {
                console.error("Failed to check schedule:", error);
                setHasSchedule(false);
            });
        getClassBySchooYear(selectedSchoolYear)
            .then((data) => {
                if (!Array.isArray(data)) {
                    setClassData([]);
                    return;
                }
                setClassData(data);
                // console.log(data);
            })
            .catch((error) => {
                console.error("Failed to fetch class data:", error);
                setClassData([]);
            });
    }, [selectedSchoolYear]);

    useEffect(() => {
        if (!selectedSchoolYear || !initialSchoolYear) {
            setIsReadOnly(false);
            return;
        }

        if (selectedSchoolYear !== initialSchoolYear) {
            setIsReadOnly(true);
            toast.info(
                `Chỉ có thể chỉnh sửa lịch cho năm học hiện tại (${initialSchoolYear}). Chức năng chỉnh sửa đã bị khóa.`
            );
        } else {
            setIsReadOnly(false);
        }
    }, [selectedSchoolYear, initialSchoolYear]);

    useEffect(() => {
        if (!selectedRoom || !selectedSchoolYear) return;
        const currentClass = classData.find(
            (c) =>
                c.room === selectedRoom && c.schoolYear === selectedSchoolYear
        );
        if (!currentClass) return;
        if (genSchedule) {
        }
        const classKey = `${selectedRoom}_${selectedSchoolYear}`;

        getTeachersInClass(currentClass.id)
            .then((data) => {
                const names = data.map((t: any) => t.name).join(", ");
                setTeacherPerClass((prev) => ({ ...prev, [classKey]: names }));
            })
            .catch((error) => {
                console.error("Failed to fetch teachers:", error);
            });
    }, [selectedRoom, selectedSchoolYear]);

    useEffect(() => {
        getAllSchoolYears()
            .then((data) => {
                if (!Array.isArray(data?.data)) {
                    setAllSchoolYears([]);
                    return;
                }

                const allYears = data.data;
                const sortedYears = [...allYears].sort((a, b) => {
                    const yearA = parseInt(a.split(" - ")[0]);
                    const yearB = parseInt(b.split(" - ")[0]);
                    return yearB - yearA;
                });

                setAllSchoolYears(sortedYears);
                if (sortedYears.length > 0) {
                    const currentSchoolYear = sortedYears[0];
                    setSelectedSchoolYear(currentSchoolYear);
                    setInitialSchoolYear(currentSchoolYear); // Store the initial year
                }
            })
            .catch((error) => {
                console.error("Failed to fetch all school years:", error);
                setAllSchoolYears([]);
            });
    }, []);

    useEffect(() => {
        if (
            genSchedule &&
            selectedSchoolYear &&
            !generatedSchedules[selectedSchoolYear]
        ) {
            setLoading(true);
            setProgress(0);
            genScheduleWithAI(selectedSchoolYear)
                .then((data) => {
                    setGeneratedSchedules((prev) => ({
                        ...prev,
                        [selectedSchoolYear]: data,
                    }));
                    toast.success("Tạo lịch học thành công!");
                })
                .catch(() => {
                    toast.error("Tạo lịch học thất bại!");
                })
                .finally(() => {
                    setLoading(false);
                    setGenSchedule(false);
                    setProgress(100);
                });
        }
    }, [genSchedule, selectedSchoolYear]);

    useEffect(() => {
        let interval: any;
        if (loading) {
            setProgress(0);
            let steps = [10, 30, 50, 70, 90];
            let idx = 0;
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (idx < steps.length) {
                        const next = steps[idx];
                        idx++;
                        return next;
                    }
                    return prev;
                });
            }, 700);
        }
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
    }, [selectedSchoolYear, generatedSchedules]);

    const rooms = useMemo(
        () => [...new Set(classData.map((c) => c.room))],
        [classData]
    );
    const classKey = `${selectedRoom}_${selectedSchoolYear}`;
    const currentTeacher = teacherPerClass[classKey] || "Chưa phân công";

    const isScheduleGeneratedForYear = useMemo(() => {
        return !!generatedSchedules[selectedSchoolYear];
    }, [generatedSchedules, selectedSchoolYear]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (loading || (isScheduleGeneratedForYear && !hasSchedule)) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [loading, isScheduleGeneratedForYear, hasSchedule]);

    const handleCancelSchedule = () => {
        setGeneratedSchedules((prev) => {
            const newObj = { ...prev };
            delete newObj[selectedSchoolYear];
            return newObj;
        });
        toast.info("Đã hủy tạo lịch học");
    };

    function getScheduleForClass(
        generatedSchedules: any,
        selectedSchoolYear: string,
        selectedRoom: string
    ) {
        if (
            !generatedSchedules ||
            !selectedSchoolYear ||
            !selectedRoom ||
            !generatedSchedules[selectedSchoolYear] ||
            !Array.isArray(generatedSchedules[selectedSchoolYear].schedules)
        ) {
            return null;
        }
        const classObj = generatedSchedules[selectedSchoolYear].schedules.find(
            (c: any) => c.class === selectedRoom
        );
        return classObj ? classObj.schedule : null;
    }

    useEffect(() => {
        if (!selectedSchoolYear || !selectedRoom) {
            setCurrentSchedule(null);
            setHasUnsavedChanges(false);
            return;
        }
        if (hasSchedule) {
            // Lấy từ API khi đã có lịch chính thức
            getScheduleByClassNameAndYear(selectedSchoolYear, selectedRoom)
                .then((data) => {
                    setCurrentSchedule(data?.schedule || null);
                })
                .catch(() => setCurrentSchedule(null));
            setHasUnsavedChanges(false); // Reset on load
        } else {
            // Lấy từ generatedSchedules khi chưa có lịch chính thức
            const schedule = getScheduleForClass(
                generatedSchedules,
                selectedSchoolYear,
                selectedRoom
            );
            setCurrentSchedule(schedule);
            setHasUnsavedChanges(false); // Reset for generated schedules too
        }
    }, [hasSchedule, selectedSchoolYear, selectedRoom, generatedSchedules]);

    const handleScheduleUpdate = (newSchedule: any) => {
        if (hasSchedule) {
            // This is an edit to an existing, saved schedule
            setCurrentSchedule(newSchedule);
            setHasUnsavedChanges(true);
        } else {
            // Update the generated schedule in state
            setGeneratedSchedules((prev) => {
                const newGeneratedSchedules = JSON.parse(JSON.stringify(prev));
                const yearSchedule = newGeneratedSchedules[selectedSchoolYear];
                if (yearSchedule && yearSchedule.schedules) {
                    const classScheduleIndex = yearSchedule.schedules.findIndex(
                        (s: any) => s.class === selectedRoom
                    );
                    if (classScheduleIndex !== -1) {
                        yearSchedule.schedules[classScheduleIndex].schedule =
                            newSchedule;
                    }
                }
                return newGeneratedSchedules;
            });
        }
        toast.success("Hoán đổi hoạt động thành công!");
    };

    const sortScheduleByTime = (schedule: any) => {
        if (!schedule) return null;
        const sortedSchedule: { [key: string]: any[] } = {};
        for (const day in schedule) {
            if (Object.prototype.hasOwnProperty.call(schedule, day)) {
                sortedSchedule[day] = [...schedule[day]].sort((a, b) =>
                    a.time.localeCompare(b.time)
                );
            }
        }
        return sortedSchedule;
    };

    const handleSaveSchedule = async () => {
        if (!isScheduleGeneratedForYear && !hasUnsavedChanges) {
            toast.warn("Không có thay đổi nào để lưu.");
            return;
        }

        setLoading(true);
        try {
            // Case 1: Saving a newly generated schedule for the entire year
            if (isScheduleGeneratedForYear) {
                const yearScheduleData = generatedSchedules[selectedSchoolYear];
                if (!yearScheduleData || !yearScheduleData.schedules) {
                    toast.error("Dữ liệu lịch học được tạo không hợp lệ.");
                    setLoading(false);
                    return;
                }
                const schedulesToSave = JSON.parse(
                    JSON.stringify(yearScheduleData.schedules)
                );
                schedulesToSave.forEach((cs: any) => {
                    cs.schedule = sortScheduleByTime(cs.schedule);
                });
                await saveClassSchedule(selectedSchoolYear, schedulesToSave);
                toast.success(
                    `Đã lưu lịch học cho năm học ${selectedSchoolYear} thành công!`
                );
                setHasSchedule(true);
                handleCancelSchedule(); // Clear generated state
            }
            // Case 2: Saving updates to an existing, single class schedule
            else if (hasSchedule && hasUnsavedChanges) {
                if (!currentSchedule) {
                    toast.error("Không có lịch học hiện tại để lưu.");
                    setLoading(false);
                    return;
                }
                const sortedCurrentSchedule =
                    sortScheduleByTime(currentSchedule);
                const payload = [
                    { class: selectedRoom, schedule: sortedCurrentSchedule },
                ];
                await saveClassSchedule(selectedSchoolYear, payload);
                toast.success(
                    `Đã cập nhật lịch học cho lớp ${selectedRoom} thành công!`
                );
                setHasUnsavedChanges(false); // Reset dirty flag
            }
        } catch (error) {
            console.error("Lỗi khi lưu lịch học:", error);
            toast.error("Lỗi khi lưu lịch học. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "90vh",
                bgcolor: BACKGROUND_COLOR,
                overflow: "hidden",
                p: 2,
                gap: 3,
                boxSizing: "border-box",
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            <ScheduleListClassSidebar
                schoolYears={allSchoolYears}
                selectedSchoolYear={selectedSchoolYear}
                onSchoolYearChange={setSelectedSchoolYear}
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomChange={setSelectedRoom}
                hasSchedule={hasSchedule || isScheduleGeneratedForYear}
                genSchedule={genSchedule}
                onSetGenSchedule={setGenSchedule}
            />

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#f9fbfd",
                        borderRadius: 3,
                        p: 3,
                        boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
                        overflow: "auto",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            mb: 2,
                            bgcolor: "#eaf7ff",
                            borderRadius: 2,
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography fontWeight="bold">
                                👩‍🏫 Giáo viên:
                            </Typography>
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
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    <Typography>{name}</Typography>
                                    {name !== "Chưa phân công" && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                color: "#c62828",
                                                ml: 0.5,
                                                p: "2px",
                                                "&:hover": {
                                                    bgcolor: "#ffcdd2",
                                                },
                                            }}
                                            disabled={isReadOnly}
                                        ></IconButton>
                                    )}
                                </Box>
                            ))}
                        </Box>

                        <Typography fontWeight="bold">
                            🏫 Lớp: {selectedRoom}
                        </Typography>
                        <Typography fontWeight="bold">
                            📅 Năm học: {selectedSchoolYear}
                        </Typography>
                    </Box>

                    {loading && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "50vh",
                            }}
                        >
                            <LinearProgress variant="determinate" value={progress} sx={{ width: '60%', height: 10, borderRadius: 5 }} />
                            <Typography sx={{ mt: 2 }}>
                                Đang tự động tạo lịch học, vui lòng chờ... ({progress}%)
                            </Typography>
                        </Box>
                    )}

                    {!loading && currentSchedule && (
                        <ScheduleEditableTable
                            schedule={currentSchedule}
                            onScheduleUpdate={handleScheduleUpdate}
                            isReadOnly={isReadOnly}
                        />
                    )}

                    {!loading && !currentSchedule && selectedRoom && (
                        <Typography
                            sx={{
                                textAlign: "center",
                                mt: 4,
                                color: "text.secondary",
                            }}
                        >
                            Không có dữ liệu lịch học cho lớp này.
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            disabled={
                                hasSchedule ||
                                !isScheduleGeneratedForYear ||
                                isReadOnly
                            }
                            color="error"
                            onClick={handleCancelSchedule}
                        >
                            Hủy tạo lịch
                        </Button>
                        <Button
                            variant="contained"
                            disabled={
                                isReadOnly ||
                                loading ||
                                (!isScheduleGeneratedForYear &&
                                    !hasUnsavedChanges)
                            }
                            sx={{
                                bgcolor: PRIMARY_COLOR,
                                "&:hover": { bgcolor: PRIMARY_DARK },
                            }}
                            onClick={handleSaveSchedule}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Lưu lịch học"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    );
}
