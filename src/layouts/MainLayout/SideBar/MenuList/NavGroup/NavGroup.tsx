import { FC } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import { List, Typography } from "@mui/material";
import NavItem from "@/layouts/MainLayout/SideBar/MenuList/NavItem";
import NavCollapse from "@/layouts/MainLayout/SideBar/MenuList/NavCollapse/NavCollapse.tsx";
import { MenuItem } from "@/full-menu-items.ts";

interface NavGroupProps {
  item: MenuItem;
}

const NavGroup: FC<NavGroupProps> = ({ item }) => {
  const theme = useTheme();

  const items = item.children
    ? item.children.map((menu) => {
        switch (menu.type) {
          case "collapse":
            return <NavCollapse key={menu.id} menu={menu} level={1} />;
          case "item":
            return <NavItem key={menu.id} item={menu} level={1} />;
          default:
            return (
              <Typography
                key={menu.id}
                variant="h6"
                color="error"
                align="center"
              >
                Menu Item Error
              </Typography>
            );
        }
      })
    : [];

  return (
    <List
      subheader={
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: theme.palette.primary.main,
            padding: "5px 15px 5px",
            textTransform: "uppercase",
            marginTop: "10px",
          }}
          display="block"
          gutterBottom
        >
          {item.title}
          {item.caption && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 400,
                color: theme.palette.primary.main,
                textTransform: "capitalize",
              }}
              display="block"
              gutterBottom
            >
              {item.caption}
            </Typography>
          )}
        </Typography>
      }
    >
      {items}
    </List>
  );
};

export default NavGroup;
