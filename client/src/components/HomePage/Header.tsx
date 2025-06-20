import { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box,
    IconButton, Drawer, List, ListItem, ListItemText, alpha
} from '@mui/material';
import { Menu as MenuIcon, MailOutline as ContactIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const mainColor = '#46a2da';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDrawer = (open: boolean) => () => setMobileOpen(open);

    const menuItems = [
        { label: 'Trang chủ', onClick: () => navigate('/') },
        { label: 'Đăng ký nhập học', onClick: () => navigate('/registration') },
        { label: 'Chủ đề', onClick: () => { } },
        { label: 'Liên hệ', onClick: () => navigate('/sign-in') },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                elevation={scrolled ? 6 : 0}
                sx={{
                    backgroundColor: scrolled ? alpha(mainColor, 0.95) : mainColor,
                    transition: 'all 0.3s ease',
                    zIndex: (theme) => theme.zIndex.drawer + 2
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ px: 2, minHeight: '72px !important' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 700,
                                color: 'white',
                                cursor: 'pointer',
                                flexGrow: 1
                            }}
                            onClick={() => navigate('/')}
                        >
                            Sakura School
                        </Typography>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            <Button sx={{ color: 'white' }} onClick={menuItems[1].onClick}>Đăng ký nhập học</Button>
                            <Button sx={{ color: 'white' }} onClick={menuItems[0].onClick}>Trang chủ</Button>
                            <Button
                                variant="contained"
                                startIcon={<ContactIcon />}
                                sx={{
                                    borderRadius: '20px',
                                    bgcolor: 'white',
                                    color: mainColor,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        bgcolor: alpha('#ffffff', 0.9),
                                    },
                                }}
                                onClick={menuItems[3].onClick}
                            >
                                Đăng nhập
                            </Button>
                        </Box>

                        <IconButton
                            edge="end"
                            onClick={toggleDrawer(true)}
                            sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={toggleDrawer(false)}>
                    <List>
                        {menuItems.map(({ label, onClick }, idx) => (
                            <ListItem button key={idx} onClick={onClick}>
                                <ListItemText primary={label} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
