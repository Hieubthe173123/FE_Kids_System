import { Box, Typography, Paper, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

const FONT_FAMILY = "'Poppins', sans-serif";

const cards = [
    {
        title: 'Giá trị Sakura - Yêu thương & Tôn trọng',
        desc: 'Sakura xây dựng môi trường giáo dục dựa trên sự yêu thương, tôn trọng cá nhân, giúp trẻ phát triển nhân cách và tự tin thể hiện bản thân.',
        color: '#F9A84B',
        textColor: 'white',
        highlight: true,
    },
    {
        title: 'Chương trình học hiện đại, sáng tạo',
        desc: 'Chương trình tại Sakura kết hợp giữa kiến thức, kỹ năng sống, STEAM, tiếng Anh và các hoạt động trải nghiệm, giúp trẻ phát triển toàn diện.',
        color: '#fff',
        textColor: '#222',
        highlight: false,
    },
    {
        title: 'Đội ngũ giáo viên tận tâm, chuyên nghiệp',
        desc: 'Giáo viên Sakura giàu kinh nghiệm, tận tâm, luôn đồng hành, truyền cảm hứng và khơi dậy tiềm năng của từng học sinh.',
        color: '#fff',
        textColor: '#222',
        highlight: false,
    },
];

const KnowMoreSection = () => {
    return (
        <Box sx={{ py: 8, backgroundColor: '#FEFDFC' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: 6,
                    maxWidth: 1200,
                    mx: 'auto',
                }}
            >
                {/* Left cards */}
                <Box sx={{ flex: 1, minWidth: 320 }}>
                    <Typography variant="h5" fontWeight={900} sx={{ fontFamily: FONT_FAMILY, mb: 3 }}>
                        Tìm hiểu thêm về Sakura
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {cards.map((card, idx) => {
                            // Chỉ dropdown cho card 1 và 2 (idx 1, 2)
                            const isDropdown = idx === 1 || idx === 2;
                            const [open, setOpen] = useState(false);
                            return (
                                <Paper
                                    key={idx}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        background: card.color,
                                        color: card.textColor,
                                        boxShadow: card.highlight ? '0 4px 16px -4px #F9A84B55' : 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                        alignItems: 'flex-start',
                                        position: 'relative',
                                        minHeight: isDropdown ? 80 : undefined,
                                        transition: 'min-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                                        overflow: 'hidden',
                                    }}
                                    elevation={0}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: FONT_FAMILY }}>
                                            {card.title}
                                        </Typography>
                                        {isDropdown && (
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    ml: 1,
                                                    transition: 'background 0.2s',
                                                    background: open ? '#f9a84b22' : 'transparent',
                                                }}
                                                onClick={() => setOpen(!open)}
                                            >
                                                <ExpandMoreIcon
                                                    fontSize="small"
                                                    sx={{
                                                        transform: open ? 'rotate(180deg)' : 'none',
                                                        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                                                    }}
                                                />
                                            </IconButton>
                                        )}
                                    </Box>
                                    {card.highlight && card.desc && (
                                        <Typography variant="body2" sx={{ fontFamily: FONT_FAMILY, mt: 1, color: card.textColor }}>
                                            {card.desc}
                                        </Typography>
                                    )}
                                    {isDropdown && (
                                        <Collapse
                                            in={open}
                                            timeout={400}
                                            unmountOnExit
                                            sx={{
                                                width: '100%',
                                                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                                                minHeight: open ? 60 : 0,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    py: 1,
                                                    px: 0.5,
                                                    width: '100%',
                                                    animation: open ? 'fadeIn 0.4s' : undefined,
                                                    '@keyframes fadeIn': {
                                                        from: { opacity: 0, transform: 'translateY(-8px)' },
                                                        to: { opacity: 1, transform: 'translateY(0)' },
                                                    },
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontFamily: FONT_FAMILY, color: card.textColor }}>
                                                    {card.desc}
                                                </Typography>
                                            </Box>
                                        </Collapse>
                                    )}
                                </Paper>
                            );
                        })}
                    </Box>
                </Box>

                {/* Right image */}
                <Box
                    sx={{
                        flex: { xs: 'none', md: 1 },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: 380,
                        maxWidth: 520,
                        mt: { xs: 4, md: 0 },
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: 340, md: 540 },
                            height: { xs: 220, md: 320 },
                            borderRadius: 5,
                            overflow: 'hidden',
                            boxShadow: '0 10px 36px -8px #F9A84B55',
                            position: 'relative',
                            background: '#fff',
                        }}
                    >
                        <img
                            src={'/Đội ngũ.jpg'}
                            alt="Know more"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Decorative curve */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: 22,
                                background: 'linear-gradient(90deg, #F9A84B 60%, transparent)',
                                borderRadius: '0 0 24px 24px',
                                zIndex: 2,
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default KnowMoreSection;
