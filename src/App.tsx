import {ThemeProvider, StyledEngineProvider} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import themes from "@/themes";
import Routes from "@/routes/index";
import NavigationScroll from "@/layouts/NavigationScroll.tsx";

function App() {
    return (
        <>
            <NavigationScroll>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themes()}>
                        <CssBaseline/>
                        <Routes/>
                    </ThemeProvider>
                </StyledEngineProvider>
            </NavigationScroll>
        </>
    );
}

export default App
