import { Link } from "react-router-dom";

import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

// third party
import { useSelector, useDispatch } from "react-redux";

// assets
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { RootState } from "@/stores/store.ts";
import { menuOpen } from "@/stores/customizationSlice.ts";
import value from "@assets/scss/_themes-vars.module.scss";
import React from "react";

// ==============================|| NAV ITEM ||============================== //

interface NavItemProps {
  item: {
    id: string;
    title: string;
    caption: string;
    icon: any;
    url: string;
    disabled: boolean;
    target: string;
    external: boolean;
    chip: {
      color: string;
      variant: string;
      size: string;
      label: string;
      avatar: any;
    };
  };
  level: number;
}

const NavItem: React.FC<NavItemProps> = ({ item, level }) => {
  const customization = useSelector((state: RootState) => state.customization);
  const dispatch = useDispatch();
  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon color="inherit" />
  ) : (
    <ArrowForwardIcon
      color="inherit"
      sx={{ fontSize: level > 0 ? "inherit" : "default" }}
    />
  );
  let itemTarget = "";
  if (item.target) {
    itemTarget = "_blank";
  }
  let listItemProps = { component: Link, to: item.url };
  if (item.external) {
    // @ts-ignore
    listItemProps = { component: "a", href: item.url };
  }

  return (
    <ListItemButton
      disabled={item.disabled}
      sx={{
        ...(level > 1 && {
          backgroundColor: "transparent !important",
          py: 1,
          borderRadius: "5px",
        }),
        borderRadius: "5px",
        marginBottom: "5px",
        pl: `${level * 16}px`,
      }}
      selected={customization.isOpen === item.id}
      onClick={() => dispatch(menuOpen(item.id))}
      // @ts-ignore
      component={Link}
      // @ts-ignore
      to={item.url}
      target={itemTarget}
      {...listItemProps}
    >
      <ListItemIcon sx={{ minWidth: 25 }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography
            sx={{ pl: 1.4 }}
            variant={customization.isOpen === item.id ? "subtitle1" : "body1"}
            color="inherit"
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{
                pl: 2,
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: value.primary,
                padding: "5px 15px 5px",
                textTransform: "uppercase",
                marginTop: "10px",
              }}
            >
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        // @ts-ignore
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

export default NavItem;
