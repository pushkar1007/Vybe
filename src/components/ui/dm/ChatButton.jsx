import { Button } from "@chakra-ui/react";
import { connection } from "@/firebase/firebase.dmdb";
import { toast } from "react-toastify";

export default function ChatButton({ initiator, acceptor }) {

  const submitHandler = async () => {
    try {
      await connection.createConnectionReq(initiator, acceptor);
      toast.success("Send Chat Request Succesfully!")
    } catch (error) {
      console.error(error);
      toast.error("Failed to send Request!");
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
      Send Chat Request
    </Button>
  );
}
