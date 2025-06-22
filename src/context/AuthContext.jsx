import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Firebase from "../firebase/firebase.auth"

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
        createUser: Firebase.loginUser.bind(Firebase),
        logoutUser: Firebase.loginUser.bind(Firebase),
        isEmailVerified: Firebase.loginUser.bind(Firebase),
        verifyEmail: Firebase.loginUser.bind(Firebase),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}