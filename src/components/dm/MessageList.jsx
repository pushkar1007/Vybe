import { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { connection } from "@/firebase/firebase.dmdb";

const MessageList = ({ reqId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  useEffect(() => {
    const messagesRef = collection(connection.db, "dmReqs", reqId, "chats");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setLoading(false);
      console.log("Fetched messages:", msgs);
    });

    return () => unsubscribe();
  }, [reqId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner />
      </Flex>
    );
  }

  return (
    <VStack
      spacing={3}
      align="stretch"
      p={4}
      flex="1"
      overflowY="auto"
      bg="gray.50"
    >
      {messages.map((msg, i) => {
        console.log("MSG", i, msg);

        if (
          !msg ||
          typeof msg.senderId !== "string" ||
          typeof msg.message !== "string"
        ) {
          console.warn("❌ Skipping invalid message:", msg);
          return (
            <Box key={i} p={2} bg="red.100" color="red.700">
              Invalid message structure
            </Box>
          );
        }
        return (
          <HStack
            key={msg.id}
            alignSelf={msg.senderId === currentUser ? "flex-end" : "flex-start"}
            maxW="80%"
          >
            {msg.senderId !== currentUser && (
              <Avatar size="sm" name={msg.senderId} />
            )}
            <Box
              p={3}
              bg={msg.senderId === currentUser ? "blue.100" : "gray.200"}
              borderRadius="md"
              maxW="full"
              wordBreak="break-word"
            >
              <Text>{msg.message}</Text>
            </Box>
          </HStack>
        );
      })}

      <div ref={bottomRef}></div>
    </VStack>
  );
};

export default MessageList;
