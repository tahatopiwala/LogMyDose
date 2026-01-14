import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import {
  Patient,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/auth";

interface AuthContextType {
  patient: Patient | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshPatient: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const hasCheckedAuth = useRef(false);

  // Check for existing session on mount
  useEffect(() => {
    // Prevent duplicate calls during React StrictMode double-mounting
    if (hasCheckedAuth.current) {
      setIsLoading(false);
      return;
    }

    hasCheckedAuth.current = true;

    apiClient
      .get<{ patient: Patient }>("/auth/me")
      .then((res) => setPatient(res.patient))
      .catch(() => {
        // Not authenticated - this is expected for logged out users
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      const res = await apiClient.post<AuthResponse>("/auth/login", {
        email: data.email,
        password: data.password,
        userType: "patient",
        rememberMe: data.rememberMe ?? false,
      });
      setPatient(res.patient);
      navigate("/dashboard");
    },
    [navigate],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const res = await apiClient.post<AuthResponse>(
        "/auth/register/patient",
        data,
      );
      setPatient(res.patient);
      navigate("/dashboard");
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout", {});
    } catch {
      // Logout even if API call fails
    }
    setPatient(null);
    navigate("/login");
  }, [navigate]);

  const refreshPatient = useCallback(async () => {
    try {
      const res = await apiClient.get<{ patient: Patient }>("/auth/me");
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
