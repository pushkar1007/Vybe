import { Box, Text, HStack, Button, Badge, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { vybudreq } from "@/firebase/firebase.vybudreq";
import { firebaseConfig } from "@/firebase/config";
import { initializeApp } from "firebase/app";
import { connection } from "@/firebase/firebase.dmdb";
import { firebaseNotifications } from "@/firebase/firebase.notifications";

const NotificationItem = ({ notification }) => {
  const [currentStatus, setCurrentStatus] = useState(notification.status);
  const [currentMessage, setCurrentMessage] = useState(notification.message);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const {
    type,
    relatedId,
    senderId,
    receiverId,
    id: notifId,
    senderHandle,
    status,
  } = notification;

  useEffect(() => {
    const removeRejectedReq = () => {
      const timeDiff = Math.abs(
        Number(Date.now()) - Number(notification.createdAt),
      );
      if (timeDiff > 6000 && notification.status === "rejected") {
        firebaseNotifications.removeNotification(notifId);
      }
    }
    return () => removeRejectedReq();
  },[notifId])

  const handleAccept = async () => {
    try {
      if (type === "vybud") {
        await vybudreq.acceptVybudRequest(relatedId, senderId, receiverId);
        const notifRef = doc(db, "notifications", notifId);
        await updateDoc(notifRef, {
          status: "accepted",
          message: `You accepted the Vybud request from ${senderHandle}`,
        });
        setCurrentStatus("accepted");
        setCurrentMessage(
          `You accepted the Vybud request from ${senderHandle}`,
        );
      } else if (type === "chat_request") {
        await connection.acceptConnection(relatedId);
        const notifRef = doc(db, "notifications", notifId);
        await updateDoc(notifRef, {
          status: "accepted",
          message: `You accepted the Chat request from ${senderHandle}`,
        });
        setCurrentStatus("accepted");
        setCurrentMessage(`You accepted the Chat request from ${senderHandle}`);
      }
    } catch (err) {
      console.error("Error accepting request:", err.message);
    }
  };

  const handleReject = async () => {
    try {
      if (type === "vybud") {
        await vybudreq.rejectVybudRequest(relatedId);
        const notifRef = doc(db, "notifications", notifId);
        await updateDoc(notifRef, {
          status: "rejected",
          message: `You rejected the Vybud request from ${senderHandle}`,
        });
        setCurrentStatus("rejected");
        setCurrentMessage(
          `You rejected the Vybud request from ${senderHandle}`,
        );
      } else if (type === "chat_request") {
        await connection.rejectConnection(relatedId);
        const notifRef = doc(db, "notifications", notifId);
        await updateDoc(notifRef, {
          status: "rejected",
          message: `You rejected the Chat request from ${senderHandle}`,
        });
        setCurrentStatus("rejected");
        setCurrentMessage(`You rejected the Chat request from ${senderHandle}`);
      }
    } catch (err) {
      console.error("Error rejecting request:", err.message);
    }
  };

  const renderActions = () => {
    if (type === "vybud" || type === "chat_request") {
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
        return (
          <Badge
            bg="green"
            color="white"
            h="30px"
            w="80px"
            alignItems="center"
            justifyContent="center"
          >
            Accepted
          </Badge>
        );
      } else if (currentStatus === "rejected") {
        return (
          <Badge bg="red" color="white">
            Rejected
          </Badge>
        );
      }
    }
    if (type === "post_like" || type === "post_comment" || type === "chat_message") {
      return;
    }
    return <Badge colorScheme="blue">Info</Badge>;
  };

  return (
    <Box>
      {status === "rejected" &&
      (type === "post_like" || type === "post_comment") ? null : (
        <Box
          borderWidth="1px"
          borderRadius="xl"
          p={4}
          bg="gray.800"
          boxShadow="md"
          color="white"
          _hover={{ boxShadow: "lg" }}
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Text fontSize="md">{currentMessage}</Text>
            {renderActions()}
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default NotificationItem;
