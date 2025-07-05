import { Box, Icon, Image, Menu, Portal } from "@chakra-ui/react";
import ProfileIcon from "../../icons/ProfileIcon";
import { useAuth } from "@/context/AuthContext";

const ProfileMenu = () => {
  const { userData } = useAuth();

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        {userData?.avatar ? (
          <Image
            src={userData?.avatar}
            alt="User Avatar"
            w="50px"
            h="50px"
            rounded="full"
            objectFit="cover"
          />
        ) : (
          <Box
            w="50px"
            h="50px"
            rounded="full"
            overflow="hidden"
            border="1px solid black"
          >
            <ProfileIcon />
          </Box>
        )}
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
