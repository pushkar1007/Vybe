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
  orderBy
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";

class Firebase {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async createPost({ content, image }, currentUser) {
    try {
      const postRef = await addDoc(collection(this.db, "posts"), {
        content,
        image: image ? image : "",
        likes: [],
        comments: [],
        createdBy: currentUser.uid,
        createdAt: String(Date.now()),
        updatedAt: null,
      });
      await updateDoc(postRef, { postId: postRef.id });
      return postRef;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating post:", errorCode, errorMessage);
    }
  }

  async updatePost({ content, image, postId }) {
    try {
      const postRef = doc(this.db, "posts", postId);

      content
        ? await updateDoc(postRef, {
            content,
          })
        : null;

      image
        ? await updateDoc(postRef, {
            image,
          })
        : null;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error updating post:", errorCode, errorMessage);
    }
  }

  async deletePost(postId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      await deleteDoc(postRef);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error deleting post:", errorCode, errorMessage);
    }
  }

  async getPostData(postId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const snap = await getDoc(postRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      } else {
        return null;
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error getting  post data:", errorCode, errorMessage);
    }
  }

  async getAllPosts() {
    try {
      const querySnapshot = await getDocs(collection(this.db, "posts"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error fetching all posts:", errorCode, errorMessage);
      return [];
    }
  }

  listenToPosts(callback) {
    try {
      const postsQuery = query(
        collection(this.db, "posts"),
        orderBy("createdAt", "desc"),
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(posts);
      });

      return unsubscribe; // to stop listening when component unmounts
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error listening to posts:", errorCode, errorMessage);
      return () => {};
    }
  }

  async likePost(postId, userId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const userRef = doc(this.db, "users", userId);
      await updateDoc(postRef, {
        likes: arrayUnion(userRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error liking  post :", errorCode, errorMessage);
    }
  }

  async unlikePost(postId, userId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const userRef = doc(this.db, "users", userId);
      await updateDoc(postRef, {
        likes: arrayRemove(userRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error unliking  post :", errorCode, errorMessage);
    }
  }

  async addComment(postId, commentId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const commentRef = doc(this.db, "comments", commentId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error adding comment to  post :", errorCode, errorMessage);
    }
  }

  async removeComment(postId, commentId) {
    try {
      const postRef = doc(this.db, "posts", postId);
      const commentRef = doc(this.db, "comments", commentId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        "Error removing comment from  post :",
        errorCode,
        errorMessage,
      );
    }
  }
}

export default new Firebase();
