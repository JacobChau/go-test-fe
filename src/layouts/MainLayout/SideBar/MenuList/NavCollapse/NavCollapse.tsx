import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, ListItemIcon, ListItemText, Collapse, List, ListItemButton } from '@mui/material';

// project import
import NavItem from '../NavItem';

// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {MenuItem} from "@/menu-items.ts";

// ==============================|| NAV COLLAPSE ||============================== //
interface NavCollapseProps {
    menu: MenuItem;
    level: number;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ menu, level }) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);
    };

    const menus = menu.children ? menu.children.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                Menu Items Error
            </Typography>
            );
        }
    }) : [];

    const Icon = menu.icon;
    const menuIcon = menu.icon ? <Icon /> : <ArrowForwardIcon sx={{ fontSize: level > 0 ? 'inherit' : 'default' }} />;
    return (
        <>
            <ListItemButton
                sx={{
        borderRadius: '5px',
            mb: 0.6,
            pl: `${level * 16}px`,
    ...(level > 1 && { backgroundColor: 'transparent !important', py: 1, borderRadius: '5px' })
    }}
    selected={selected === menu.id}
    onClick={handleClick}
    >
    <ListItemIcon sx={{ minWidth: !menu.icon ? '25px' : 'unset' }}>{menuIcon}</ListItemIcon>
    <ListItemText
    primary={
        <Typography variant={selected === menu.id ? 'subtitle1' : 'body1'} color="inherit" sx={{ pl: 1.9 }}>
    {menu.title}
    </Typography>
}
    secondary={
        menu.caption && (
            <Typography variant="caption" sx={{
                fontSize: '0.6875rem',
                fontWeight: 400,
                color: theme.palette.primary.main,
                textTransform: 'capitalize',
                pl: 2
            }}
                        display="block" gutterBottom>
    {menu.caption}
    </Typography>
)
}
    />
    {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
    {menus}
    </List>
    </Collapse>
    </>
);
};

export default NavCollapse;
