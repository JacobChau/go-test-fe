import React, { FC } from "react";
import { useTheme, styled } from '@mui/material/styles';
import { useMediaQuery, Divider, Drawer, Grid, Box } from '@mui/material';
import MenuList from '@/layouts/MainLayout/SideBar/MenuList';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Logo from '@assets/images/logo.svg';
import { drawerWidth } from '@/config';

interface NavProps {
    style?: React.CSSProperties;
}

const Nav = styled('nav', {
    shouldForwardProp: (prop) => prop !== 'style',
})<NavProps>(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0
    }
}));

interface SidebarProps {
    drawerOpen: boolean;
    drawerToggle: () => void;
    window?: () => Window;
}

const Sidebar: FC<SidebarProps> = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    const drawer = (
        <>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                    sx={{
                        ...theme.mixins.toolbar,
                        lineHeight: 0,
                        background: theme.palette.primary.main,
                        boxShadow: theme.shadows[4]
                    }}
                >
                    <Grid item>
                        <Box component="img" src={Logo} alt="Logo" sx={{ maxHeight: 82 }} />
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <PerfectScrollbar style={{ height: 'calc(100vh - 65px)', padding: '10px' }}>
                <MenuList />
            </PerfectScrollbar>
        </>
    );

    const container = window !== undefined ? window().document.body : undefined;

    return (
        <Nav>
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        borderRight: 'none',
                        boxShadow: theme.shadows[4],
                        top: { sm: 0, md: 64 }
                    }
                }}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>
        </Nav>
    );
};

export default Sidebar;
