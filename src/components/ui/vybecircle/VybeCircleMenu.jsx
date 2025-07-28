import { Icon, Menu, Portal } from "@chakra-ui/react";

import { useAuth } from "@/context/AuthContext";
import { VybeCircleDialog } from "./VybeCircleDialog";
import { CgMoreVertical } from "react-icons/cg";

import PostDialogue from "../post/PostDialogue";

const VybeCircleMenu = ({ vybeCircleData }) => {
  const { user } = useAuth();

  //the side menu of vybecircle header in vybe circle home page
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Icon
          as={CgMoreVertical}
          color="brand.500"
          my={1}
          ml={"auto"}
          height={"90%"}
          cursor="pointer"
          fontSize={"32px"}
        />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <PostDialogue></PostDialogue>
            <VybeCircleDialog
              text={"edit"}
              user={user}
              styling={{ display: "flex", justifyContent: "start" }}
              vybeCircleData={vybeCircleData}
            />
            <Menu.Item value="new-win">Exit</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default VybeCircleMenu;
