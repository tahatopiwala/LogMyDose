import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "expo-router";
import { api } from "../lib/api-client";
import { storage } from "../lib/storage";
import {
  Patient,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth";

interface AuthContextType {
  patient: Patient | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshPatient: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasCheckedAuth = useRef(false);

  // Check for existing session on mount (only once)
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const hasTokens = await storage.hasTokens();
      if (hasTokens) {
        const res = await api.get<{ patient: Patient }>("/auth/me");
        setPatient(res.patient);
      }
    } catch {
      // Not authenticated or token invalid
      await storage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>("/auth/login", {
      email: data.email,
      password: data.password,
      userType: "patient",
    });

    await storage.setTokens(res.accessToken, res.refreshToken);
    setPatient(res.patient);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await api.post<AuthResponse>("/auth/register/patient", data);

    await storage.setTokens(res.accessToken, res.refreshToken);
    setPatient(res.patient);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Logout even if API call fails
    }
    await storage.clearTokens();
    setPatient(null);
    router.replace("/(auth)/login");
  }, [router]);

  const refreshPatient = useCallback(async () => {
    try {
      const res = await api.get<{ patient: Patient }>("/auth/me");
      setPatient(res.patient);
    } catch {
      // If refresh fails, keep current state
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        patient,
        isLoading,
        isAuthenticated: !!patient,
        login,
        register,
        logout,
        refreshPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
