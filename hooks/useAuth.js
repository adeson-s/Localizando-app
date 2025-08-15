import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const authState = useProvideAuth();
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isLojista, setIsLojista] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDocRef = doc(db, "users", fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        let userData = {};
        if (userDocSnap.exists()) {
          userData = userDocSnap.data();
        }

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          name: userData.ownerName || userData.name || fbUser.displayName || "",
          isLojista: userData.isLojista || false,
          storeId: userData.storeId || null,
          // ... outros campos
        });

        setIsLojista(userData.isLojista || false);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsLojista(false);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  function logout() {
    auth.signOut();
  }

  return { user, isLojista, isAuthenticated, logout };
}
