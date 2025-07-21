import { useEffect, useRef, useState } from "react";
import { Box, Text, VStack, HStack, Spinner } from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { connection } from "@/firebase/firebase.dmdb";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useColorModeValue } from "../chakra/color-mode";

dayjs.extend(relativeTime);

const ChatList = ({ reqId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!reqId) return;

    const q = query(
      collection(connection.db, "dmReqs", reqId, "chats"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [reqId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sentBg = useColorModeValue("brand.500", "brand.500");
  const receivedBg = useColorModeValue("gray.100", "gray.700");

  if (loading) {
    return (
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <VStack
      spacing={3}
      p={4}
      flex={1}
      overflowY="auto"
      align="stretch"
      bg="gray.50"
    >
      {messages.map((msg) => {
        const isCurrentUser = msg.senderId === user.uid;
        return (
          <HStack
            key={msg.id}
            alignSelf={isCurrentUser ? "flex-end" : "flex-start"}
            maxW="80%"
            bg={isCurrentUser ? sentBg : receivedBg}
            px={4}
            py={2}
            borderRadius="lg"
          >
            <VStack spacing={0} align="start">
              <Text fontSize="md" color={isCurrentUser ? "white" : "black"}>
                {msg.message}
              </Text>
              <Text
                fontSize="xs"
                color={isCurrentUser ? "gray.200" : "gray.500"}
              >
                {msg.createdAt?.seconds
                  ? dayjs.unix(msg.createdAt.seconds).fromNow()
                  : "sending..."}
              </Text>
            </VStack>
          </HStack>
        );
      })}
      <div ref={bottomRef} />
    </VStack>
  );
};

export default ChatList;
