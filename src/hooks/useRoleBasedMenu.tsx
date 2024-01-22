import { useState, useEffect } from "react";
import fullMenuItems, { MenuItem } from "@/full-menu-items.ts";
import { UserRole } from "@/constants/rolePermissions.ts";
import { rolePermissions } from "@/constants";

export const useRoleBasedMenu = (role?: UserRole): MenuItem[] => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (role) {
      const filteredMenuItems = filterMenuItemsByRole(role);
      setMenuItems(filteredMenuItems);
    }
  }, [role]);

  return menuItems;
};

const filterMenuItemsByRole = (role: UserRole): MenuItem[] => {
  const permissions = rolePermissions[role];

  // Function to check if an item or any of its children are accessible
  const isItemAccessible = (item: MenuItem): boolean => {
    // Check if the item itself is accessible
    if (permissions.canAccess.includes(item.id)) {
      return true;
    }

    // Check if any children are accessible
    if (item.children) {
      return item.children.some((child) => isItemAccessible(child));
    }

    return false;
  };

  // Filter top-level menu items based on accessibility
  return fullMenuItems
    .filter((item) => isItemAccessible(item))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(isItemAccessible).map((childItem) => {
            // Additional mapping if the child has its own children
            if (childItem.children) {
              return {
                ...childItem,
                children: childItem.children.filter(isItemAccessible),
              };
            }
            return childItem;
          }),
        };
      }
      return item;
    });
};
