import { Box, Text, HStack, Button, Badge, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { vybudreq } from "@/firebase/firebase.vybudreq";
import { firebaseConfig } from "@/firebase/config";
import { initializeApp } from "firebase/app";

const NotificationItem = ({ notification }) => {
  const [currentStatus, setCurrentStatus] = useState(notification.status);
  const [currentMessage, setCurrentMessage] = useState(notification.message);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const { type, relatedId: reqId, senderId, receiverId, id: notifId, senderHandle } = notification;

  const handleAccept = async () => {
    try {
      if (type === "vybud") {
        await vybudreq.acceptVybudRequest(reqId, senderId, receiverId);
        const notifRef = doc(db, "notifications", notifId);
        await updateDoc(notifRef, {
          status: "accepted",
          message: `You accepted the Vybud request from ${senderHandle}`,
        });
        setCurrentStatus("accepted");
        setCurrentMessage(`You accepted the Vybud request from ${senderHandle}`);
      }
    } catch (err) {
      console.error("Error accepting request:", err.message);
    }
  };

  const handleReject = async () => {
    try {
      if (type === "vybud") {
        await vybudreq.rejectVybudRequest(reqId);
        const notifRef = doc(db, "notifications", notifId);
        await updateDoc(notifRef, {
          status: "rejected",
          message: `You rejected the Vybud request from ${senderHandle}`,
        });
        setCurrentStatus("rejected");
        setCurrentMessage(`You rejected the Vybud request from ${senderHandle}`);
      }
    } catch (err) {
      console.error("Error rejecting request:", err.message);
    }
  };

  const renderActions = () => {
    if (type === "vybud" || type === "chat-request") {
      if (currentStatus === "pending") {
        return (
          <HStack spacing={2}>
            <Button color="green" size="sm" onClick={handleAccept}>
              Accept
            </Button>
            <Button color="red" size="sm" onClick={handleReject}>
              Reject
            </Button>
          </HStack>
        );
      } else if (currentStatus === "accepted") {
        return <Badge bg="green" color="white" h="30px" w="80px" alignItems="center" justifyContent="center">Accepted</Badge>;
      } else if (currentStatus === "rejected") {
        return <Badge bg="red" color="white">Rejected</Badge>;
      }
    }
    return <Badge colorScheme="blue">Info</Badge>;
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      p={4}
      bg="gray.800"
      boxShadow="md"
      color="white"
      _hover={{ boxShadow: "lg" }}
    >
      <HStack justifyContent="space-between" alignItems="center" spacing={2}>
        <Text fontSize="md">{currentMessage}</Text>
        {renderActions()}
      </HStack>
    </Box>
  );
};

export default NotificationItem;
