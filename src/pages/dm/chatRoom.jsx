import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import ConnectionStatus from "@/components/dm/ConnectionStatus";
import ChatInput from "@/components/dm/ChatInput";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { connection } from "@/firebase/firebase.dmdb";
import { useAuth } from "@/context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";
import ChatList from "@/components/dm/ChatList";
import ChatHeader from "@/components/dm/ChatHeader";

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
      <ChatHeader chatPartnerData={chatPartnerData} presence={presence} />
      <Stack h="100%">
        <ConnectionStatus
          request={request}
          setRequest={setRequest}
          currentUser={currentUser}
          chatPartner={chatPartner}
        />

        {request?.status === 1 && (
          <>
            <ChatList reqId={request.id} />
            <ChatInput reqId={request.id} senderId={currentUser} />
          </>
        )}
      </Stack>
    </Flex>
  );
};

export default ChatRoom;
