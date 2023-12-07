import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton } from '@mui/material';

// project import
import ProfileSection from './ProfileSection';
import theme from "@/themes";
import Logo from "@assets/images/logo-main.svg";
import {Link as RouterLink} from "react-router-dom";

// ==============================|| HEADER ||============================== //

const Header = (() => {
    const theme = useTheme();

    return (
        <>
            <Box width="100%" sx={{ pr: { md: 2 } }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <RouterLink to="/">
                        <Box component="img" src={Logo} alt="Logo" sx={{ maxHeight: 50 }} />
                    </RouterLink>
                </Grid>
            </Box>
            <ProfileSection />
        </>
    );
});

export default Header;
