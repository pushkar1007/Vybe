import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Firebase from "../firebase/firebase.auth";
import firebaseUserdb from "@/firebase/firebase.userdb";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid) => {
    const data = await firebaseUserdb.getUserData(uid);
    setUserData(data);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Firebase.auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // force refresh from Firebase
        setUser({ ...currentUser }); // force new object to trigger re-render
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (Firebase.auth.currentUser) {
      await Firebase.auth.currentUser.reload();
      const currentUser = Firebase.auth.currentUser;
      setUser({ ...currentUser }); // Trigger re-render with updated data
      await fetchUserData(currentUser.uid);
    }
  };

  const value = {
    user,
    userData,
    loginUser: Firebase.loginUser.bind(Firebase),
    createUser: Firebase.createUser.bind(Firebase),
    logoutUser: Firebase.logoutUser.bind(Firebase),
    isEmailVerified: Firebase.isEmailVerified.bind(Firebase),
    verifyEmail: Firebase.verifyEmail.bind(Firebase),
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
