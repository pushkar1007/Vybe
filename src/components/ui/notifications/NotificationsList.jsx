import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getFirestore,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import NotificationItem from "@/components/ui/notifications/NotificationItem";
import { VStack, Spinner, Text } from "@chakra-ui/react";
import { vybudreq } from "@/firebase/firebase.vybudreq";
import { firebaseConfig } from "@/firebase/config"; 
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); 

const NotificationsList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(firestore, "notifications"),
      where("receiverId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [user?.uid]);


  const updateNotificationStatus = async (id, status) => {
    await updateDoc(doc(firestore, "notifications", id), { status });
  };

  const handleAccept = async (notification) => {
    const { id, type, senderId } = notification;

    if (type === "vybud-request") {
      await vybudreq.acceptVybudRequest(id, senderId, user.uid);
    }

    if (type === "chat-request") {
    }

    await updateNotificationStatus(id, "accepted");
  };

  const handleReject = async (notification) => {
    const { id, type } = notification;

    if (type === "vybud-request") {
      await vybudreq.rejectVybudRequest(id);
    }

    if (type === "chat-request") {
    }

    await updateNotificationStatus(id, "rejected");
  };

  if (loading) return <Spinner />;
  if (notifications.length === 0)
    return <Text color="gray.400">No notifications at the moment.</Text>;

  return (
    <VStack spacing={4} align="stretch">
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onAccept={() => handleAccept(n)}
          onReject={() => handleReject(n)}
        />
      ))}
    </VStack>
  );
};

export default NotificationsList;
