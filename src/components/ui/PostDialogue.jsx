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
import { useState } from "react";
import SpinnerBtn from "./SpinnerBtn";
import { LuImage } from "react-icons/lu";
import { HiOutlineEmojiHappy } from "react-icons/hi";

const MAX_CHAR_LIMIT = 550;

const PostDialogue = () => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHAR_LIMIT) {
      setValue(newValue);
    }
  };

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
                  <Image
                    src="./images/profilepic.png"
                    h="50px"
                    w="50px"
                    alt="profile-picture"
                  />
                  <Stack flex="1">
                    <PostSelect />
                    <Box position="relative" w="100%">
                      <TextareaAutosize
                        className="vybe-textarea"
                        name="post"
                        placeholder="What's Vybe for Today?"
                        value={value}
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
                  </Stack>
                </HStack>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer pt={0} justifyContent="space-between">
              <HStack gap="2">
                <LuImage color="#ffffff" size="25px" cursor="pointer" />
                <HiOutlineEmojiHappy
                  color="#ffffff"
                  size="25px"
                  cursor="pointer"
                />
              </HStack>
              <Dialog.ActionTrigger asChild>
                <SpinnerBtn
                  text="Post"
                  fontSize="16px"
                  fontWeight="bold"
                  rounded="full"
                  height="4opx"
                  width="100px"
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
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PostDialogue;
