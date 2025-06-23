import { HStack, Icon } from "@chakra-ui/react";
import LogoIcon from "../icons/LogoIcon";
import InputTab from "../ui/InputTab";
import ProfileMenu from "../ui/ProfileMenu";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

const Header = () => {
  return (
    <HStack
      bg="brand.500"
      px={{ base: "4", md: "10", lg: "20" }}
      py="4"
      justifyContent="space-between"
      alignItems="center"
      top="0"
      zIndex="1000"
      position="sticky"
      minH="115px"
      maxH="115px"
    >
      <Link to="/">
        <Icon
          as={LogoIcon}
          h="63px"
          w="100px"
          color="brand.300"
          ml="120px"
          cursor="pointer"
        />
      </Link>
      <HStack gap="60px" mt="8px" alignItems="end">
        <InputTab
          startElement={<LuSearch color="white" size="18px" />}
          placeholder="Wanna Vybe?"
          w="fit-content"
          maxW="260px"
        />
        <ProfileMenu />
      </HStack>
    </HStack>
  );
};

export default Header;
