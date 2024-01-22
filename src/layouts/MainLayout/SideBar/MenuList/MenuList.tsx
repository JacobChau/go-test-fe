import NavGroup from "@/layouts/MainLayout/SideBar/MenuList/NavGroup/NavGroup.tsx";
import UserService from "@/api/services/userService.ts";
import { Resource, UserAttributes } from "@/types/apis";
import { useEffect, useState } from "react";
import { useRoleBasedMenu } from "@/hooks/useRoleBasedMenu.tsx";

// ==============================|| MENULIST ||============================== //

const MenuList = () => {
  const [user, setUser] = useState<Resource<UserAttributes> | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await UserService.getCurrentUser();
      setUser(data);
    };
    fetchUser().catch((err) => console.log(err));
  }, []);

  const menuItems = useRoleBasedMenu(user?.attributes.role);

  return (
    <div>
      {menuItems.map((item) => (
        <NavGroup key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;
