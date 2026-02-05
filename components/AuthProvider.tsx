"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Create Context
const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

// The Provider Component
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth changes globally
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children} 
      {/* Optional: You can remove '!loading &&' if you want the app to render while loading */}
    </AuthContext.Provider>
  );
}

// Export a hook to use this context easily
export const useAuthContext = () => useContext(AuthContext);