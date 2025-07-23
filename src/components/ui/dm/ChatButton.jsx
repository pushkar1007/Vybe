import { Button } from "@chakra-ui/react";
import { connection } from "@/firebase/firebase.dmdb";
import { toast } from "react-toastify";
import { firebaseNotifications } from "@/firebase/firebase.notifications";
import { useAuth } from "@/context/AuthContext";

export default function ChatButton({ initiator, acceptor}) {
  const { userData } = useAuth();

  const submitHandler = async () => {
    try {
      await connection.createConnectionReq(initiator, acceptor);
      const data = await connection.getConnectionReq(initiator, acceptor);
      const chatId = data[0].id;
      await firebaseNotifications.createNotification({
        id: `chat_request_${initiator}_${acceptor}`,
        type: "chat_request",
        senderId: initiator,
        receiverId: acceptor,
        senderHandle: userData.handlename || "Anonymous",
        status: "pending",
        message: `${userData.handlename} has send you a Chat Request`,
        relatedId: chatId,
      });
      toast.success("Send Chat Request Succesfully!");
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
