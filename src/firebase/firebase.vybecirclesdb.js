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
      if (!name || typeof name !== "string") {
        throw new Error("Missing or invalid 'name' field");
      }
      console.log({ name, description, logo, banner });
      const vybecircleRef = await addDoc(collection(this.db, "vybecircles"), {
        users: [],
        posts: [],
        name,
        description,
        logo: logo || "",
        banner: banner || "",
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

      logo ? await updateDoc(vybecircleRef, { logo }) : null;

      banner ? await updateDoc(vybecircleRef, { banner }) : null;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error updating post:", errorCode, errorMessage);
    }
  }

  async deleteVybecircle(vybecircleId) {
    try {
      const vybecircleRef = doc(this.db, "vybecircles", vybecircleId);
      const vybecircleSnap = await getDoc(vybecircleRef);

      if (!vybecircleSnap.exists()) {
        throw new Error("Vybecircle does not exist");
      }

      const vybecircleData = vybecircleSnap.data();
      const userRefs = vybecircleData.users || [];

      for (const userRef of userRefs) {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          await updateDoc(userRef, {
            vybecircles: arrayRemove(vybecircleRef),
          });
        }
      }

      await deleteDoc(vybecircleRef);

      console.log(`✅ Vybecircle ${vybecircleId} deleted successfully.`);
    } catch (error) {
      const errorCode = error.code || "";
      const errorMessage = error.message || error;
      console.error("❌ Error deleting Vybecircle:", errorCode, errorMessage);
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

  async getVybecirclesForUser(userId) {
    try {
      const userRef = doc(this.db, "users", userId);
      const vybecirclesSnapshot = await getDocs(
        collection(this.db, "vybecircles"),
      );

      const joinedVybecircles = [];

      vybecirclesSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const userRefs = data.users || [];

        const isMember = userRefs.some((ref) => ref.path === userRef.path);

        if (isMember) {
          joinedVybecircles.push({ id: docSnap.id, ...data });
        }
      });

      return joinedVybecircles;
    } catch (error) {
      console.error("Error fetching vybecircles for user:", error.message);
      return [];
    }
  }
}

export default new Firebase();
