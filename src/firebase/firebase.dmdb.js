import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  collection,
  query,
  and,
  getDocs,
  where,
  or,
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";

class FirebaseDmConnection {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async createConnectionReq(senderId, receiverId) {
    try {
      const itExistAlready = await this.doesConnectionReqExists(
        senderId,
        receiverId,
      );
      const revExistAlready = await this.doesConnectionReqExists(
        senderId,
        receiverId,
      );
      if (itExistAlready) throw new Error("request already exists");
      if (revExistAlready)
        throw new Error("a request to your name already exists");
      const dmReqsRef = await addDoc(collection(this.db, "dmReqs"), {
        initiator: senderId,
        acceptor: receiverId,
        status: 0, //0 for pending req, 1 for accepted, -1 for rejecting
        createdAt: Date.now(),
      });
      await updateDoc(dmReqsRef, { reqId: dmReqsRef.id });
      return dmReqsRef;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error creating dm connection req:",
        errorCode,
        errorMessage,
      );
    }
  }

  async doesConnectionReqExists(senderId, receiverId) {
    try {
      const dmReqsRef = collection(this.db, "dmReqs");
      const q = query(
        dmReqsRef,
        where("initiator", "==", senderId),
        where("acceptor", "==", receiverId),
      );
      const snapshot = await getDocs(q);
      if (snapshot.docs.length == 0) return false;
      else return true;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error checking dm connection req:",
        errorCode,
        errorMessage,
      );
    }
  }

  async doesRevConnectionReqExists(senderId, receiverId) {
    try {
      const dmReqsRef = collection(this.db, "dmReqs");
      const q = query(
        dmReqsRef,
        where("initiator", "==", receiverId),
        where("acceptor", "==", senderId),
      );
      const snapshot = await getDocs(q);
      if (snapshot.docs.length == 0) return false;
      else return true;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error checking dm connection req:",
        errorCode,
        errorMessage,
      );
    }
  }

  async getConnectionReq(senderId, receiverId) {
    try {
      const dmReqsRef = collection(this.db, "dmReqs");
      const snapshot = await getDocs(dmReqsRef);
      if (snapshot.empty) return null;

      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (data) =>
            (data.initiator === senderId && data.acceptor === receiverId) ||
            (data.initiator === receiverId && data.acceptor === senderId),
        );

      return filtered.length > 0 ? filtered : null;
    } catch (error) {
      console.error("Error getting connection req:", error);
      return null;
    }
  }

  async acceptConnection(reqId, refreshUser) {
    try {
      const reqRef = doc(this.db, "dmReqs", reqId);
      await updateDoc(reqRef, {
        status: 1, // 1 means accepted
      });

      if (refreshUser) await refreshUser();
    } catch (error) {
      console.error("Error accepting request:", error.code, error.message);
    }
  }

  async rejectConnection(reqId, refreshUser) {
    try {
      const reqRef = doc(this.db, "dmReqs", reqId);
      await updateDoc(reqRef, {
        status: -1, // -1 means rejected
      });

      if (refreshUser) await refreshUser();
      console.log("Connection request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error.code, error.message);
    }
  }

  async deleteConnection(reqId) {
    try {
      const reqRef = doc(this.db, "dmReqs", reqId);
      await deleteDoc(reqRef);
    } catch (error) {
      console.error("Error deleting request:", error.code, error.message);
    }
  }
}

export const connection = new FirebaseDmConnection();
