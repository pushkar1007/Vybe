import { useState } from "react";
import { Box, Input, IconButton, HStack } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { connection } from "@/firebase/firebase.dmdb";

const ChatInput = ({ reqId, senderId }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(connection.db, "dmReqs", reqId, "chats"), {
        senderId,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });

      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <Box p={3} borderTop="1px solid #ccc">
      <HStack spacing={2}>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          bg="white"
        />
        <IconButton
          icon={<FiSend />}
          onClick={sendMessage}
          colorScheme="blue"
          aria-label="Send Message"
        />
      </HStack>
    </Box>
  );
};

export default ChatInput;