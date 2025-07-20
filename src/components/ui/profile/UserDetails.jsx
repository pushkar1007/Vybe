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
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import EditProfileDialogue from "./EditProfileDialogue";
import SpinnerBtn from "../SpinnerBtn";
import { IoMdPersonAdd } from "react-icons/io";
import { RxEnvelopeClosed } from "react-icons/rx";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { HiUserRemove } from "react-icons/hi";
import { vybudreq } from "@/firebase/firebase.vybudreq";

const UserDetails = ({ userData, isOwner }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isVybud, setIsVybud] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (!user?.uid) return;
      try {
        const ref = doc(firebaseUserdb.db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCurrentUserData({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        console.error("Failed to fetch current user data", error);
      }
    };

    fetchCurrentUserData();
  }, [user]);

  useEffect(() => {
    if (currentUserData && userData) {
      const isInVybuds = currentUserData.vybuds?.includes(userData.id);
      setIsVybud(isInVybuds);
    }
  }, [currentUserData, userData]);

  useEffect(() => {
    const checkRequest = async () => {
      if (!user?.uid || !userData?.id || user.uid === userData.id) return;

      try {
        const reqId = `${user.uid}_${userData.id}`;
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
  }, [user, userData]);

  const handleClick = () => {
    navigate("/");
  };

  const handleDmClick = () => {
    navigate(`/chat-room/${user.uid}-${userData.id}`);
  };

  const handleVyBudClick = async () => {
    try {
      const reqId = `${user.uid}_${userData.id}`;
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
        userData.id,
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
      console.log("Removing Vybud from:", userData.id, user.uid);

      await firebaseUserdb.removeVyBud(userData.id, user);
      await firebaseUserdb.removeVyBud(user.uid, userData);

      const reqId = `${user.uid}_${userData.id}`;
      const ref = doc(firebaseUserdb.db, "vybudReqs", reqId);
      await deleteDoc(ref);

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
      <HStack
        borderBottom="1px solid"
        borderColor="brand.500"
        h="70px"
        alignItems="flex-start"
        px={4}
        py={3}
        gap={4}
      >
        <Icon
          as={FaArrowLeftLong}
          color="brand.500"
          my={1}
          onClick={handleClick}
          cursor="pointer"
        />
        <Stack gap={0} m={0}>
          <Heading m={0}>{userData?.handlename || "Anonymous"}</Heading>
          <Text fontSize="sm">
            {userData?.createdPosts?.length ?? 0} Post
            {userData?.createdPosts?.length === 1 ? "" : "s"}
          </Text>
        </Stack>
      </HStack>

      <Box
        bg="brand.300"
        w="full"
        h="160px"
        borderBottom="1px solid"
        borderColor="brand.500"
      >
        {userData?.banner && (
          <Image
            src={userData.banner}
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
        top="180px"
        left="20px"
      >
        {userData?.avatar ? (
          <Image
            src={userData.avatar}
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
            <Heading>{userData?.handlename || "Anonymous"}</Heading>
            <Text color="brand.100" lineHeight={1}>
              @{userData?.username || "unknown"}
            </Text>
          </Stack>
          <Text>{userData?.bio || "No bio added yet..."}</Text>
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
