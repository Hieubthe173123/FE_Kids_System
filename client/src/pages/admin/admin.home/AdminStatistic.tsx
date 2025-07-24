import { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Typography,
    useTheme,
    Grid,
    Paper,
    Avatar
} from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { motion } from 'framer-motion'
import { statisticDataAdmin } from '../../../services/admin.service'

// Gộp StatCard component tại đây
const StatCard = ({
    icon,
    label,
    value,
    color = 'primary',
}: {
    icon: string
    label: string
    value: number
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}) => {
    const theme = useTheme()

    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                },
            }}
        >
            <Avatar
                sx={{
                    bgcolor: theme.palette[color].main,
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2,
                    fontSize: 30,
                }}
            >
                {icon}
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
                {label}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={color}>
                {value}
            </Typography>
        </Paper>
    )
}

const AdminStatistic = () => {
    const [data, setData] = useState<any>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await statisticDataAdmin()
                setData(res)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const teachers = useMemo(() => data?.teachers || [], [data])
    const students = useMemo(() => data?.students || [], [data])
    const parents = useMemo(() => data?.parents || [], [data])

    const totalTeachers = useMemo(() => teachers.length, [teachers])
    const totalStudents = useMemo(() => students.length, [students])
    const totalParents = useMemo(() => parents.length, [parents])

    const genderStats = useMemo(() => {
        return teachers.reduce(
            (acc: any, t: any) => {
                acc[t.gender] = (acc[t.gender] || 0) + 1
                return acc
            },
            { male: 0, female: 0 }
        )
    }, [teachers])

    const topLocations = useMemo(() => {
        const locationStats = students.reduce((acc: any, s: any) => {
            acc[s.address] = (acc[s.address] || 0) + 1
            return acc
        }, {})

        return (Object.entries(locationStats) as [string, number][])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([label, value]) => ({ label, value }))
    }, [students])

    const { ageLabels, ageValues } = useMemo(() => {
        const ageStats = students.reduce((acc: any, s: any) => {
            acc[s.age] = (acc[s.age] || 0) + 1
            return acc
        }, {})

        const labels = Object.keys(ageStats).sort((a, b) => +a - +b)
        const values = labels.map((k) => ageStats[k])

        return { ageLabels: labels, ageValues: values }
    }, [students])

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 }
    }

    const chartCardStyle = {
        borderRadius: 4,
        p: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }

    return (
        <Box p={4}>
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h4" fontWeight={700} mb={3}>
                    📊 Bảng Thống Kê Hệ Thống
                </Typography>
            </motion.div>

            <Grid container spacing={3} mb={4}>
                {[
                    { label: 'Giáo viên', value: totalTeachers, icon: '👩‍🏫', color: 'primary' },
                    { label: 'Học sinh', value: totalStudents, icon: '👶', color: 'success' },
                    { label: 'Phụ huynh', value: totalParents, icon: '👪', color: 'secondary' }
                ].map((item, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i} {...({} as any)}>
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.1 * i }}
                        >
                            <StatCard {...({} as any)}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                color={item.color}
                            />
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6} {...({} as any)}>
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.3 }}
                    >
                        <Paper sx={{ ...chartCardStyle, height: '100%' }}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                🔵 Tỉ lệ giới tính giáo viên
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        arcLabel: (item) => `${item.label}: ${item.value}`,
                                        data: [
                                            { label: 'Nam', value: genderStats.male || 0 },
                                            { label: 'Nữ', value: genderStats.female || 0 }
                                        ],
                                    },
                                ]}
                                height={300}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fill: '#fff',
                                        fontSize: 14
                                    }
                                }}
                            />
                        </Paper>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6} {...({} as any)}>
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                    >
                        <Paper sx={{ ...chartCardStyle, height: '100%' }}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                🏙️ Học sinh theo địa chỉ
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        arcLabel: (item) => `${item.label}: ${item.value}`,
                                        data: topLocations,
                                    },
                                ]}
                                height={300}
                                sx={{
                                    [`& .${pieArcLabelClasses.root}`]: {
                                        fill: '#fff',
                                        fontSize: 14
                                    }
                                }}
                            />
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
            >
                <Paper sx={chartCardStyle}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        📈 Phân bố độ tuổi học sinh
                    </Typography>
                    <BarChart
                        xAxis={[{ label: 'Tuổi', data: ageLabels }]}
                        series={[{ label: 'Số lượng', data: ageValues }]}
                        width={window.innerWidth < 1000 ? window.innerWidth - 80 : 1000}
                        height={350}
                    />
                </Paper>
            </motion.div>
        </Box>
    )
}

export default AdminStatistic
