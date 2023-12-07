import { Link as RouterLink } from 'react-router-dom';

import {useTheme} from "@mui/material/styles";
import {ForgotPasswordForm} from "@components/Form/ForgotPasswordForm.tsx";
import {Card, CardContent, Typography, Grid} from '@mui/material';

import Logo from '@assets/images/logo-dark.svg';

const ForgotPassword = () => {
    const theme = useTheme();

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ backgroundColor: theme.palette.common.black, height: '100%', minHeight: '100vh' }}
        >
            <Grid item xs={11} sm={7} md={6} lg={4}>
                <Card
                    sx={{
                        overflow: 'visible',
                        display: 'flex',
                        position: 'relative',
                        '& .MuiCardContent-root': {
                            flexGrow: 1,
                            flexBasis: '50%',
                            width: '50%'
                        },
                        maxWidth: '475px',
                        margin: '24px auto'
                    }}
                >
                    <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
                        <Grid container direction="column" spacing={4} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Typography color="textPrimary" gutterBottom variant="h2">
                                            Forgot Password
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Enter your email to reset your password
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <RouterLink to="/">
                                            <img alt="Auth method" src={Logo} />
                                        </RouterLink>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center">
                                    <ForgotPasswordForm />
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default ForgotPassword;