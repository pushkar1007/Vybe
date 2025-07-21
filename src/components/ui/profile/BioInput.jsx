import { Box, Text } from "@chakra-ui/react";
import TextareaAutosize from "react-textarea-autosize";

const MAX_CHAR_LIMIT = 550;

const BioInput = ({ bio, handleChange }) => {
  return (
    <Box position="relative">
      <Text
        position="absolute"
        color="brand.400"
        left="30px"
        top="-10px"
        bg="brand.500"
        zIndex="1"
        h="11px"
        w="32px"
        display="flex"
        justifyContent="center"
      >
        Bio
      </Text>
      <TextareaAutosize
        className="bio"
        name="bio"
        color="white"
        value={bio}
        onChange={handleChange}
        style={{
          width: "100%",
          resize: "none",
          fontSize: "16px",
          padding: "12px",
          borderRadius: "8px",
          fontFamily: "inherit",
          background: "rgba(255,255,255,0.1)",
          color: "white",
          border: "1px solid white",
          outline: "none",
        }}
        minRows={4}
        maxRows={20}
      />
      <Text
        fontSize="xs"
        color={bio.length >= MAX_CHAR_LIMIT ? "red.500" : "brand.400"}
        position="absolute"
        bottom="6px"
        right="10px"
        zIndex="1"
        pointerEvents="none"
      >
        {bio.length}/{MAX_CHAR_LIMIT}
      </Text>
    </Box>
  );
};

export default BioInput;
