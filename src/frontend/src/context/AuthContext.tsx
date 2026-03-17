import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, createContext, useContext } from "react";
import type { UserProfile } from "../backend";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  principal: string | null;
  userProfile: UserProfile | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoggingIn: false,
  principal: null,
  userProfile: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString() ?? null;

  const { data: userProfile = null } = useQuery<UserProfile | null>({
    queryKey: ["userProfile", principal],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && isAuthenticated,
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoggingIn: loginStatus === "logging-in",
        principal,
        userProfile,
        login,
        logout: clear,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
