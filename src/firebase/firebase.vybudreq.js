import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import firebaseUserdb from "./firebase.userdb";
import { firebaseNotifications } from "./firebase.notifications";

class FirebaseVybudReq {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async createVybudRequest(initiatorUid, receiverUid, senderHandle = "") {
    const reqId = `${initiatorUid}_${receiverUid}`;
    const ref = doc(this.db, "vybudReqs", reqId);

    await setDoc(ref, {
      initiator: initiatorUid,
      receiver: receiverUid,
      senderHandle,
      status: 0,
      createdAt: Date.now(),
    });

    //Create linked notification
    await firebaseNotifications.createNotification({
      id: `vybud_${reqId}`,
      type: "vybud",
      senderId: initiatorUid,
      receiverId: receiverUid,
      senderHandle,
      status: "pending",
      message: `${senderHandle} sent you a VyBud request`,
      relatedId: reqId,
    });

    return reqId;
  }

  //Accept a request + update notification
  async acceptVybudRequest(reqId, initiatorUid, receiverUid) {
    try {
      await updateDoc(doc(this.db, "vybudReqs", reqId), { status: 1 });

      const receiverUser = await firebaseUserdb.getUserData(receiverUid);
      const initiatorUser = await firebaseUserdb.getUserData(initiatorUid);

      await firebaseUserdb.addVybud(initiatorUid, receiverUser);
      await firebaseUserdb.addVybud(receiverUid, initiatorUser);

      //Update notification
      await firebaseNotifications.updateNotificationStatus(
        `vybud_${reqId}`,
        "accepted",
        `${receiverUser.handle} accepted your VyBud request`,
      );
    } catch (error) {
      console.error(
        "Error in acceptVybudRequest:",
        error.stack || error.message,
      );
    }
  }

  //Reject a request + update notification
  async rejectVybudRequest(reqId, receiverUid) {
    await updateDoc(doc(this.db, "vybudReqs", reqId), { status: -1 });

    const receiverUser = await firebaseUserdb.getUserData(receiverUid);

    await firebaseNotifications.updateNotificationStatus(
      `vybud_${reqId}`,
      "rejected",
      `${receiverUser.handle} rejected your VyBud request`,
    );
  }

  async checkVybudRequestExists(reqId) {
    const ref = doc(this.db, "vybudReqs", reqId);
    const snapshot = await getDoc(ref);
    return snapshot.exists() && snapshot.data().status === 0; // only if pending
  }
}

export const vybudreq = new FirebaseVybudReq();
