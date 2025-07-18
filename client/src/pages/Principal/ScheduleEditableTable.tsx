import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    Box,
    Button,
    Tooltip,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type Activity = {
    id: string;
    age: string;
    time: string;
    activity: string;
    fixed: boolean;
};

type Schedule = {
    [weekday: string]: Activity[];
};

type SelectedActivity = {
    day: string;
    time: string;
    activity: Activity;
};

type Props = {
    schedule: Schedule;
    onScheduleUpdate: (newSchedule: Schedule) => void;
    isReadOnly: boolean;
};

export const ScheduleEditableTable: React.FC<Props> = ({
    schedule,
    onScheduleUpdate,
    isReadOnly,
}) => {
    const [selectedActivities, setSelectedActivities] = useState<
        SelectedActivity[]
    >([]);

    // Reset selection when schedule changes
    useEffect(() => {
        setSelectedActivities([]);
    }, [schedule]);

    const timeSlots = useMemo(() => {
        const allTimes = new Set<string>();
        Object.values(schedule).forEach((dayActivities) => {
            dayActivities.forEach((act) => allTimes.add(act.time));
        });
        return Array.from(allTimes).sort((a, b) => a.localeCompare(b));
    }, [schedule]);

    const scheduleByTime = useMemo(() => {
        return timeSlots.map((time) => {
            const row: { [key: string]: any } = { time };
            WEEKDAYS.forEach((day) => {
                const activity = schedule[day]?.find(
                    (act) => act.time === time
                );
                row[day] = activity || null;
            });
            return row;
        });
    }, [schedule, timeSlots]);

    const handleSelect = (day: string, activity: Activity) => {
        if (activity.fixed || isReadOnly) return;

        const newSelection = [...selectedActivities];
        const existingIndex = newSelection.findIndex(
            (sel) =>
                sel.day === day &&
                sel.activity.id === activity.id &&
                sel.time === activity.time
        );

        if (existingIndex > -1) {
            newSelection.splice(existingIndex, 1);
        } else {
            if (newSelection.length < 2) {
                newSelection.push({ day, time: activity.time, activity });
            }
        }
        setSelectedActivities(newSelection);
    };

    const handleSwap = () => {
        if (selectedActivities.length !== 2) return;

        const [sel1, sel2] = selectedActivities;
        const newSchedule = JSON.parse(JSON.stringify(schedule));

        // Find the actual activity objects in the new schedule
        const activity1 = newSchedule[sel1.day].find(
            (act: Activity) => act.time === sel1.time
        );
        const activity2 = newSchedule[sel2.day].find(
            (act: Activity) => act.time === sel2.time
        );

        if (!activity1 || !activity2) return;

        // To correctly swap activities, we swap their content (everything but the time).
        // The time property determines the slot in the table, so it must remain.
        const tempContent = {
            id: activity1.id,
            age: activity1.age,
            activity: activity1.activity,
            fixed: activity1.fixed,
        };

        activity1.id = activity2.id;
        activity1.age = activity2.age;
        activity1.activity = activity2.activity;
        activity1.fixed = activity2.fixed;

        activity2.id = tempContent.id;
        activity2.age = tempContent.age;
        activity2.activity = tempContent.activity;
        activity2.fixed = tempContent.fixed;

        onScheduleUpdate(newSchedule);
        setSelectedActivities([]);
    };

    const isSelected = (day: string, activity: Activity | null) => {
        if (!activity) return false;
        return selectedActivities.some(
            (sel) =>
                sel.day === day &&
                sel.activity.id === activity.id &&
                sel.time === activity.time
        );
    }

    return (
        <Box sx={{ width: '100%', overflowX: 'auto', maxWidth: '100vw' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
                {!isReadOnly && (
                    <Tooltip title="Chọn 2 hoạt động để hoán đổi">
                        <span>
                            <Button
                                variant="contained"
                                color="warning"
                                startIcon={<SwapHorizIcon />}
                                disabled={selectedActivities.length !== 2}
                                onClick={handleSwap}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    px: 2.5,
                                    py: 1,
                                    boxShadow: '0 2px 8px 0 rgba(255,193,7,0.10)',
                                    borderRadius: 2,
                                    transition: 'all 0.2s',
                                }}
                            >
                                Hoán đổi
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Box>
            <Paper
                sx={{
                    mt: 0,
                    overflow: "hidden",
                    borderRadius: 4,
                    boxShadow: "0px 6px 24px rgba(65,148,203,0.10)",
                    border: '1.5px solid #e3eaf5',
                }}
            >
                <Box
                    sx={{
                        p: 0.4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "#4194cb",
                        color: "white",
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        boxShadow: "0 2px 8px 0 rgba(65,148,203,0.08)",
                    }}
                >
                </Box>
                <TableContainer sx={{ maxHeight: "calc(90vh - 300px)", bgcolor: '#f7fbff', width: '100%' }}>
                    <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{
                                    bgcolor: "#4194cb",
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    borderTopLeftRadius: 4,
                                    borderRight: '2px solid #fff',
                                    py: 1,
                                    px: 1,
                                    width: '12%',
                                    minWidth: 80,
                                }}>Thời gian</TableCell>
                                {WEEKDAYS.map((day, idx) => (
                                    <TableCell key={day} align="center" sx={{
                                        bgcolor: "#4194cb",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        borderRight: idx === WEEKDAYS.length - 1 ? undefined : '2px solid #fff',
                                        py: 1,
                                        px: 1,
                                        width: `${88 / WEEKDAYS.length}%`,
                                        minWidth: 80,
                                    }}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scheduleByTime.map((row) => (
                                <TableRow key={row.time} hover sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            fontWeight: "bold",
                                            bgcolor: "#e3eaf5",
                                            fontSize: 15,
                                            borderRight: '2px solid #fff',
                                            width: '12%',
                                            minWidth: 80,
                                        }}
                                    >
                                        {row.time}
                                    </TableCell>
                                    {WEEKDAYS.map((day) => {
                                        const activity: Activity | null = row[day];
                                        const checked = isSelected(day, activity);
                                        const isDisabled =
                                            !checked &&
                                            selectedActivities.length >= 2;

                                        return (
                                            <TableCell
                                                key={`${day}-${row.time}`}
                                                align="center"
                                                sx={{
                                                    bgcolor: activity?.fixed
                                                        ? "#f5f5f5"
                                                        : checked
                                                            ? "#ffe082"
                                                            : "white",
                                                    border: checked
                                                        ? "2.5px solid #ffa000"
                                                        : "1px solid #e3eaf5",
                                                    cursor:
                                                        activity &&
                                                            !activity.fixed &&
                                                            !isReadOnly
                                                            ? "pointer"
                                                            : "default",
                                                    transition:
                                                        "background-color 0.2s",
                                                    fontSize: 15,
                                                    width: `${88 / WEEKDAYS.length}%`,
                                                    minWidth: 80,
                                                    py: 1.5,
                                                }}
                                                onClick={() =>
                                                    activity &&
                                                    handleSelect(day, activity)
                                                }
                                            >
                                                {activity ? (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent:
                                                                "center",
                                                            gap: 1.5,
                                                        }}
                                                    >
                                                        {!activity.fixed &&
                                                            !isReadOnly && (
                                                                <Checkbox
                                                                    size="medium"
                                                                    checked={
                                                                        checked
                                                                    }
                                                                    disabled={
                                                                        isDisabled
                                                                    }
                                                                    sx={{
                                                                        '& .MuiSvgIcon-root': { fontSize: 24 },
                                                                    }}
                                                                    onChange={() =>
                                                                        handleSelect(
                                                                            day,
                                                                            activity
                                                                        )
                                                                    }
                                                                    onClick={(e) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                />
                                                            )}
                                                        <Box textAlign="left" sx={{ width: '100%' }}>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={500}
                                                                sx={{ textAlign: 'center', fontSize: 15 }}
                                                            >
                                                                {activity.activity}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: '#bdbdbd', fontSize: 15 }}>—</Typography>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );

};
