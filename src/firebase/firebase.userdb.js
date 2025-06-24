import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firebaseConfig } from "./config.js";

class Firebase {
  app;
  db;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async createUser({ id, username, email }) {
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
          vybecricles: [],
          comments: [],
          blockedUsers: [],
        },
      );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in creating user: ",
        errorCode,
        errorMessage,
      );
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
      const allowedFields = ["handleName", "bio", "DOB", "avatar", "banner"]; // you can modify this

      if (!allowedFields.includes(fieldName)) {
        throw new Error(
          `Invalid field: ${fieldName}. Only string fields can be updated here.`,
        );
      }

      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      const userRef = doc(db, "users", currentUser.uid); // getting the refrence to the user document since we are using the authId as the user document id

      await updateDoc(userRef, {
        [fieldName]: fieldValue,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error updating user creds:",
        errorCode,
        errorMessage,
      );
    }
  }

  // updates a post reference to createdPosts
  async addCreatedPost(postId,currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const postRef = doc(db, "posts", postId); // This is your DocumentReference

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

  // updates a post reference to likedPosts
  async likePost(postId,currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const postRef = doc(db, "posts", postId); // This is your DocumentReference

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
      const userRef = doc(db, "users", currentUser.uid);
      const postRef = doc(db, "posts", postId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding removing liked posts from user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // adds a comment reference to comments array
  async addCommentRef(commentId,currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const commentRef = doc(db, "posts", commentId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        likedPosts: arrayRemove(commentRef),
      });

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding removing liked posts from user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  // adds a vybud
  async addVybud(userId,currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const vybudRef = doc(db, "posts", userId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        vybuds: arrayUnion(vybudRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in adding vybud to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  //removes a vybud
  async removeVyBud(userId,currentUser) {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const vybudRef = doc(db, "posts", userId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        vybuds: arrayRemove(vybudRef),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in removing vybud to user db:",
        errorCode,
        errorMessage,
      );
    }
  }

  //adding a vybeCircle
  async addVybeCircle(vybeCircleId, currentUser){
       try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const vybeCircleRef = doc(db, "posts", userId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        vybuds: arrayUnion(vybeCircleRef),
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
  async removeVybeCircle(vybeCircleId, currentUser){
       try {
      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      // Get references
      const userRef = doc(db, "users", currentUser.uid);
      const vybeCircleRef = doc(db, "posts", userId); // This is your DocumentReference

      // Update the array field atomically
      await updateDoc(userRef, {
        vybuds: arrayRemove(vybeCircleRef),
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
}
