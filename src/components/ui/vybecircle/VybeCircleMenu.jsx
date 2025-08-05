import { Icon, Menu, Portal, Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { CgMoreVertical } from "react-icons/cg";
import PostDialogue from "../post/PostDialogue";
import VybeCircleDialog from "./VybeCircleDialog";
import firebaseVybecirclesdb from "@/firebase/firebase.vybecirclesdb";
import { useNavigate } from "react-router-dom";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { useEffect, useState } from "react";

const VybeCircleMenu = ({ vybeCircleData, onUpdate, setVybeCircleData }) => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const member = vybeCircleData?.users?.some(
      (userRef) => userRef.path === `users/${user.uid}`,
    );
    setIsMember(member);
  }, [vybeCircleData, user.uid]);

  const handleDelete = async () => {
    await firebaseVybecirclesdb.deleteVybecircle(vybeCircleData.vybecircleId);
    navigate(-1);
    refreshUser();
  };

  const handleJoin = async () => {
    await firebaseVybecirclesdb.addUser(user.uid, vybeCircleData.vybecircleId);
    await firebaseUserdb.addVybeCircle(vybeCircleData.vybecircleId, user);

    setVybeCircleData((prev) => ({
      ...prev,
      users: [...(prev.users || []), { path: `users/${user.uid}` }],
    }));

    refreshUser();
    setIsMember(true);
  };

  const handleExit = async () => {
    await firebaseVybecirclesdb.removeUser(
      user.uid,
      vybeCircleData.vybecircleId,
    );
    await firebaseUserdb.removeVybeCircle(vybeCircleData.vybecircleId, user);

    setVybeCircleData((prev) => ({
      ...prev,
      users: (prev.users || []).filter(
        (ref) => ref.path !== `users/${user.uid}`,
      ),
    }));

    refreshUser();
    setIsMember(false);
  };

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
            {!isMember && (
              <Text cursor="pointer" pl={1} pb={2} onClick={handleJoin}>
                Join
              </Text>
            )}
            {isMember && <PostDialogue isVybeCircle />}
            {vybeCircleData.createdBy === user.uid && (
              <VybeCircleDialog
                text={"Edit"}
                user={user}
                styling={{ display: "flex", justifyContent: "start" }}
                vybeCircleData={vybeCircleData}
                onUpdate={onUpdate}
              />
            )}
            {isMember && (
              <Text cursor="pointer" pl="4px" onClick={handleExit}>
                Exit
              </Text>
            )}
            {vybeCircleData.createdBy === user.uid && (
              <Text
                pt={2}
                color="red"
                cursor="pointer"
                pl="4px"
                onClick={handleDelete}
              >
                Delete
              </Text>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default VybeCircleMenu;
