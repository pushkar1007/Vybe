import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { connection } from "@/firebase/firebase.dmdb";
import ChatButton from "@/components/dm/ChatButton";
import ConnectionStatus from "@/components/dm/ConnectionStatus";
import { collection, doc, onSnapshot } from "firebase/firestore";

const ChatRoom = () => {
  return (
    <Flex
      direction="column"
      h="100vh"
      maxW="600px"
      mx="auto"
      border="1px solid #ccc"
      borderRadius="md"
    >
      <ConnectionStatus />
    </Flex>
  );
};

export default ChatRoom;
