import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import ProfileIcon from "@/components/icons/ProfileIcon";
import ConnectionStatus from "@/components/dm/ConnectionStatus";
import MessageList from "@/components/dm/MessageList";
import ChatInput from "@/components/dm/ChatInput";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { connection } from "@/firebase/firebase.dmdb";
import { useAuth } from "@/context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";

const ChatRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const roomUsers = roomId?.split("-") || [];
  const currentUser = user.uid;
  const chatPartner = roomUsers.find((uid) => uid !== currentUser);
  console.log({ roomId, roomUsers, currentUser, chatPartner });

  const [request, setRequest] = useState(null);
  const [chatPartnerData, setChatPartnerData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [presence, setPresence] = useState({ online: null, lastSeen: null });

  useEffect(() => {
    if (!currentUser || !chatPartner) return;

    const fetchData = async () => {
      try {
        const [partnerData, userData, connectionData] = await Promise.all([
          firebaseUserdb.getUserData(chatPartner),
          firebaseUserdb.getUserData(currentUser),
          connection.getConnectionReq(chatPartner, currentUser),
        ]);
        console.log("Fetched chatPartnerData:", partnerData);
        setChatPartnerData(partnerData);
        setCurrentUserData(userData);
        console.log(chatPartnerData);

        if (connectionData && connectionData.length > 0) {
          setRequest(connectionData[0]);
        } else {
          setRequest(null);
        }
      } catch (error) {
        console.error("Error fetching chat room data:", error);
      }
    };

    fetchData();
  }, [currentUser, chatPartner]);

  useEffect(() => {
    if (!chatPartner) return;

    const db = getDatabase();
    const presenceRef = ref(db, `/onlineUsers/${chatPartner}`);

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
  }, [chatPartner]);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

    if (secondsAgo < 60) return "Just now";
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hr ago`;
    return `${Math.floor(secondsAgo / 86400)} day(s) ago`;
  };

  if (!roomId || !currentUser || !chatPartner) {
    return <Box p={4}>Invalid or missing chat room ID</Box>;
  }

  if (!chatPartnerData || !currentUserData) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      h="full"
      mx="auto"
      border="1px solid #ccc"
      borderRadius="md"
    >
      <HStack
        p={4}
        gap={6}
        align="center"
        borderBottom="1px solid"
        borderColor="brand.500"
      >
        <Icon as={IoIosArrowBack} boxSize={6} />
        {chatPartnerData.avatar ? (
          <Image
            src={chatPartnerData.avatar}
            alt="Profile"
            boxSize="50px"
            rounded="full"
          />
        ) : (
          <Box boxSize="50px" rounded="full" border="1px solid black">
            <Image
              as={ProfileIcon}
              alt="Profile"
              boxSize="50px"
              rounded="full"
            />
          </Box>
        )}
        <Stack gap={0} justifyContent="center" h="50px">
          <Heading size="md">{chatPartnerData.handlename}</Heading>
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
      <Stack h="100%">
        <ConnectionStatus
          request={request}
          setRequest={setRequest}
          currentUser={currentUser}
          chatPartner={chatPartner}
        />

        {request?.status === 1 && (
          <>
            <MessageList reqId={request.id} currentUser={currentUser} />
            <ChatInput reqId={request.id} senderId={currentUser} />
          </>
        )}
      </Stack>
    </Flex>
  );
};

export default ChatRoom;
