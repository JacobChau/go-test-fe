import React from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';

// project import
import Header from './Header';

// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
    width: '100%',
    minHeight: '100vh',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3)
    },
    padding: theme.spacing(5)
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <AppBar position="fixed" sx={{ zIndex: 1200 }}>
                <Toolbar>
                    <Header />
                </Toolbar>
            </AppBar>
            <Main>
                <OutletDiv>
                    <Outlet />
                </OutletDiv>
            </Main>
        </Box>
    );
};

export default MainLayout;
