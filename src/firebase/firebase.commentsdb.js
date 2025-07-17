import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";

class Firebase {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  async createComment( content,user ) {
    try {
      const commentRef = await addDoc(collection(this.db, "comments"), {
        content,
        likes: 0,
        createdAt: Date.now(),
        updatedAt: null,
        creaatedBy: user,
      });
      await updateDoc(commentRef, { commentId: commentRef.id });
      return commentRef;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating comment:", errorCode, errorMessage);
    }
  }

  async getComment(commentId){
    try {
      const commentRef = doc(this.db, "comments", commentId);
      const snap = await getDoc(commentRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      } else {
        return null;
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error getting  comment data:", errorCode, errorMessage);
    }
  }

  async deleteComment(commentId){
    try {
      const commentRef = doc(this.db, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error deleting comment:", errorCode, errorMessage);
    }
  }

  async updateLike(action,commentId){
    const commentRef = doc(this.db, "comments", commentId);
    const commentData = this.getComment(commentId);
    let updatedLikeCount
    if(action.lowercase === "like")
      updatedLikeCount = commentData.likes+1;
    else if(action.lowercase === "unlike" && commentData.likes > 0)
      updatedLikeCount = commentData.likes - 1;
    try {
      await updateDoc(commentRef,{
        likes: updatedLikeCount
      })
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error deleting comment:", errorCode, errorMessage);
    }

  }
}

export default new Firebase();