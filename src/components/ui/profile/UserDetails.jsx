import ProfileIcon from "@/components/icons/ProfileIcon";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import EditProfileDialogue from "./EditProfileDialogue";
import SpinnerBtn from "../primitives/SpinnerBtn";
import { IoMdPersonAdd } from "react-icons/io";
import { RxEnvelopeClosed } from "react-icons/rx";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { HiUserRemove } from "react-icons/hi";
import { vybudreq } from "@/firebase/firebase.vybudreq";
import { firebaseNotifications } from "@/firebase/firebase.notifications";

const UserDetails = ({ data, isOwner }) => {
  const navigate = useNavigate();
  const { user, userData: currentUserData } = useAuth();

  const [isVybud, setIsVybud] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (currentUserData && data) {
      const isInVybuds = currentUserData.vybuds?.includes(data.id);
      setIsVybud(isInVybuds);
    }
  }, [currentUserData, data]);

  useEffect(() => {
    const checkRequest = async () => {
      if (!user?.uid || !data?.id || user.uid === data.id) return;

      try {
        const reqId = `${user.uid}_${data.id}`;
        const ref = doc(firebaseUserdb.db, "vybudReqs", reqId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const status = snap.data().status;
          if (status === 0) {
            setRequestSent(true);
          } else if (status === 1) {
            setIsVybud(true);
          }
        } else {
          setRequestSent(false);
        }
      } catch (err) {
        console.error("Error checking request", err);
      }
    };
    checkRequest();
  }, [user, data]);

  const handleDmClick = () => {
    navigate(`/chat-room/${user.uid}-${data.id}`);
  };

  const handleVyBudClick = async () => {
    try {
      const reqId = `${user.uid}_${data.id}`;
      const ref = doc(firebaseUserdb.db, "vybudReqs", reqId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const status = snap.data().status;
        if (status === 0) {
          setRequestSent(true);
          return toast.info("Request already sent.");
        } else if (status === 1) {
          setIsVybud(true);
          return toast.info("You are already Vybuds.");
        }
      }

      await vybudreq.createVybudRequest(
        user.uid,
        data.id,
        currentUserData.handlename,
      );
      toast.success("VyBud request sent!");
      setRequestSent(true);
    } catch (error) {
      console.error("Failed to send VyBud request", error);
      toast.error("Could not send VyBud request");
    }
  };

  const handleRemoveVybudClick = async () => {
    try {
      console.log("Removing Vybud from:", data.id, user.uid);

      await firebaseUserdb.removeVyBud(data.id, user);
      await firebaseUserdb.removeVyBud(user.uid, data);

      const reqId = `${user.uid}_${data.id}`;
      const ref = doc(firebaseUserdb.db, "vybudReqs", reqId);
      await deleteDoc(ref);
      await firebaseNotifications.removeNotification(`vybud_${reqId}`);
      await firebaseNotifications.removeNotification(`vybud_${reverse(reqId)}`);
      toast.success("Removed from VyBuds");
      setIsVybud(false);
      setRequestSent(false);
    } catch (error) {
      console.error(
        "Failed to remove VyBud",
        error?.stack || error?.message || error,
      );
      toast.error("Something went wrong");
    }
  };

  return (
    <Stack position="relative" gap={0}>
      <Box
        bg="brand.300"
        w="full"
        h="160px"
        borderBottom="1px solid"
        borderColor="brand.500"
      >
        {data?.banner && (
          <Image
            src={data.banner}
            alt="Banner"
            h="100%"
            w="100%"
            objectFit="cover"
          />
        )}
      </Box>

      <Box
        border="1px solid #000000"
        rounded="full"
        h="100px"
        w="100px"
        position="absolute"
        bg="brand.400"
        top="110px"
        left="20px"
      >
        {data?.avatar ? (
          <Image
            src={data.avatar}
            alt="Profile"
            boxSize="100px"
            rounded="full"
          />
        ) : (
          <Image as={ProfileIcon} />
        )}
      </Box>

      <HStack
        borderBottom="1px solid"
        borderColor="brand.500"
        justifyContent="space-between"
        p={4}
      >
        <Stack mt="50px" gap="10px">
          <Stack gap={0}>
            <Heading>{data?.handlename || "Anonymous"}</Heading>
            <Text color="brand.100" lineHeight={1}>
              @{data?.username || "unknown"}
            </Text>
          </Stack>
          <Text>{data?.bio || "No bio added yet..."}</Text>
        </Stack>

        {isOwner ? (
          <HStack>
            <EditProfileDialogue />
          </HStack>
        ) : (
          <HStack>
            <Box
              border="1px solid #EF5D60"
              boxSize="40px"
              rounded="12px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="4px 8px 4px rgba(0,0,0,0.1)"
              cursor="pointer"
              onClick={handleDmClick}
            >
              <Icon as={RxEnvelopeClosed} />
            </Box>
            <Box position="relative">
              <SpinnerBtn
                text={
                  requestSent
                    ? "Request Sent"
                    : isVybud
                      ? "Remove VyBud"
                      : "Add VyBud"
                }
                isDisabled={requestSent}
                fontSize="16px"
                fontWeight="bold"
                rounded="full"
                height="40px"
                border="1px solid #EF5D60"
                w={isVybud || requestSent ? "180px" : "160px"}
                icon={
                  requestSent
                    ? RxEnvelopeClosed
                    : isVybud
                      ? HiUserRemove
                      : IoMdPersonAdd
                }
                onClick={isVybud ? handleRemoveVybudClick : handleVyBudClick}
              />
            </Box>
          </HStack>
        )}
      </HStack>
    </Stack>
  );
};

export default UserDetails;
