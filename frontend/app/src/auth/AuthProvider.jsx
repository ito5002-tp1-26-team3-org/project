import { createContext, useContext, useEffect, useState } from "react";
import { getUser, userManager } from "./authService";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const u = await getUser();
        if (mounted) setUser(u && !u.expired ? u : null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const onLoaded = (u) => setUser(u && !u.expired ? u : null);
    const onUnloaded = () => setUser(null);

    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);

    return () => {
      mounted = false;
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
