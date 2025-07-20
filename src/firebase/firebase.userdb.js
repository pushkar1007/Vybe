import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";

class Firebase {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  //creating a user
  async createUser({ username, email }, id) {
    try {
      const docRef = await setDoc(
        doc(this.db, "users", id), //the setDoc method is used to create a document by taking a document refrence(the first args) and an object which represent the field values(the second args)
        //the doc method used here is used to generate a pointer to a document refrence the above args of doc will generate a pointer to users/id where id is the id of the document itself
        //in tandem with setDoc this method creates a document at the refrenced location if a document already exists it is simply overwritten
        {
          username,
          email,
          handlename: "",
          bio: "",
          DOB: "",
          avatar: "",
          banner: "",
          likedPosts: [],
          createdPosts: [],
          vybuds: [],
          vybecircles: [],
          comments: [],
          blockedUsers: [],
        },
      );
      const userRef = await updateDoc(docRef, {
        userId: id,
      });
      return userRef;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in creating user: ", errorCode, errorMessage);
    }
  }

  //delete user
  async deleteUser(user) {
    try {
      const userRef = doc(this.db, "users", user.id);
      await deleteDoc(userRef);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in deleting user account:", errorCode, errorMessage);
    }
  }

  //get user data
  async getUserData(userId) {
    try {
      const userRef = doc(this.db, "users", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }; //the snap id here is the document id
      } else {
        return null;
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in fetching user details:", errorCode, errorMessage);
    }
  }

  //updates user credentials like dob, bio, avatar etc
  async updateUserCredentials(fieldName, fieldValue, currentUser) {
    try {
      // Validate that fieldValue is a string
      if (typeof fieldValue !== "string") {
        throw new Error("fieldValue must be a string");
      }

      // List of allowed string fields to update
      const allowedFields = [
        "handlename",
        "username",
        "bio",
        "DOB",
        "avatar",
        "banner",
      ]; // you can modify this

      if (!allowedFields.includes(fieldName)) {
        throw new Error(
          `Invalid field: ${fieldName}. Only string fields can be updated here.`,
        );
      }

      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      const userRef = doc(this.db, "users", currentUser.uid); // getting the refrence to the user document since we are using the authId as the user document id

      await updateDoc(userRef, {
        [fieldName]: fieldValue,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error updating user creds:", errorCode, errorMessage);
    }
  }

  // updates a post reference to createdPosts
  async addCreatedPost(postId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const postRef = doc(this.db, "posts", postId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        createdPosts: arrayUnion(postRef),
      });

      console.log(`Post ${postId} successfully added to createdPosts.`);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding created posts to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // deletes a post reference from createdPosts
  async deleteCreatedPost(postId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const postRef = doc(this.db, "posts", postId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        createdPosts: arrayRemove(postRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in deleting created posts from user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // updates a post reference to likedPosts
  async likePost(postId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const postRef = doc(this.db, "posts", postId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        likedPosts: arrayUnion(postRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding liked posts to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // removes a post reference from likedPosts
  async unlikePost(postId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const postRef = doc(this.db, "posts", postId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in removing liked posts from user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // adds a comment reference to comments array
  async addCommentRef(commentId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const commentRef = doc(this.db, "comments", commentId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        comments: arrayUnion(commentRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding comment refrence to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // removes a comment reference to comments array
  async removeCommentRef(commentId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const commentRef = doc(this.db, "comments", commentId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        comments: arrayRemove(commentRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      //Handle error
      console.error(
        "Error in adding removing liked posts from user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // adds a vybud
  async addVybud(userIdToAdd, currentUser) {
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error("User not authenticated or invalid user object.");
      }

      const userRef = doc(this.db, "users", currentUser.id);

      await updateDoc(userRef, {
        vybuds: arrayUnion(userIdToAdd),
      });

      console.log(
        `✅ Successfully added vybud ${userIdToAdd} to ${currentUser.id}`,
      );
    } catch (error) {
      console.error(
        "❌ Error in addVybud():",
        error.stack || error.message || error,
      );
    }
  }

  //removes a vybud
  async removeVyBud(userId, currentUser) {
    try {
      if (!currentUser || (!currentUser.uid && !currentUser.id)) {
        throw new Error("Invalid currentUser object.");
      }

      if (!userId) {
        throw new Error("User ID to remove is undefined.");
      }

      const userRef = doc(this.db, "users", currentUser.uid || currentUser.id);

      await updateDoc(userRef, {
        vybuds: arrayRemove(userId),
      });

      console.log(
        `✅ Successfully removed ${userId} from ${currentUser.uid || currentUser.id}'s vybuds.`,
      );
    } catch (error) {
      console.error(
        "🔥 Error in removeVyBud():",
        error?.stack || error?.message || error,
      );
      throw error; // 👈 Rethrow so the calling function can catch it
    }
  }

  //adding a vybeCircle
  async addVybeCircle(vybeCircleId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const vybeCircleRef = doc(this.db, "vybecircles", vybeCircleId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        vybecircles: arrayUnion(vybeCircleRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding vybecircle to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  //removing a vybeCircle
  async removeVybeCircle(vybeCircleId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(this.db, "users", currentUser.uid);
      const vybeCircleRef = doc(this.db, "vybecircles", vybeCircleId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        vybecircles: arrayRemove(vybeCircleRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in removing vybecircle to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  //adding a blocked user
  async addBlockedUser(userId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const currentUserRef = doc(this.db, "users", currentUser.uid);
      const blockedUserRef = doc(this.db, "users", userId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(currentUserRef, {
        blockedUsers: arrayUnion(blockedUserRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding blocked user to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  //removing a blocked user
  async removeBlockedUser(userId, currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const currentUserRef = doc(this.db, "users", currentUser.uid);
      const blockedUserRef = doc(this.db, "users", userId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(currentUserRef, {
        blockedUsers: arrayRemove(blockedUserRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in removing blocked user to user db:",
        errorCode,
        errorMessage,
      );
    }
  }
}

export default new Firebase();

//the current user param is meant to be the get from auth as each user id is set to the unique uid generated by the auth of firebase hence the use of currentUser.uid
//this uid is individually also stored as userId inside each userDb hence wherever userId is mentioned , pass the userId directly
