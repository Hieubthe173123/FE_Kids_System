import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import BrushIcon from '@mui/icons-material/Brush';

const FONT_FAMILY = "'Poppins', sans-serif";

const programsData = [
    {
        icon: <SportsSoccerIcon sx={{ fontSize: 60, color: '#F9A84B' }} />,
        title: 'Vận động & Thể chất',
        description: 'Chương trình vận động giúp trẻ phát triển thể chất, tăng cường sức khỏe và sự linh hoạt thông qua các hoạt động ngoài trời, trò chơi vận động và thể thao phù hợp lứa tuổi.',
        featured: false,
    },
    {
        icon: <AudiotrackIcon sx={{ fontSize: 60, color: 'white' }} />,
        title: 'Âm nhạc & Nhịp điệu',
        description: 'Trẻ được làm quen với âm nhạc, nhịp điệu, phát triển cảm xúc, khả năng cảm thụ nghệ thuật và sự tự tin thể hiện bản thân qua các tiết học hát, múa, chơi nhạc cụ.',
        featured: true,
    },
    {
        icon: <BrushIcon sx={{ fontSize: 60, color: '#F9A84B' }} />,
        title: 'Mỹ thuật & Sáng tạo',
        description: 'Các hoạt động vẽ, tô màu, làm thủ công giúp trẻ phát triển tư duy sáng tạo, khả năng quan sát và sự khéo léo của đôi tay.',
        featured: false,
    },
];

interface ProgramCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    featured: boolean;
}

import { Dialog, DialogContent, DialogTitle, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TransitionProps } from '@mui/material/transitions';
import { useState, forwardRef } from 'react';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProgramCard = ({ icon, title, description, featured }: ProgramCardProps) => {
    const featuredColor = '#29C2B4';
    const standardColor = '#F9A84B';
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Paper
                elevation={featured ? 8 : 0}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    minHeight: 370,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '24px',
                    color: featured ? 'white' : 'text.primary',
                    backgroundColor: featured ? featuredColor : 'white',
                    border: featured ? 'none' : `2px dotted ${standardColor}`,
                    boxShadow: featured ? `0 10px 30px -5px ${featuredColor}77` : 'none',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                    },
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            mb: 2,
                            display: 'inline-flex',
                            p: 1.5,
                            borderRadius: '50%',
                            backgroundColor: featured ? 'white' : 'transparent',
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, fontFamily: FONT_FAMILY }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: FONT_FAMILY, color: featured ? 'rgba(255,255,255,0.9)' : 'text.secondary', minHeight: 60 }}>
                        {description}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    sx={{
                        mt: 3,
                        borderRadius: '50px',
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontFamily: FONT_FAMILY,
                        color: featured ? 'white' : standardColor,
                        borderColor: featured ? 'white' : standardColor,
                        '&:hover': {
                            backgroundColor: featured ? 'rgba(255,255,255,0.1)' : 'rgba(249, 168, 75, 0.1)',
                            borderColor: featured ? 'white' : standardColor,
                        },
                    }}
                    onClick={handleOpen}
                >
                    Xem chi tiết
                </Button>
            </Paper>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="program-dialog-title"
                aria-describedby="program-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 2,
                        fontFamily: FONT_FAMILY,
                        minWidth: { xs: '90vw', sm: 400 },
                        maxWidth: 500,
                        background: featured ? featuredColor : 'white',
                        color: featured ? 'white' : 'text.primary',
                    },
                }}
            >
                <DialogTitle id="program-dialog-title" sx={{ fontFamily: FONT_FAMILY, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {title}
                    <IconButton onClick={handleClose} sx={{ color: featured ? 'white' : standardColor }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ fontFamily: FONT_FAMILY, textAlign: 'center' }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
                    <Typography id="program-dialog-description" variant="body1" sx={{ fontFamily: FONT_FAMILY, color: featured ? 'rgba(255,255,255,0.9)' : 'text.secondary', mb: 2 }}>
                        {description}
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const ProgramsSection = () => {
    return (
        <Box sx={{ py: 8, backgroundColor: '#FEFDFC' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h2" fontWeight="900" sx={{ fontFamily: FONT_FAMILY }}>
                        Chương trình nổi bật
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '500px', mx: 'auto', fontFamily: FONT_FAMILY }}>
                        Trường mầm non Sakura dành cho trẻ từ 1-5 tuổi với chương trình học tập hiện đại, phát triển toàn diện.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                    }}
                >
                    {programsData.map((program, index) => (
                        <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: { xs: '100%', md: 0 }, display: 'flex' }}>
                            <ProgramCard {...program} />
                        </Box>
                    ))}
                </Box>

            </Container>
        </Box>
    );
};