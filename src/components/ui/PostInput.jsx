import { Box, Field, HStack, Stack, Text } from "@chakra-ui/react";
import ProfileIcon from "../icons/ProfileIcon";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import SpinnerBtn from "./SpinnerBtn";
import { LuImage } from "react-icons/lu";
import { HiOutlineEmojiHappy } from "react-icons/hi";

const MAX_CHAR_LIMIT = 550;

const PostInput = () => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHAR_LIMIT) {
      setValue(newValue);
    }
  };

  return (
    <HStack w="100%" alignItems="flex-start" gap={4} p={4} borderBottom="1px solid" borderColor="brand.100">
      <Box w="50px" h="50px" rounded="full" border="1px solid black">
        <ProfileIcon />
      </Box>
      <Stack flex="1">
        <Field.Root w="100%" position="relative">
          <Box position="relative" w="100%">
            <TextareaAutosize
              name="post"
              placeholder="What's Vybe for Today?"
              value={value}
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
        <HStack justifyContent="space-between">
          <HStack gap="2">
            <LuImage color="#EF5D60" size="25px" cursor="pointer" />
            <HiOutlineEmojiHappy color="#EF5D60" size="25px" cursor="pointer" />
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
          />
        </HStack>
      </Stack>
    </HStack>
  );
};

export default PostInput;
