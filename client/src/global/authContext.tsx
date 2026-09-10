import React, { createContext, useContext, useState, useEffect } from "react";

export type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearTokens: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSetTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  };

  const handleSetUser = (nextUser: AuthUser | null) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const handleClearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserState(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isLoggedIn: !!accessToken,
        setTokens: handleSetTokens,
        setUser: handleSetUser,
        clearTokens: handleClearTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
