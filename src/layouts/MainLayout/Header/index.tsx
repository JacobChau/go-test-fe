import React from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Grid, IconButton } from "@mui/material";

// project import
import ProfileSection from "./ProfileSection";

// assets
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import Logo from "@assets/images/logo-main.svg";
import { drawerWidth } from "@/config";
import NotificationSection from "@/layouts/MainLayout/Header/NotificationSection.tsx";

// ==============================|| HEADER ||============================== //

interface HeaderProps {
  drawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <Box width={drawerWidth}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Grid
              item
              justifyContent={{ xs: "center", md: "flex-start" }}
              alignItems="center"
              container
            >
              <Box
                component="img"
                src={Logo}
                alt="Logo"
                sx={{ maxHeight: 50 }}
              />
            </Grid>
          </Box>
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      {/*<NotificationSection />*/}
      <ProfileSection />
    </>
  );
};

export default Header;
