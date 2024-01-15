import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type Props = {
    className?: string;
    children: any;
    sx?: any;
};

const BlankCard = ({ children, className, sx }: Props) => {

    const theme = useTheme();
    const borderColor = theme.palette.divider;

    return (
        <Card
            sx={{ p: 3, border: `1px solid ${borderColor}`, ...sx }}
            className={className}
            variant="outlined"
        >
            {children}
        </Card>
    );
};

export default BlankCard;
