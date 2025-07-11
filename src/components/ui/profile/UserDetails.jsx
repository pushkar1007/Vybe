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
import { doc, getDoc } from "firebase/firestore";
import { HiUserRemove } from "react-icons/hi";

const UserDetails = ({ userData, isOwner }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isVybud, setIsVybud] = useState(false);
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

  const handleClick = () => {
    navigate("/");
  };

  const handleDmClick = () => {
    navigate(`/chat-room/${user.uid}-${userData.id}`);
  };

  const handleVyBudClick = async () => {
    try {
      await firebaseUserdb.addVybud(userData.id, user);
      toast.success("Added as VyBud successfully");
      setIsVybud(true);
    } catch (error) {
      console.error("Failed to add VyBud");
    }
  };

  const handleRemoveVybudClick = async () => {
    try {
      await firebaseUserdb.removeVyBud(userData.id, user);
      toast.success("Removed from VyBuds");
      setIsVybud(false);
    } catch (error) {
      console.error("Failed to remove VyBud", error);
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
          <Heading m={0}>{userData?.handlename || "Unknown User"}</Heading>
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
            <Heading>{userData?.handlename || "Unknown User"}</Heading>
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
                text={isVybud ? "Remove VyBud" : "Add VyBud"}
                fontSize="16px"
                fontWeight="bold"
                rounded="full"
                height="40px"
                border="1px solid #EF5D60"
                w={isVybud ? "180px" : "160px"}
                icon={isVybud ? HiUserRemove : IoMdPersonAdd}
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
