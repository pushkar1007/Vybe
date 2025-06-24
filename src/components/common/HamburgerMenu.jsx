import { CloseButton, Drawer, Icon, Portal } from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import SideMenu from "./SideMenu";
import MobileLogoIcon from "../icons/MobileLogoIcon";

const HamburgerMenu = () => {
  return (
    <Drawer.Root placement="start">
      <Drawer.Trigger asChild>
        <Icon as={MobileLogoIcon} size="2xl" color="brand.300" />
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body>
                <SideMenu />
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default HamburgerMenu