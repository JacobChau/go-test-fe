import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// third party
import { useSelector, useDispatch } from 'react-redux';

// project import


// assets
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {RootState} from "@/stores/store.ts";
import {menuOpen} from "@/stores/customizationSlice.ts";
import value from "@assets/scss/_themes-vars.module.scss";

// ==============================|| NAV ITEM ||============================== //

const NavItem = ({ item, level }) => {
    const customization = useSelector((state: RootState) => state.customization);
    const dispatch = useDispatch();
    const Icon = item.icon;
    const itemIcon = item.icon ? <Icon color="inherit" /> : <ArrowForwardIcon color="inherit" sx={{ fontSize: level > 0 ? 'inherit' : 'default' }} />;
    let itemTarget = '';
    if (item.target) {
        itemTarget = '_blank';
    }
    let listItemProps = { component: Link, to: item.url };
    if (item.external) {
        listItemProps = { component: 'a', href: item.url };
    }

    return (
        <ListItemButton
            disabled={item.disabled}
            sx={{
                ...(level > 1 && { backgroundColor: 'transparent !important', py: 1, borderRadius: '5px' }),
                borderRadius: '5px',
                marginBottom: '5px',
                pl: `${level * 16}px`
            }}
            selected={customization.isOpen === item.id}
            component={Link}
            onClick={() => dispatch(menuOpen(item.id))}
            to={item.url}
            target={itemTarget}
            {...listItemProps}
        >
            <ListItemIcon sx={{ minWidth: 25 }}>{itemIcon}</ListItemIcon>
            <ListItemText
                primary={
                    <Typography sx={{ pl: 1.4 }} variant={customization.isOpen === item.id ? 'subtitle1' : 'body1'} color="inherit">
                        {item.title}
                    </Typography>
                }
                secondary={
                    item.caption && (
                        <Typography variant="caption" sx={{
                            pl: 2,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: value.primary,
                            padding: '5px 15px 5px',
                            textTransform: 'uppercase',
                            marginTop: '10px',
                        }}>
                            {item.caption}
                        </Typography>
                    )
                }
            />
            {item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number,
    icon: PropTypes.object,
    target: PropTypes.object,
    url: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    caption: PropTypes.string,
    chip: PropTypes.object,
    color: PropTypes.string,
    label: PropTypes.string,
    avatar: PropTypes.object
};

export default NavItem;
