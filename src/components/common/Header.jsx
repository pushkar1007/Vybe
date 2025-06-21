import { HStack, Icon } from "@chakra-ui/react";
import LogoIcon from "../icons/LogoIcon";
import SearchTab from "../ui/SearchTab";
import ProfileMenu from "../ui/ProfileMenu";

const Header = () => {
  return (
    <HStack bg="brand.500" padding="26px" justifyContent="space-between" >
      <Icon as={LogoIcon} h="63px" w="100px" color="brand.300" ml="50px" />
      <HStack gap="60px" mt="8px" alignItems="end">
        <SearchTab />
        <ProfileMenu/>
      </HStack>
    </HStack>
  );
};

export default Header;
