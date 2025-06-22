import { HStack, Icon } from "@chakra-ui/react";
import LogoIcon from "../icons/LogoIcon";
import SearchTab from "../ui/SearchTab";
import ProfileMenu from "../ui/ProfileMenu";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <HStack bg="brand.500" padding="26px" justifyContent="space-between">
      <Link to="/">
        <Icon
          as={LogoIcon}
          h="63px"
          w="100px"
          color="brand.300"
          ml="50px"
          cursor="pointer"
        />
      </Link>
      <HStack gap="60px" mt="8px" alignItems="end">
        <SearchTab />
        <ProfileMenu />
      </HStack>
    </HStack>
  );
};

export default Header;
