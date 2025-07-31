import { Box, HStack, Icon, Stack } from "@chakra-ui/react";
import LogoIcon from "../icons/LogoIcon";
import ProfileMenu from "../ui/profile/ProfileMenu";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import Search from "../ui/primitives/Search";

const Header = () => {
  return (
    <HStack
      bg="brand.500"
      px={{ base: "4", md: "10", lg: "20" }}
      py="4"
      justifyContent="space-between"
      alignItems="center"
      top="0"
      zIndex="1100"
      position="sticky"
      minH="115px"
      maxH="115px"
      w="full"
    >
      <Stack display={{ base: "block", md: "none" }}>
        <HamburgerMenu />
      </Stack>
      <Box
        position="relative"
        ml={{
          base: "10px",
          md: "0px",
          lg: "0px",
          xl: "100px",
        }}
        top="-25px"
      >
        <Link to="/">
          <Icon
            as={LogoIcon}
            h="63px"
            w="100px"
            color="brand.300"
            cursor="pointer"
            display={{
              base: "none",
              md: "block",
            }}
            position="absolute"
          />
        </Link>
      </Box>
      <HStack
        gap={{
          base: "20px",
          md: "40px",
          lg: "60px",
        }}
        mt={{
          base: "none",
          md: "8px",
        }}
        alignItems="end"
        position="relative"
      >
        <Search scope="all" />
        <Box cursor="pointer" rounded="full" minW="50px" w="50px" h="50px">
          <ProfileMenu />
        </Box>
      </HStack>
    </HStack>
  );
};

export default Header;
