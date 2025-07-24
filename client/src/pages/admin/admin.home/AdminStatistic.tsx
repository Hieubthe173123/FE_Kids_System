import { useEffect, useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Avatar,
    useTheme
} from '@mui/material'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { motion } from 'framer-motion'
import { statisticDataAdmin } from '../../../services/admin.service'

const AdminStatistic = () => {
    const [data, setData] = useState<any>({})
    const theme = useTheme()

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

    const teachers = data?.teachers || []
    const students = data?.students || []
    const parents = data?.parents || []

    const totalTeachers = teachers.length
    const totalStudents = students.length
    const totalParents = parents.length

    const genderStats = teachers.reduce(
        (acc: any, t: any) => {
            acc[t.gender] = (acc[t.gender] || 0) + 1
            return acc
        },
        { male: 0, female: 0 }
    )

    const locationStats = students.reduce((acc: any, s: any) => {
        acc[s.address] = (acc[s.address] || 0) + 1
        return acc
    }, {})

    const topLocations = (Object.entries(locationStats) as [string, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }))

    const ageStats = students.reduce((acc: any, s: any) => {
        acc[s.age] = (acc[s.age] || 0) + 1
        return acc
    }, {})

    const ageLabels = Object.keys(ageStats).sort((a, b) => +a - +b)
    const ageValues = ageLabels.map((k) => ageStats[k])

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    }

    return (
        <Box p={4}>
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h4" gutterBottom>
                    📊 Thống kê Hệ Thống
                </Typography>
            </motion.div>

            {/* Tổng quan số lượng */}
            <Box
                display="flex"
                flexWrap="wrap"
                gap={3}
                justifyContent="flex-start"
                mt={2}
                mb={4}
            >
                {[{ label: 'Giáo viên', value: totalTeachers, icon: '👩‍🏫' },
                { label: 'Học sinh', value: totalStudents, icon: '👶' },
                { label: 'Phụ huynh', value: totalParents, icon: '👪' }].map((item, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 * i }}
                    >
                        <Paper
                            sx={{
                                flex: 1,
                                minWidth: 240,
                                p: 3,
                                textAlign: 'center',
                                borderRadius: 3
                            }}
                            elevation={3}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 56,
                                    height: 56,
                                    mx: 'auto',
                                    mb: 2
                                }}
                            >
                                {item.icon}
                            </Avatar>
                            <Typography variant="h6">{item.label}</Typography>
                            <Typography variant="h4">{item.value}</Typography>
                        </Paper>
                    </motion.div>
                ))}
            </Box>

            {/* Biểu đồ tròn */}
            <Box
                display="flex"
                flexWrap="wrap"
                gap={3}
                justifyContent="flex-start"
                mb={4}
            >
                {/* Giới tính giáo viên */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.4 }}
                    style={{ flex: 1, minWidth: 300 }}
                >
                    <Paper sx={{ p: 3, flex: 1 }}>
                        <Typography variant="h6" mb={2}>
                            🔵 Giới tính giáo viên
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    arcLabel: (item) => `${item.label}: ${item.value}`,
                                    data: [
                                        { label: 'Nam', value: genderStats.male || 0 },
                                        { label: 'Nữ', value: genderStats.female || 0 }
                                    ]
                                }
                            ]}
                            width={360}
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

                {/* Địa chỉ học sinh */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                    style={{ flex: 1, minWidth: 300 }}
                >
                    <Paper sx={{ p: 3, flex: 1 }}>
                        <Typography variant="h6" mb={2}>
                            🏙️ Học sinh theo địa chỉ
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    arcLabel: (item) => `${item.label}: ${item.value}`,
                                    data: topLocations
                                }
                            ]}
                            width={360}
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
            </Box>

            {/* Biểu đồ cột */}
            <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
                style={{ flex: 1 }}
            >
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        📈 Phân bố độ tuổi học sinh
                    </Typography>
                    <BarChart
                        xAxis={[{ label: 'Tuổi', data: ageLabels }]}
                        series={[{ label: 'Số lượng', data: ageValues }]}
                        width={window.innerWidth - 500}
                        height={300}
                    />
                </Paper>
            </motion.div>
        </Box>
    )
}

export default AdminStatistic
