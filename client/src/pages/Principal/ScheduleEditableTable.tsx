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
    };

    return (
        <Paper
            sx={{ mt: 2, overflow: "hidden", borderRadius: 3, boxShadow: 3 }}
        >
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "primary.main",
                    color: "white",
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    Thời Khóa Biểu
                </Typography>
                {!isReadOnly && (
                    <Tooltip title="Hoán đổi 2 hoạt động đã chọn">
                        <span>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<SwapHorizIcon />}
                                disabled={selectedActivities.length !== 2}
                                onClick={handleSwap}
                            >
                                Hoán đổi
                            </Button>
                        </span>
                    </Tooltip>
                )}
            </Box>
            <TableContainer sx={{ maxHeight: "calc(90vh - 300px)" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow
                            sx={{
                                "& .MuiTableCell-root": {
                                    bgcolor: "primary.light",
                                    color: "white",
                                    fontWeight: "bold",
                                },
                            }}
                        >
                            <TableCell align="center">Thời gian</TableCell>
                            {WEEKDAYS.map((day) => (
                                <TableCell key={day} align="center">
                                    {day}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scheduleByTime.map((row) => (
                            <TableRow key={row.time} hover>
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: "bold",
                                        bgcolor: "grey.100",
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
                                                    ? "grey.200"
                                                    : checked
                                                      ? "secondary.light"
                                                      : "white",
                                                border: checked
                                                    ? "2px solid"
                                                    : "1px solid",
                                                borderColor: checked
                                                    ? "secondary.main"
                                                    : "grey.200",
                                                cursor:
                                                    activity &&
                                                    !activity.fixed &&
                                                    !isReadOnly
                                                        ? "pointer"
                                                        : "default",
                                                transition:
                                                    "background-color 0.2s",
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
                                                        gap: 1,
                                                    }}
                                                >
                                                    {!activity.fixed &&
                                                        !isReadOnly && (
                                                            <Checkbox
                                                                size="small"
                                                                checked={
                                                                    checked
                                                                }
                                                                disabled={
                                                                    isDisabled
                                                                }
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
                                                    <Box textAlign="left">
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={500}
                                                        >
                                                            {activity.activity}
                                                        </Typography>
                                                        {/* <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            (Tuổi:{" "}
                                                            {activity.age})
                                                        </Typography>
                                                        {activity.fixed && (
                                                            <Typography
                                                                variant="caption"
                                                                display="block"
                                                                color="error.main"
                                                                fontWeight="bold"
                                                            >
                                                                (Cố định)
                                                            </Typography>
                                                        )} */}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                "—"
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
    );
};
