import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Firebase from "../firebase/firebase.auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Firebase.auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loginUser: Firebase.loginUser.bind(Firebase),
    createUser: Firebase.createUser.bind(Firebase),
    logoutUser: Firebase.logoutUser.bind(Firebase),
    isEmailVerified: Firebase.isEmailVerified.bind(Firebase),
    verifyEmail: Firebase.verifyEmail.bind(Firebase),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
