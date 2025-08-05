import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./config";

class FirebaseNotification {
  app;
  db;
  collectionName = "notifications";

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  //Create a new notification
  async createNotification({
    id,
    type,
    senderId,
    receiverId,
    senderHandle = "",
    status = "pending",
    message = "",
    relatedId = null,
  }) {
    const ref = doc(this.db, this.collectionName, id);

    await setDoc(ref, {
      id,
      type,
      senderId,
      receiverId,
      senderHandle,
      status,
      message,
      relatedId,
      createdAt: Date.now(),
    });
  }

  //Update the status of a notification (accepted, rejected, etc.)
  async updateNotificationStatus(id, newStatus, newMessage = null) {
    const ref = doc(this.db, this.collectionName, id);
    const updateData = { status: newStatus };
    if (newMessage !== null) updateData.message = newMessage;

    await updateDoc(ref, updateData);
  }

  //Fetch all notifications for a user (receiver)
  async getNotificationsForUser(receiverId) {
    const notificationsRef = collection(this.db, this.collectionName);
    const q = query(
      notificationsRef,
      where("receiverId", "==", receiverId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  }

  //Get a specific notification by ID
  async getNotification(id) {
    const ref = doc(this.db, this.collectionName, id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  //Upsert if needed
  async createOrUpdateNotification(id, data) {
    const ref = doc(this.db, this.collectionName, id);
    await setDoc(ref, { ...data, id }, { merge: true });
  }

  //Remove a notification by ID
  async removeNotification(id) {
    const ref = doc(this.db, this.collectionName, id);
    await deleteDoc(ref);
  }
}

export const firebaseNotifications = new FirebaseNotification();
