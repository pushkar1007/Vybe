import { Box, CloseButton, Drawer, Icon, Portal } from "@chakra-ui/react";
import MobileLogoIcon from "../icons/MobileLogoIcon";
import { TbUserFilled } from "react-icons/tb";
import VybCirclesIcon from "../icons/VybCirclesIcon";
import VyBudsIcon from "../icons/VyBudsIcon";
import { LuSearch } from "react-icons/lu";
import { MdNotifications } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import RenderLink from "../ui/primitives/RenderLink";
import { useRef } from "react";

const HamburgerMenu = () => {
  const navLinks = [
    {
      icon: AiFillHome,
      text: "Home",
      link: "/",
      key: "HomeMobile",
    },
    {
      icon: MdNotifications,
      text: "Notifications",
      link: "/notifications",
      key: "NotificationMobile",
    },
    {
      icon: LuSearch,
      text: "Explore",
      link: "/explore",
      key: "ExploreMobile",
    },
    {
      icon: VyBudsIcon,
      text: "VyBuds",
      link: "/vybuds",
      key: "VyBudsMobile",
    },
    {
      icon: VybCirclesIcon,
      text: "VybCircles",
      link: "/vybcircles",
      key: "VybCirclesMobile",
    },
    {
      icon: TbUserFilled,
      text: "Profile",
      link: "/profile",
      key: "ProfileMobile",
    },
  ];

  const menuRef = useRef(null);

  const handleClose = () => {
    if (Drawer.ref) {
      menuRef.current.close();
    }
  };

  return (
    <Drawer.Root placement="start" closeOnInteractOutside={false}>
      <Drawer.Trigger asChild>
        <Icon as={MobileLogoIcon} h="50px" w="60px" color="brand.300" />
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="brand.500" w="240px">
            <Drawer.Body mt="60px">
              <Box>
                {navLinks.map((navLink) => (
                  <Link
                    to={navLink.link}
                    key={navLink.key}
                    onClick={handleClose}
                  >
                    <RenderLink text={navLink.text} icon={navLink.icon} />
                  </Link>
                ))}
              </Box>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton
                size="xl"
                color="brand.400"
                _hover={{ bg: "transparent" }}
              />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default HamburgerMenu;
