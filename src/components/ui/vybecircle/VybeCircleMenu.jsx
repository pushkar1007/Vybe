import { Icon, Menu, Portal, Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { CgMoreVertical } from "react-icons/cg";
import PostDialogue from "../post/PostDialogue";
import VybeCircleDialog from "./VybeCircleDialog";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import { useNavigate } from "react-router-dom";

const VybeCircleMenu = ({ vybeCircleData, onUpdate }) => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await firebaseVybecirclesdb.deleteVybecircle(vybeCircleData.vybecircleId);
    navigate(-1);
    refreshUser();
  }

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
            <PostDialogue isVybeCircle />
            <VybeCircleDialog
              text={"Edit"}
              user={user}
              styling={{ display: "flex", justifyContent: "start" }}
              vybeCircleData={vybeCircleData}
              onUpdate={onUpdate}
            />
            <Text cursor="pointer" pl="4px">
              Exit
            </Text>
            {vybeCircleData.createdBy === user.uid ? (
              <Text pt={2} color="red" cursor="pointer" pl="4px" onClick={handleDelete}>
                Delete
              </Text>
            ) : null}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default VybeCircleMenu;
