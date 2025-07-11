import { Box, Icon, Stack } from "@chakra-ui/react";
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
import PostDialogue from "../ui/post/PostDialogue";
import LogoIcon from "../icons/LogoIcon";
import MobileLogoIcon from "../icons/MobileLogoIcon";

const SideMenu = ({shouldHideHeader}) => {
  const { user } = useAuth();

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
      link: `/profile/${user?.uid}`,
    },
  ];

  const { logoutUser } = useAuth();

  const handleLogoutClick = async () => {
    await logoutUser();
  };

  return (
    <Stack
      bg="brand.500"
      w={{
        base: "0px",
        md: "130px",
        lg: "200px",
        lgx: "280px",
        xl: "350px",
      }}
      display={{
        base: "none",
        md: "flex",
      }}
      h="full"
      alignItems="end"
      position="sticky"
      top="115px"
      py={4}
      overflow="hidden"
    >
      {shouldHideHeader && (
        <Box mb="20px">
          <Icon
            as={LogoIcon}
            h="63px"
            w="100px"
            color="brand.300"
            cursor="pointer"
            display={{
              base: "none",
              lg: "block",
            }}
            mr={{
              base: 0,
              md: 0,
              lg: "40px",
              lgx: "55px",
              xl: "70px",
            }}
            mt="10px"
          />
          <Icon
            as={MobileLogoIcon}
            h="50px"
            w="60px"
            color="brand.300"
            cursor="pointer"
            mt="10px"
            mr="32px"
            display={{
              base: "none",
              md: "block",
              lg: "none",
            }}
          />
        </Box>
      )}
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
      <PostDialogue />
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
