import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import ChatInput from "@/components/ui/dm/ChatInput";
import ChatList from "@/components/ui/dm/ChatList";
import ChatHeader from "@/components/ui/dm/ChatHeader";
import ConnectionStatus from "@/components/ui/dm/ConnectionStatus";
import { connection } from "@/firebase/firebase.dmdb";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

const ChatRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();

  const [chatPartnerData, setChatPartnerData] = useState(null);
  const [request, setRequest] = useState(null);
  const [presence, setPresence] = useState({ online: null, lastSeen: null });

  const userIds = roomId?.split("-");
  const currentUser = user.uid;
  const chatPartner = userIds.find((id) => id !== currentUser);

  useEffect(() => {
    if (!chatPartner) return;

    setRequest(null);

    const fetchData = async () => {
      const [partnerData, connectionData] = await Promise.all([
        firebaseUserdb.getUserData(chatPartner),
        connection.getConnectionReq(currentUser, chatPartner),
      ]);

      setChatPartnerData(partnerData);

      if (connectionData && connectionData.length > 0) {
        setRequest(connectionData[0]);
      } else {
        setRequest(null);
      }
    };

    fetchData();
  }, [chatPartner]);

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

  if (!roomId || !currentUser || !chatPartner || !chatPartnerData) {
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
        {
          <ConnectionStatus
            key={request?.id ?? "no-req"}
            request={request}
            setRequest={setRequest}
            currentUser={currentUser}
            chatPartner={chatPartner}
          />
        }

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
