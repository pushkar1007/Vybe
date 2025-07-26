import { useRef, useState } from "react";
import { Box, Input, HStack, Icon, Stack, Spinner } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import EmojiPicker from "emoji-picker-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { connection } from "@/firebase/firebase.dmdb";
import { firebaseNotifications } from "@/firebase/firebase.notifications";
import { useAuth } from "@/context/AuthContext";

const ChatInput = ({
  type = "dm",
  reqId,
  senderId,
  chatPartner,
  addComment, 
  commentsLoading = false,
  inputValue,
  setInputValue,
  inputRef,
}) => {
  const internalInputRef = useRef(null);
  const ref = inputRef || internalInputRef;

  const [localValue, setLocalValue] = useState("");
  const value = inputValue ?? localValue;
  const setValue = setInputValue ?? setLocalValue;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = ref.current?.selectionStart || 0;
    const text = value || "";
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setValue(newText);

    setTimeout(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(
        cursorPos + emoji.length,
        cursorPos + emoji.length,
      );
    }, 0);
  };

  const sendMessage = async () => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(connection.db, "dmReqs", reqId, "chats"), {
        senderId,
        message: value.trim(),
        createdAt: serverTimestamp(),
      });
      await firebaseNotifications.createNotification({
        id: `chat_message_${reqId}`,
        type: `chat_message`,
        senderId,
        receiverId: chatPartner,
        senderHandle: userData.handlename || "Anonymous",
        status: "static",
        message: `${userData.handlename} has sent you a chat message`,
        relatedId: `${chatPartner}-${userData.id}`,
      });
      setValue("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (type === "dm") sendMessage();
      else if (type === "comment") addComment?.();
    }
  };

  const handleSubmit = () => {
    if (type === "dm") sendMessage();
    else if (type === "comment") addComment?.();
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
            placeholder={
              type === "dm" ? "Type your message..." : "Add a comment..."
            }
            value={value}
            ref={ref}
            onChange={(e) => setValue(e.target.value)}
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
          onClick={handleSubmit}
        >
          {loading || commentsLoading ? (
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
