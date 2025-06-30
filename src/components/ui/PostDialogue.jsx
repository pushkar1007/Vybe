import {
  Box,
  Button,
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import PostSelect from "./PostSelect";
import TextareaAutosize from "react-textarea-autosize";
import { useRef, useState } from "react";
import SpinnerBtn from "./SpinnerBtn";
import { LuImage } from "react-icons/lu";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import { uploadImage } from "@/utils/uploadImage";
import { toast } from "react-toastify";
import firebaseUserdb from "@/firebase/firebase.userdb";
import firebasePostdb from "@/firebase/firebase.postdb";

const MAX_CHAR_LIMIT = 550;

const PostDialogue = () => {
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

  const handleClose = () => {
    setImagePreview(null);
    setValue("");
    setImagePreview(null);
    setImageFile(null);
    setShowEmojiPicker(false);
  }

  const style = `
    .vybe-textarea::placeholder {
      color: white;
      opacity: 0.7;
    }
  `;

  return (
    <Dialog.Root closeOnInteractOutside={false}>
      <Dialog.Trigger asChild>
        <Button
          bg="brand.400"
          color="brand.200"
          boxShadow="4px 8px 4px rgba(0,0,0,0.1)"
          mt="12px"
          fontSize="16px"
          fontWeight="bold"
          rounded="full"
          height="4opx"
          width={{
            base: "138px",
            md: "90px",
            lg: "120px",
            lgx: "120px",
            xl: "138px",
          }}
          mr={{
            base: "50px",
            md: "10px",
            lg: "40px",
            lgx: "40px",
            xl: "50px",
          }}
        >
          Post
        </Button>
      </Dialog.Trigger>
      <Portal>
        <style>{style}</style>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="brand.500"
            w={{
              base: "none",
              md: "400px",
              lg: "520px",
            }}
            display={{
              base: "none",
              md: "block",
            }}
          >
            <Dialog.Header></Dialog.Header>
            <Dialog.Body pb="16px">
              <Stack>
                <HStack
                  w="100%"
                  alignItems="flex-start"
                  borderBottom="1px solid"
                  borderColor="white"
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
                    <PostSelect />
                    <Box position="relative" w="100%">
                      <TextareaAutosize
                        className="vybe-textarea"
                        name="post"
                        placeholder="What's Vybe for Today?"
                        value={value}
                        ref={textareaRef}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          resize: "none",
                          fontSize: "16px",
                          paddingTop: "12px",
                          paddingLeft: "2px",
                          borderRadius: "8px",
                          fontFamily: "inherit",
                          background: "transparent",
                          color: "white",
                          outline: "none",
                        }}
                        minRows={4}
                        maxRows={10}
                      />
                      <Text
                        fontSize="xs"
                        color={
                          value.length >= MAX_CHAR_LIMIT
                            ? "red.500"
                            : "brand.400"
                        }
                        position="absolute"
                        bottom="6px"
                        right="10px"
                        zIndex="1"
                        pointerEvents="none"
                      >
                        {value.length}/{MAX_CHAR_LIMIT}
                      </Text>
                    </Box>
                    {imagePreview && (
                      <Box mt={2}>
                        <img
                          src={imagePreview}
                          alt="uploaded"
                          style={{
                            maxHeight: "100%",
                            borderRadius: "8px",
                            width: "100%",
                          }}
                        />
                      </Box>
                    )}
                  </Stack>
                </HStack>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer pt={0} justifyContent="space-between">
              <HStack gap="2" position="relative">
                <LuImage
                  color="#ffffff"
                  size="25px"
                  cursor="pointer"
                  onClick={handleImageClick}
                />
                <Box position="relative">
                  <HiOutlineEmojiHappy
                    color="#ffffff"
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
                {showEmojiPicker && (
                  <Box position="absolute" top="30px" left="60px" zIndex="1000">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme="light"
                      height="350px"
                      width="300px"
                    />
                  </Box>
                )}
              </HStack>
              <Dialog.ActionTrigger asChild>
                <SpinnerBtn
                  text="Post"
                  fontSize="16px"
                  fontWeight="bold"
                  rounded="full"
                  height="4opx"
                  width="100px"
                  onClick={handlePost}
                />
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="lg"
                color="brand.400"
                _hover={{
                  bg: "whiteAlpha.300",
                  border: "1px solid white",
                }}
                rounded="full"
                onClick={handleClose}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PostDialogue;
