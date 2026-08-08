"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  apiClient,
  getStoredAuthToken,
  setStoredAuthToken,
  UserProfile,
} from "@/lib/api-client";
import { useToast } from "@/components/beui/animated-toast-stack";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  unlockedSections: string[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUnlockedSections: (sections: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_UNLOCKED = ["section1"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unlockedSections, setUnlockedSections] = useState<string[]>(DEFAULT_UNLOCKED);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const fetchUserOnBoot = async () => {
    const existingToken = getStoredAuthToken();
    if (!existingToken) {
      setIsLoading(false);
      return;
    }

    setToken(existingToken);
    try {
      const res = await apiClient.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setUnlockedSections(res.user.unlockedSections || DEFAULT_UNLOCKED);
      }
    } catch (err) {
      console.warn("Could not fetch user profile from API, falling back to local mode:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOnBoot();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.auth.login({ email, password });
      if (res.success && res.token && res.user) {
        setStoredAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
        setUnlockedSections(res.user.unlockedSections || DEFAULT_UNLOCKED);
        setIsAuthModalOpen(false);
        toast({
          title: "Welcome back! 👋",
          description: `Logged in as ${res.user.name} (${res.user.role.toUpperCase()})`,
          type: "success",
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Login Failed ❌",
        description: err.message || "Invalid credentials",
        type: "error",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.auth.register({ name, email, password });
      if (res.success && res.token && res.user) {
        setStoredAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
        setUnlockedSections(res.user.unlockedSections || DEFAULT_UNLOCKED);
        setIsAuthModalOpen(false);
        toast({
          title: "Account Created! 🎉",
          description: `Welcome to English Learn Together, ${res.user.name}!`,
          type: "success",
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Registration Failed ❌",
        description: err.message || "Validation failed",
        type: "error",
      });
      return false;
    }
  };

  const logout = () => {
    setStoredAuthToken(null);
    setToken(null);
    setUser(null);
    setUnlockedSections(DEFAULT_UNLOCKED);
    toast({
      title: "Logged Out",
      description: "You have been logged out safely.",
      type: "info",
    });
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await apiClient.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setUnlockedSections(res.user.unlockedSections || DEFAULT_UNLOCKED);
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  const updateUnlockedSections = (sections: string[]) => {
    setUnlockedSections(sections);
    if (user) {
      setUser({ ...user, unlockedSections: sections });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggedIn: !!user,
        unlockedSections,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        refreshUser,
        updateUnlockedSections,
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
