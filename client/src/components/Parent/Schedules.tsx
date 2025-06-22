import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    borderRadius: '12px',
    backgroundColor: '#f4fbff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginTop: theme.spacing(3),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
        transform: 'scale(1.01)',
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: '#46a2da',
    borderRadius: '12px',
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        fontWeight: 700,
        fontSize: '1.1rem',
        color: '#ffffff',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#fff',
        transition: 'transform 0.3s ease-in-out',
    },
    '&.Mui-expanded .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(180deg)',
    },
}));

interface Props {
    title: string;
    panelKey: string;
    expanded: boolean;
    onChange: (panel: string) => (_e: React.SyntheticEvent, isExpanded: boolean) => void;
    scheduleData: {
        time: string;
        subject: string;
        feedback?: string;
    }[];
}

export default function ScheduleAccordion({ title, panelKey, expanded, onChange, scheduleData }: Props) {
    return (
        <StyledAccordion expanded={expanded} onChange={onChange(panelKey)}>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #4194cb',
                        boxShadow: 'none',
                        bgcolor: '#f0f9ff',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#4194cb' }}>
                                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>⏰ Thời gian</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>📚 Hoạt động</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>💬 Nhận xét</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scheduleData.map((item, index) => (
                                <TableRow
                                    key={index}
                                    hover
                                    sx={{
                                        '&:nth-of-type(even)': { backgroundColor: '#eaf6fd' },
                                        '&:nth-of-type(odd)': { backgroundColor: '#ffffff' },
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500, borderBottom: '1px solid #d1eaf5' }}>{item.time}</TableCell>
                                    <TableCell sx={{ whiteSpace: 'pre-line', borderBottom: '1px solid #d1eaf5' }}>{item.subject}</TableCell>
                                    <TableCell
                                        sx={{
                                            borderBottom: '1px solid #d1eaf5',
                                            color: '#e6687a',
                                            fontStyle: 'italic',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {item.feedback || '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </AccordionDetails>
        </StyledAccordion>
    );
}