import React from "react";
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GoogleIcon from '@assets/images/social-google.svg';
import useMediaQuery from "@mui/material/useMediaQuery";

const GoogleSignInButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const matchDownSM = useMediaQuery('(max-width:899.95px)');

    const theme = useTheme();
    return (
        <Button
            fullWidth={true}
            sx={{
                fontSize: { md: '1rem', xs: '0.875rem' },
                fontWeight: 500,
                backgroundColor: theme.palette.grey[50],
                color: theme.palette.grey[600],
                textTransform: 'capitalize',
                '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                },
            }}
            size="large"
            variant="contained"
            onClick={onClick}
        >
            <img
                src={GoogleIcon}
                alt="google"
                width="20px"
                style={{
                    marginRight: matchDownSM ? '8px' : '16px',
                }}
            />{' '}
            Sign in with Google
        </Button>
    );
}

export default GoogleSignInButton;
