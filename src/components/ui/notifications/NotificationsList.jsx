import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import NotificationItem from "@/components/ui/notifications/NotificationItem";
import { VStack, Spinner, Text } from "@chakra-ui/react";
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

  if (loading) return <Spinner />;
  if (notifications.length === 0)
    return <Text color="gray.400" p={4}>No notifications at the moment.</Text>;

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
        />
      ))}
    </VStack>
  );
};

export default NotificationsList;
