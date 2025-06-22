import { Box, Stack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdNotifications } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { TbUserFilled } from "react-icons/tb";
import VyBudsIcon from "../icons/VyBudsIcon";
import VybCirclesIcon from "../icons/VybCirclesIcon";
import RenderLink from "../ui/RenderLink";
import SpinnerBtn from "../ui/SpinnerBtn";
import { Link } from "react-router-dom";

const SideMenu = () => {
  const sideMenuLinks = [
    {
      icon: AiFillHome,
      text: "Home",
      link: "/",
    },
    {
      icon: MdNotifications,
      text: "Notifications",
      link: "/notifications",
    },
    {
      icon: LuSearch,
      text: "Explore",
      link: "/explore",
    },
    {
      icon: VyBudsIcon,
      text: "VyBuds",
      link: "/vybuds",
    },
    {
      icon: VybCirclesIcon,
      text: "VybCircles",
      link: "/vybcircles",
    },
    {
      icon: TbUserFilled,
      text: "Profile",
      link: "/profile",
    },
  ];

  return (
    <Stack
      bg="brand.500"
      w="272px"
      alignItems="end"
      height="calc(100vh - 115px)"
    >
      <Box mr="18px" key="navlinks">
        {sideMenuLinks.map((sideMenu) => (
          <Link to={sideMenu.link}>
            <RenderLink text={sideMenu.text} icon={sideMenu.icon} />
          </Link>
        ))}
      </Box>
      <SpinnerBtn text="Profile" fontSize="16px" fontWeight="bold" />
      <SpinnerBtn text="Logout" mt="12px" fontSize="16px" fontWeight="bold" />
    </Stack>
  );
};

export default SideMenu;
