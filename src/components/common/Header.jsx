import { Box, HStack, Icon, Image, Stack } from "@chakra-ui/react";
import LogoIcon from "../icons/LogoIcon";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import Search from "../ui/primitives/Search";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();

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
        <Image
          src={userData?.avatar || "/images/profilepic.png"}
          alt="Profile"
          boxSize="50px"
          rounded="full"
          cursor="pointer"
          onClick={() => navigate(`/profile/${userData.id}`)}
        />
      </HStack>
    </HStack>
  );
};

export default Header;
