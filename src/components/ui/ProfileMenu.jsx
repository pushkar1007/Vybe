import { Box, Icon, Menu, Portal } from "@chakra-ui/react";
import ProfileIcon from "../icons/ProfileIcon";

const ProfileMenu = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Box rounded="100%" boxSize="50px" bg="white" cursor="pointer">
          <Icon as={ProfileIcon} />
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New Text File</Menu.Item>
            <Menu.Item value="new-file">New File...</Menu.Item>
            <Menu.Item value="new-win">New Window</Menu.Item>
            <Menu.Item value="open-file">Open File...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ProfileMenu;
