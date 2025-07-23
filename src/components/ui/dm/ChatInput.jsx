import { useRef, useState } from "react";
import { Box, Input, HStack, Icon, Stack, Spinner } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { connection } from "@/firebase/firebase.dmdb";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import EmojiPicker from "emoji-picker-react";
import { firebaseNotifications } from "@/firebase/firebase.notifications";
import { useAuth } from "@/context/AuthContext";

const ChatInput = ({ reqId, senderId, chatPartner }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { userData } = useAuth();


  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = inputRef.current.selectionStart;
    const text = message;
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setMessage(newText);

    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.selectionEnd = cursorPos + emoji.length;
    }, 0);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      await addDoc(collection(connection.db, "dmReqs", reqId, "chats"), {
        senderId,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      await firebaseNotifications.createNotification({
        id: `chat_message_${reqId}`,
        type: `chat_message`,
        senderId: senderId,
        receiverId: chatPartner,
        senderHandle: userData.handlename || "Anonymous",
        status: "accepted",
        message: `${userData.handlename} has sent you a chat message`,
        relatedId: `${chatPartner}-${userData.id}`,
      });
      setMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <Box
      p={3}
      h="65px"
      borderTop="1px solid #EF5D60"
      position="sticky"
      bottom="0"
      bg="brand.400"
    >
      <HStack spacing={2} w="full" position="relative">
        <HStack w="full" position="relative">
          <Input
            placeholder="Type your message..."
            value={message}
            ref={inputRef}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            bg="white"
            border="2px solid #EF5D60"
            pr={10}
          />
          <Icon
            position="absolute"
            right="10px"
            as={HiOutlineEmojiHappy}
            boxSize="25px"
            color="brand.500"
            cursor="pointer"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
        </HStack>
        <Stack
          bg="brand.500"
          h="40px"
          w="40px"
          rounded="6px"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={sendMessage}
        >
          {loading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <Icon as={FiSend} boxSize="20px" color="white" />
          )}
        </Stack>

        {showEmojiPicker && (
          <Box position="absolute" zIndex="1000" right="20px" bottom="80px">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="light"
              height="350px"
              width="300px"
            />
          </Box>
        )}
      </HStack>
    </Box>
  );
};

export default ChatInput;
