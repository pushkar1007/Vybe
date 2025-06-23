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
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const { logoutUser } = useAuth();

  const handleLogoutClick = async () => {
    await logoutUser();
    navigate("/auth");
  };

  const handlePostClick = () => {};

  return (
    <Stack
      bg="brand.500"
      w="350px"
      minH="calc(100vh - 115px)"
      maxH="calc(100vh - 115px)"
      alignItems="end"
      position="sticky"
      py={4}
      overflow="auto"
    >
      <Box mr="30px" key="navlinks">
        {sideMenuLinks.map((sideMenu) => (
          <Link to={sideMenu.link}>
            <RenderLink text={sideMenu.text} icon={sideMenu.icon} />
          </Link>
        ))}
      </Box>
      <SpinnerBtn
        text="Post"
        fontSize="16px"
        fontWeight="bold"
        rounded="full"
        height="4opx"
        width="138px"
        mr="50px"
        onClick={handlePostClick}
      />
      <SpinnerBtn
        text="Logout"
        mt="12px"
        fontSize="16px"
        fontWeight="bold"
        rounded="full"
        height="4opx"
        width="138px"
        mr="50px"
      />
    </Stack>
  );
};

export default SideMenu;
