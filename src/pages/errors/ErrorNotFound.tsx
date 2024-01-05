import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ErrorNotFound = () => (
    <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        textAlign="center"
        justifyContent="center"
    >
        <Container maxWidth="md">
            <img src="" alt="404" />
            <Typography align="center" variant="h1" mb={4}>
                Opps!!!
            </Typography>
            <Typography align="center" variant="h4" mb={4}>
                This page you are looking for could not be found.
            </Typography>
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/"
                disableElevation
            >
                Go Back to Home
            </Button>
        </Container>
    </Box>
);

export default ErrorNotFound;
