import React, {ReactNode, useEffect} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {Card, CardContent, Typography, Grid, Box, Divider, Alert} from '@mui/material';
import GoogleSignInButton from "@components/Button/GoogleSignInButton.tsx";
import Logo from '@assets/images/logo.svg';
import {RootState} from "@/stores/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "@/stores/messageSlice.ts";
import {useGoogleLogin} from "@react-oauth/google";
import {loginWithGoogle} from "@/stores/authSlice.ts";

interface AuthLayoutProps {
    title: string;
    subTitle: string;
    formComponent: ReactNode;
    linkText: string;
    to: string;
}

const AuthLayout: React.FC<AuthLayoutProps>  = ({ title, subTitle, formComponent, linkText, to }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const signIn = useGoogleLogin({
        onSuccess: tokenResponse => {
            dispatch<any>(loginWithGoogle({accessToken: tokenResponse.access_token}))
                .unwrap()
                .catch((error: any) => {
                    console.log(error);
                });
        }
    });

    const { message, isError } = useSelector((state: RootState) => state.message);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(clearMessage());
        }, 2000);

        return () => clearTimeout(timer);
    }, [message, dispatch]);



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
                        <Grid container direction="column" spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Grid item>
                                        <Typography color="textPrimary" gutterBottom variant="h2">
                                            {title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {subTitle}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <RouterLink to="/">
                                            <Box component="img" src={Logo} alt="Logo" sx={{ maxHeight: 82 }} />
                                        </RouterLink>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center">
                                    <Grid item xs={12}>
                                        <GoogleSignInButton onClick={() => signIn()} />
                                    </Grid>
                                </Grid>

                                <Box alignItems="center" display="flex" mt={2}>
                                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                    <Typography color="textSecondary" variant="h5" sx={{ m: theme.spacing(2) }}>
                                        OR
                                    </Typography>
                                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                </Box>

                                {formComponent}
                            </Grid>
                            <Grid container justifyContent="flex-start" sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}>
                                <Grid item>
                                    <Typography variant="subtitle2" color="secondary" component={RouterLink} to={to} sx={{ textDecoration: 'none', pl: 2 }}>
                                        {linkText}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            {message && (
                <Alert
                    severity={isError ? 'error' : 'success'}  // Use 'success' for successful actions
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '0',
                        transform: 'translateX(-50%) translateY(-50%)',
                        maxWidth: '475px',
                    }}
                >
                    {message}
                </Alert>
            )}
        </Grid>
    );
};

export default AuthLayout;
