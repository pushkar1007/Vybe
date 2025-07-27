import { initializeApp } from "firebase/app";
import {
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";

class Firebase {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async createVybecircle({ name, description, logo, banner }, userId) {
    try {
      console.log({ name, description, logo, banner });
      const vybecircleRef = await addDoc(collection(this.db, "vybecircles"), {
        users: [],
        posts: [],
        name,
        description,
        logo,
        banner: banner ? banner : "",
        createdBy: userId,
        createdAt: String(Date.now()),
      });
      await updateDoc(vybecircleRef, { vybecircleId: vybecircleRef.id });
      return vybecircleRef;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating vybe circle:", errorCode, errorMessage);
    }
  }

  async updateVybecircle({ name, description, logo, banner }, vybecircleId) {
    try {
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);

      name
        ? await updateDoc(vybecircleRef, {
            name,
          })
        : null;

      description
        ? await updateDoc(vybecircleRef, {
            description,
          })
        : null;

      logo
        ? await updateDoc(vybecircleRef, {
            logo,
          })
        : null;

      banner
        ? await updateDoc(vybecircleRef, {
            banner,
          })
        : null;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error updating post:", errorCode, errorMessage);
    }
  }

  async deleteVybecircle(vybecircleId) {
    try {
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      await deleteDoc(vybecircleRef);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error deleting vybe circle:", errorCode, errorMessage);
    }
  }

  async addUser(userId, vybecircleId) {
    try {
      const userRef = doc(this.db, "users", userId);
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      await updateDoc(vybecircleRef, {
        users: arrayUnion(userRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error adding user to  vybecircle :",
        errorCode,
        errorMessage,
      );
    }
  }

  async removeUser(userId, vybecircleId) {
    try {
      const userRef = doc(this.db, "users", userId);
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      await updateDoc(vybecircleRef, {
        users: arrayRemove(userRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error removing user from  vybecircle :",
        errorCode,
        errorMessage,
      );
    }
  }

  async addPost(postId, vybecircleId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      await updateDoc(vybecircleRef, {
        posts: arrayUnion(postRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error adding post to  vybecircle :",
        errorCode,
        errorMessage,
      );
    }
  }

  async removePost(postId, vybecircleId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      await updateDoc(vybecircleRef, {
        posts: arrayRemove(postRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error removing post from vybecircle :",
        errorCode,
        errorMessage,
      );
    }
  }

  async getVybecircle(vybecircleId) {
    try {
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      const snap = await getDoc(vybecircleRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      } else {
        return null;
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error getting  vybecircle :", errorCode, errorMessage);
    }
  }
}

export default new Firebase();
