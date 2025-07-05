import {
  getDatabase,
  ref,
  set,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const initPresence = () => {
  const db = getDatabase();
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const userRef = ref(db, `/onlineUsers/${user.uid}`);

    // Set online to true with timestamp
    set(userRef, {
      online: true,
      lastSeen: serverTimestamp(),
    });

    // On disconnect, mark as offline and set last seen
    onDisconnect(userRef).set({
      online: false,
      lastSeen: serverTimestamp(),
    });
  });
};
