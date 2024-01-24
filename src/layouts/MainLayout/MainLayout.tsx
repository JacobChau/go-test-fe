import React from "react";
import { Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery, AppBar, Box, Toolbar } from "@mui/material";

// project import
import { drawerWidth } from "@/config";
import Header from "./Header";
import Sidebar from "@/layouts/MainLayout/SideBar/SideBar.tsx";

// custom style
interface MainProps {
  drawerOpen: boolean; // Add this line
}

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})<MainProps>(({ theme, drawerOpen }) => ({
  width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
  minHeight: "100vh",
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: drawerOpen ? 0 : -drawerWidth,
  [theme.breakpoints.down("md")]: {
    marginLeft: 0, // ensure on smaller screens, the main content is not pushed
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const OutletDiv = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
  padding: theme.spacing(5),
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    setDrawerOpen(matchUpMd);
  }, [matchUpMd]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <AppBar position="fixed" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <Header drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
      <Main drawerOpen={drawerOpen}>
        <Box sx={theme.mixins.toolbar} />
        <OutletDiv>
          <Outlet />
        </OutletDiv>
      </Main>
    </Box>
  );
};

export default MainLayout;
