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
import { useAuth } from "../../context/AuthContext";

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

  const { logoutUser } = useAuth();

  const handleLogoutClick = async () => {
    await logoutUser();
  };

  const handlePostClick = () => {};

  return (
    <Stack
      bg="brand.500"
      w={{
        base: "0px", // hidden
        md: "130px", // small sidebar on tablets
        lg: "200px", // normal sidebar
        lgx: "280px", // wide on mid-desktops
        xl: "350px", // full on large desktops
      }}
      display={{
        base: "none",
        md: "flex",
        lg: "flex",
      }}
      minH="calc(100vh - 115px)"
      maxH="calc(100vh - 115px)"
      alignItems="end"
      position="sticky"
      top="115px"
      py={4}
      overflow="auto"
    >
      <Box
        mr={{
          base: 0,
          md: "30px",
          lg: "0px",
          lgx: "30px",
          xl: "40px",
        }}
      >
        {sideMenuLinks.map((sideMenu) => (
          <Link to={sideMenu.link} key={sideMenu.text}>
            <RenderLink text={sideMenu.text} icon={sideMenu.icon} />
          </Link>
        ))}
      </Box>
      <SpinnerBtn
        text="Post"
        fontSize="16px"
        fontWeight="bold"
        rounded="full"
        height="40px"
        width={{
          base: "138px",
          md: "90px",
          lg: "120px",
          lgx: "120px",
          xl: "138px",
        }}
        mr={{
          base: "50px",
          md: "10px",
          lg: "40px",
          lgx: "40px",
          xl: "50px",
        }}
        type="button"
        onClick={handlePostClick}
      />
      <SpinnerBtn
        text="Logout"
        mt="12px"
        fontSize="16px"
        fontWeight="bold"
        rounded="full"
        height="4opx"
        width={{
          base: "138px",
          md: "90px",
          lg: "120px",
          lgx: "120px",
          xl: "138px",
        }}
        mr={{
          base: "50px",
          md: "10px",
          lg: "40px",
          lgx: "40px",
          xl: "50px",
        }}
        type="button"
        to="/auth"
        onClick={handleLogoutClick}
      />
    </Stack>
  );
};

export default SideMenu;
