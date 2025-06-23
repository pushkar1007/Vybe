import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  validatePassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseConfig } from "./config.js";

class Firebase {
  app;
  auth;
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async loginUser({ email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error("Login failed:", error.code, error.message);
      return { success: false, error: error.code };
    }
  }

  async createUser({ email, password }) {
    try {
      const response = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      if (response) {
        //the response is an object looking like:
        /*{
            user: { ... },        
            providerId: null,      
            operationType: "signIn" 
        } */
        await this.loginUser({ email, password }); //if account created successfully login the user
        return response.user;
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in creating user: ", errorCode, errorMessage);
    }
  }

  async verifyEmail(user) {
    //this fxn is only for sending the verificaton emails to user email account
    try {
      await sendEmailVerification(user);
      alert(
        "please check your email for verification, click ok only after verified",
      );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error(
        "Error in sending verifying email:",
        errorCode,
        errorMessage,
      );
    }
  }

  async isEmailVerified() {
    try {
      const user = await this.getUser();
      if (user == null) return null; //user is not logged in
      return user.emailVerified;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in verifying email:", errorCode, errorMessage);
    }
  }

  async getUser() {
    try {
      const user = this.auth.currentUser; //on the first load this might be null as the firebase may not have synced that property properly that is why user.reload is required below
      if (!user) return null; //no user is logged in currently
      try {
        //try catch to account for failure in reloading user
        await user.reload(); //user.reload request the up to date value from the database
      } catch (reloadError) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ❌ Handle error
        console.error("Error in reloading  user:", errorCode, errorMessage);
      }
      return this.auth.currentUser;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in verifying email:", errorCode, errorMessage);
    }
  }

  async logoutUser() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Logout failed:", error.code, error.message);
    }
  }

  async isPasswordValid(passwordFromUser) {
    try {
      const status = await validatePassword(getAuth(), passwordFromUser); //getAuth requires a initialized app but if an app has been initialized before then this works fine even without parameters
      if (status.isValid) return true;
      else return false;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ❌ Handle error
      console.error("Error in verifying email:", errorCode, errorMessage);
    }
  }
}

export default new Firebase();
