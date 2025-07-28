import { Box, Text, HStack, Button, Badge, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { vybudreq } from "@/firebase/firebase.vybudreq";
import { firebaseConfig } from "@/firebase/config";
import { initializeApp } from "firebase/app";
import { connection } from "@/firebase/firebase.dmdb";
import { firebaseNotifications } from "@/firebase/firebase.notifications";
import firebaseUserdb from "@/firebase/firebase.userdb";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification }) => {
  const [currentStatus, setCurrentStatus] = useState(notification.status);
  const [currentMessage, setCurrentMessage] = useState(notification.message);
  const [senderData, setSenderData] = useState([]);
  const navigate = useNavigate();

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

  const notificationBgMap = {
    static: "brand.500",
    pending: "yellow.400",
    accepted: "green.500",
    rejected: "red.600",
  };

  useEffect(() => {
    const removeRejectedReq = () => {
      const timeDiff = Math.abs(
        Number(Date.now()) - Number(notification.createdAt),
      );
      if (timeDiff > 6000 && notification.status === "rejected") {
        firebaseNotifications.removeNotification(notifId);
      }
    };
    return () => removeRejectedReq();
  }, [notifId]);

  useEffect(() => {
    const fetchSenderData = async () => {
      try {
        const data = await firebaseUserdb.getUserData(senderId);
        setSenderData(data);
      } catch (error) {
        console.error("Error fetching sender data:", error);
      }
    };

    if (senderId) fetchSenderData();
  }, [senderId]);

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
        await vybudreq.rejectVybudRequest(relatedId, receiverId);
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

  const handleNotification = () => {
    if (type === "vybud" && currentStatus === "accepted")
      navigate(`/profile/${senderId}`);
    else if (
      (type === "chat_request" && currentStatus === "accepted") ||
      type === "chat_message"
    )
      navigate(`/chat-room/${receiverId}-${senderId}`);
    else if (type === "post_like" || type === "post_comment")
      navigate(`/post/${relatedId}`);
  };

  const renderActions = () => {
    if (type === "vybud" || type === "chat_request") {
      if (currentStatus === "pending") {
        return (
          <HStack spacing={2}>
            <Button
              color="green"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAccept();
              }}
            >
              Accept
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleReject();
              }}
            >
              Reject
            </Button>
          </HStack>
        );
      } //else if (currentStatus === "accepted") {
      //   return (
      //     <Badge
      //       bg="green"
      //       color="white"
      //       h="30px"
      //       w="80px"
      //       alignItems="center"
      //       justifyContent="center"
      //     >
      //       Accepted
      //     </Badge>
      //   );
      // } else if (currentStatus === "rejected") {
      //   return (
      //     <Badge bg="red" color="white">
      //       Rejected
      //     </Badge>
      //   );
      // }
    }
    // if (
    //   type === "post_like" ||
    //   type === "post_comment" ||
    //   type === "chat_message"
    // ) {
    //   return;
    // }
    return; //<Badge colorScheme="blue">Info</Badge>;
  };

  return (
    <>
      {status === "rejected" &&
      (type === "post_like" || type === "post_comment") ? null : (
        <Box
          borderWidth="1px"
          borderRadius="xl"
          p={4}
          bg={notificationBgMap[notification.status] || "gray.50"}
          boxShadow="md"
          color="white"
          cursor="pointer"
          onClick={handleNotification}
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <HStack>
              <Image
                src={senderData.avatar || "/images/profilepic.png"}
                h="50px"
                w="50px"
                alt="profile-picture"
                rounded="full"
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${senderData.id}`);
                }}
              />
              <Text fontSize="md">{currentMessage}</Text>
            </HStack>
            {renderActions()}
          </HStack>
        </Box>
      )}
    </>
  );
};

export default NotificationItem;
