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
import { RxEnvelopeClosed } from "react-icons/rx";
import { HiUserRemove } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { toast } from "react-toastify";

const VyBudCard = ({ vybud, onRemove }) => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [presence, setPresence] = useState({ online: null, lastSeen: null });

  useEffect(() => {
    if (!vybud) return;

    const db = getDatabase();
    const presenceRef = ref(db, `/onlineUsers/${vybud.id}`);

    const unsub = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPresence({
          online: data.online,
          lastSeen: data.lastSeen,
        });
      } else {
        setPresence({ online: false, lastSeen: null });
      }
    });

    return () => unsub();
  }, [vybud.id]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

    if (secondsAgo < 60) return "Just now";
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hr ago`;
    return `${Math.floor(secondsAgo / 86400)} day(s) ago`;
  };

  const handleDmClick = () => {
    navigate(`/chat-room/${user.uid}-${vybud.id}`);
  };

  const handleRemoveVybud = async () => {
    try {
      await firebaseUserdb.removeVyBud(vybud.id, user);
      toast.success("Removed VyBud successfully");
      await refreshUser();
      onRemove?.(vybud.id);
    } catch (error) {
      console.error("Error removing VyBud:", error);
      toast.error("Failed to remove VyBud");
    }
  };

  return (
    <HStack
      w="95%"
      h="80px"
      mx="auto"
      my={4}
      bg="brand.300"
      p={2}
      px={4}
      rounded={12}
      justifyContent="space-between"
      boxShadow="4px 8px 4px rgba(0,0,0,0.2)"
    >
      <HStack gap={4}>
        {vybud?.avatar ? (
          <Image
            src={vybud.avatar}
            alt="Profile"
            boxSize="40px"
            minW="40px"
            rounded="full"
            cursor="pointer"
            onClick={() => navigate(`/profile/${vybud.id}`)}
          />
        ) : (
          <Box
            bg="brand.400"
            w="42px"
            h="42px"
            p={0}
            rounded="full"
            border="1px solid black"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={() => navigate(`/profile/${vybud.id}`)}
          >
            <Image as={ProfileIcon} boxSize="40px" />
          </Box>
        )}

        <Stack gap={0}>
          <HStack>
            <Heading
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
              fontSize={{
                base: "16px",
                md: "20px",
              }}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={() => navigate(`/profile/${vybud.id}`)}
            >
              {vybud.handlename}
            </Heading>
            <Text
              _hover={{ textDecoration: "underline" }}
              cursor="pointer"
              fontSize={{
                base: "12px",
                md: "16px",
              }}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={() => navigate(`/profile/${vybud.id}`)}
            >
              @{vybud.username}
            </Text>
          </HStack>
          <HStack align="center">
            <Box
              boxSize="10px"
              borderRadius="full"
              bg={presence.online ? "green.400" : "gray.400"}
            />
            <Box
              fontSize="sm"
              color={presence.online ? "green.600" : "gray.600"}
            >
              {presence.online
                ? "Online"
                : presence.lastSeen
                  ? `Last seen ${formatLastSeen(presence.lastSeen)}`
                  : "Offline"}
            </Box>
          </HStack>
        </Stack>
      </HStack>
      <HStack gap={4}>
        <Box
          border="1px solid #EF5D60"
          bg="brand.400"
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
        <Box
          border="1px solid #EF5D60"
          bg="brand.400"
          boxSize="40px"
          rounded="12px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="4px 8px 4px rgba(0,0,0,0.1)"
          cursor="pointer"
          onClick={handleRemoveVybud}
        >
          <Icon as={HiUserRemove} boxSize="20px" />
        </Box>
      </HStack>
    </HStack>
  );
};

export default VyBudCard;
