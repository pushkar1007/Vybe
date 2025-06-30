import {
  Box,
  Field,
  HStack,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import ProfileIcon from "../icons/ProfileIcon";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useRef } from "react";
import SpinnerBtn from "./SpinnerBtn";
import { LuImage } from "react-icons/lu";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import EmojiPicker from "emoji-picker-react";
import { uploadImage } from "@/utils/uploadImage";
import { useAuth } from "@/context/AuthContext";
import firebaseUserdb from "@/firebase/firebase.userdb";
import firebasePostdb from "@/firebase/firebase.postdb";
import { toast } from "react-toastify";

const MAX_CHAR_LIMIT = 550;

const PostInput = () => {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user, userData } = useAuth();

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHAR_LIMIT) {
      setValue(newValue);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPos = textareaRef.current.selectionStart;
    const text = value;
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setValue(newText);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionEnd = cursorPos + emoji.length;
    }, 0);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handlePost = async () => {
    if (!user || (!value.trim() && !imageFile)) return;
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const postRef = await firebasePostdb.createPost(
        { content: value.trim(), image: imageUrl },
        user,
      );
      if (postRef) {
        await firebaseUserdb.addCreatedPost(postRef.id, user);
        setValue("");
        setImagePreview(null);
        setImageFile(null);
        setShowEmojiPicker(false);
        toast.success("Post added Successfully!");
      }
    } catch (err) {
      console.error("Failed to Post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HStack
      w="100%"
      alignItems="flex-start"
      gap={4}
      py={4}
      px={{
        base: 1,
        md: 4,
      }}
      borderBottom="1px solid"
      borderColor="brand.500"
    >
      {userData?.avatar ? (
        <Image
          src={userData?.avatar}
          alt="User Avatar"
          w="50px"
          h="50px"
          rounded="full"
          objectFit="cover"
        />
      ) : (
        <Box
          w="50px"
          h="50px"
          rounded="full"
          overflow="hidden"
          border="1px solid black"
        >
          <ProfileIcon />
        </Box>
      )}
      <Stack flex="1">
        <Field.Root w="100%" position="relative">
          <Box position="relative" w="100%">
            <TextareaAutosize
              name="post"
              placeholder="What's Vybe for Today?"
              value={value}
              ref={textareaRef}
              onChange={handleChange}
              style={{
                width: "100%",
                resize: "none",
                fontSize: "16px",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #CBD5E0",
                fontFamily: "inherit",
              }}
              minRows={2}
              maxRows={10}
            />
            <Text
              fontSize="xs"
              color={value.length >= MAX_CHAR_LIMIT ? "red.500" : "gray.500"}
              position="absolute"
              bottom="6px"
              right="10px"
              zIndex="1"
              pointerEvents="none"
            >
              {value.length}/{MAX_CHAR_LIMIT}
            </Text>
          </Box>
        </Field.Root>

        {imagePreview && (
          <Box mt={2}>
            <img
              src={imagePreview}
              alt="uploaded"
              style={{ maxHeight: "100%", borderRadius: "8px", width: "100%" }}
            />
          </Box>
        )}

        <HStack justifyContent="space-between" position="relative">
          <HStack gap="2">
            <LuImage
              color="#EF5D60"
              size="25px"
              cursor="pointer"
              onClick={handleImageClick}
            />
            <Box position="relative">
              <HiOutlineEmojiHappy
                color="#EF5D60"
                size="25px"
                cursor="pointer"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              />
            </Box>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </HStack>
          <SpinnerBtn
            text="Post"
            fontSize="16px"
            fontWeight="bold"
            rounded="full"
            height="40px"
            bg="brand.500"
            color="white"
            w="150px"
            onClick={handlePost}
          />
          {showEmojiPicker && (
            <Box
              position="absolute"
              top="35px"
              transform="translateX(-15%)"
              zIndex="1000"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="light"
                height="350px"
                width="300px"
              />
            </Box>
          )}
        </HStack>
      </Stack>
    </HStack>
  );
};

export default PostInput;
