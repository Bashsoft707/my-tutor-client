import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { PiNotePencil } from "react-icons/pi";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { MdOutlineLightMode } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";

export const SideNav = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false);
  const navLinks = [
    {
      title: "New Chat",
      icon: <RxDashboard className="text-white [&>path]:stroke-white" />,
      href: "#chat",
    },
    {
      title: "Clear Discussion",
      icon: <BsTrash3 className="text-white [&>path]:stroke-white" />,
      href: "/",
    },
    {
      title: "Light Mode",
      icon: <MdOutlineLightMode className="text-white [&>path]:stroke-white" />,
      href: "/quantity-updates",
    },
    {
      title: "Updates & FAQ",
      icon: <PiNotePencil className="text-white [&>path]:stroke-white" />,
      href: "/suppliers",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <Sidebar
        className="h-screen shadow-lg shrink-0 [&>div]:overflow-y-hidden [&>div]:hover:overflow-y-auto duration-150 bg-[#353535]"
        collapsed={collapsed}
        onMouseEnter={() => {
          setCollapsed(false);
        }}
        onMouseLeave={() => {
          setCollapsed(true);
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: "#353535",
                color: "#FFFFFF",
              },
            },
          }}
        >
          {navLinks.map((link) => (
            <MenuItem
              key={link.href}
              className="text-white hover:text-black"
              icon={link.icon}
              component={<NavLink to={link.href} />}
            >
              {link.title}
            </MenuItem>
          ))}
          <MenuItem
            icon={<GoSignOut className="text-red-500 [&>path]:stroke-white" />}
            component={<Link to="#" />}
            className="text-red-500"
            onClick={logout}
          >
            Log Out
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};
