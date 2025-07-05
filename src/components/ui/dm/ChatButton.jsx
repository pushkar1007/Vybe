import { useNavigate } from "react-router-dom";
import { connection } from "../../../firebase/firebase.dmdb";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@chakra-ui/react";

export default function ChatButton({ initiator, acceptor }) {
  const submitHandler = async () => {
    try {
      await connection.createConnectionReq(initiator, acceptor);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      onClick={submitHandler}
      colorScheme="blue"
      size="md"
      borderRadius="md"
      px={6}
      py={4}
    >
      send chat request!
    </Button>
  );
}

//this component is just made for prototyping
//the production concept is as follows:
//whenever a user opens the chat-room , a check will be implemented to see
