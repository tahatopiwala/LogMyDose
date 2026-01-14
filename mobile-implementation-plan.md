# React Native Mobile App Implementation Plan

## Overview
Build a React Native mobile app for LogMyDose using Expo, targeting iOS first. The app will provide full feature parity with the web-app for D2C peptide therapy tracking.

## Technical Stack
- **Framework:** React Native with Expo SDK 51+
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind v4 (TailwindCSS for React Native)
- **Data Fetching:** React Query (same as web apps)
- **Storage:** expo-secure-store (tokens), AsyncStorage (preferences)
- **Auth:** JWT Bearer tokens (dual-mode backend support)

## Key Decisions
- ✅ NativeWind for styling (matches existing Tailwind setup)
- ✅ Expo Router for file-based navigation
- ✅ Dual-mode auth (Bearer tokens for mobile, cookies for web)
- ✅ Full feature parity with web app (complete MVP)

## Critical Files to Reference

1. **`/web-app/src/lib/api-client.ts`** - API client to adapt for Bearer auth
2. **`/web-app/src/contexts/AuthContext.tsx`** - Auth pattern to port with token storage
3. **`/web-app/src/types/domain.ts`** - Type definitions (100% reusable)
4. **`/web-app/tailwind.config.js`** - Tailwind config to adapt
5. **`/web-app/src/pages/Dashboard.tsx`** - Dashboard logic to port
6. **`/api/src/middleware/auth.ts`** - Update for dual-mode auth

---

## Implementation Plan

### Phase 1: Project Setup & Foundation

**Goal:** Initialize the React Native project with Expo, configure NativeWind styling, and integrate with the existing monorepo.

#### Step 1: Initialize Expo Project
```bash
cd /Users/tahatopiwala/Workspace/PeptideRx
npx create-expo-app@latest mobile --template expo-template-blank-typescript
cd mobile
```

#### Step 2: Install Core Dependencies
```bash
# Expo Router for file-based navigation
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# NativeWind styling
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# Secure storage & auth
npx expo install expo-secure-store

# API & data fetching
npm install @tanstack/react-query axios

# Reference shared package
npm install @logmydose/shared@*
```

#### Step 3: Configure NativeWind

**Create `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

**Update `babel.config.js`:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

**Create `global.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Step 4: Configure Package.json
```json
{
  "name": "@logmydose/mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "web": "expo start --web",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

#### Step 5: Update Root package.json
Add mobile to workspaces:
```json
{
  "workspaces": [
    "packages/*",
    "api",
    "web-landing",
    "web-app",
    "admin-app",
    "workers",
    "mobile"
  ]
}
```

#### Step 6: Setup TypeScript Configuration
**Create `tsconfig.json`:**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@logmydose/shared": ["../packages/shared/src"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

---

### Phase 2: Core Infrastructure

#### Step 7: Build Storage Layer
**File: `src/lib/storage.ts`**
```typescript
import * as SecureStore from 'expo-secure-store';

export const storage = {
  async setTokens(access: string, refresh: string) {
    await SecureStore.setItemAsync('access_token', access);
    await SecureStore.setItemAsync('refresh_token', refresh);
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('refresh_token');
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  }
};
```

#### Step 8: Create API Client
**File: `src/lib/api-client.ts`**

Port from `/web-app/src/lib/api-client.ts` with these changes:
- Replace `credentials: "include"` with `Authorization: Bearer ${token}` header
- Token retrieval from expo-secure-store
- Token refresh logic on 401 responses

```typescript
import axios from 'axios';
import { storage } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await storage.setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await storage.clearTokens();
        // Navigate to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

#### Step 9: Build Auth Context
**File: `src/contexts/AuthContext.tsx`**

Adapt from `/web-app/src/contexts/AuthContext.tsx`:
- Replace cookie-based auth with token storage
- Use Expo Router's `router.replace()` for navigation
- Add app state listener for token refresh

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { apiClient } from '../lib/api-client';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!loading) {
      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (user && inAuthGroup) {
        router.replace('/(app)');
      }
    }
  }, [user, loading, segments]);

  const checkAuth = async () => {
    try {
      const token = await storage.getAccessToken();
      if (token) {
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      await storage.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    await storage.setTokens(accessToken, refreshToken);
    setUser(user);
  };

  const register = async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    const { accessToken, refreshToken, user } = response.data;
    await storage.setTokens(accessToken, refreshToken);
    setUser(user);
  };

  const logout = async () => {
    await storage.clearTokens();
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### Step 10: Create Base UI Components

**File: `src/components/ui/Button.tsx`**
```typescript
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  loading = false,
  disabled = false
}: ButtonProps) {
  const baseClasses = 'px-4 py-3 rounded-lg items-center justify-center';
  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    outline: 'border-2 border-primary-600',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${
        (disabled || loading) ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`font-semibold ${
          variant === 'outline' ? 'text-primary-600' : 'text-white'
        }`}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
```

**File: `src/components/ui/Input.tsx`**
```typescript
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-2 font-medium">{label}</Text>}
      <TextInput
        className={`border rounded-lg px-4 py-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
```

**File: `src/components/ui/Card.tsx`**
```typescript
import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </View>
  );
}
```

**File: `src/components/ui/Badge.tsx`**
```typescript
import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'paused' | 'completed';
}

export function Badge({ children, variant = 'active' }: BadgeProps) {
  const colors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <View className={`px-2 py-1 rounded-full ${colors[variant]}`}>
      <Text className="text-xs font-medium">{children}</Text>
    </View>
  );
}
```

---

### Phase 3: Backend Auth Updates

#### Step 11: Update Auth Middleware for Dual Mode
**File: `/api/src/middleware/auth.ts`**

Add support for Authorization header:
```typescript
// Check Authorization header first, fall back to cookie
const token =
  req.headers.authorization?.replace('Bearer ', '') ||
  req.cookies?.lmd_access_token;

if (!token) {
  return res.status(401).json({ message: 'Unauthorized' });
}

// Continue with JWT validation...
```

#### Step 12: Update Auth Controllers
Ensure login/register endpoints return tokens in response body:
```typescript
res.json({
  accessToken,
  refreshToken,
  user: { id, email, name }
});
```

---

### Phase 4: Authentication Screens

#### Step 13: Build Root Layout
**File: `src/app/_layout.tsx`**
```typescript
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

#### Step 14: Build Auth Layout
**File: `src/app/(auth)/_layout.tsx`**
```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
```

#### Step 15: Build Login Screen
**File: `src/app/(auth)/login.tsx`**
```typescript
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white" contentContainerClassName="p-6">
        <View className="mt-20">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </Text>
          <Text className="text-gray-600 mb-8">
            Sign in to continue tracking your doses
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="text-red-800">{error}</Text>
            </View>
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <Button onPress={handleLogin} loading={loading}>
            Sign In
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/(auth)/register" className="text-primary-600 font-semibold">
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

#### Step 16: Build Register Screen
**File: `src/app/(auth)/register.tsx`**
Similar structure to login, with additional fields (name, confirm password).

---

### Phase 5: Main Navigation & Dashboard

#### Step 17: Build App Layout (Bottom Tabs)
**File: `src/app/(app)/_layout.tsx`**
```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <Ionicons name="bulb" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

#### Step 18: Create React Query Hooks
**File: `src/hooks/useDoses.ts`**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

export function useDosesToday() {
  return useQuery({
    queryKey: ['doses', 'today'],
    queryFn: async () => {
      const { data } = await apiClient.get('/doses/today');
      return data;
    },
  });
}

export function useDoseStats() {
  return useQuery({
    queryKey: ['doses', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/doses/stats');
      return data;
    },
  });
}

export function useLogDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doseData: any) => {
      const { data } = await apiClient.post('/doses', doseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doses'] });
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
    },
  });
}
```

**File: `src/hooks/useProtocols.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

export function useProtocols() {
  return useQuery({
    queryKey: ['protocols'],
    queryFn: async () => {
      const { data } = await apiClient.get('/protocols');
      return data;
    },
  });
}

export function useProtocol(id: string) {
  return useQuery({
    queryKey: ['protocols', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/protocols/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
```

#### Step 19: Build Dashboard Screen
**File: `src/app/(app)/index.tsx`**
```typescript
import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useProtocols } from '../../hooks/useProtocols';
import { useDoseStats } from '../../hooks/useDoses';
import { Card } from '../../components/ui/Card';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { data: protocols, isLoading, refetch } = useProtocols();
  const { data: stats } = useDoseStats();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </Text>
          <Text className="text-gray-600 mb-6">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>

          {/* Stats Cards */}
          <View className="flex-row gap-4 mb-6">
            <Card className="flex-1">
              <Text className="text-gray-600 text-sm">Today</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {stats?.today || 0}
              </Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-gray-600 text-sm">This Week</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {stats?.thisWeek || 0}
              </Text>
            </Card>
          </View>

          {/* Active Protocols */}
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Active Protocols
          </Text>
          {protocols?.map((protocol: any) => (
            <Card key={protocol.id} className="mb-4">
              <Text className="font-semibold text-gray-900">{protocol.name}</Text>
              <Text className="text-gray-600 text-sm mt-1">
                {protocol.substances?.length || 0} substances
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

### Phase 6-12: Remaining Screens

Continue implementing:
- **Log Dose Screen** (`src/app/(app)/log.tsx`)
- **History Screen** (`src/app/(app)/history.tsx`)
- **Insights Screen** (`src/app/(app)/insights.tsx`)
- **Profile Screen** (`src/app/(app)/profile.tsx`)
- **Protocol Detail** (`src/app/(app)/protocols/[id].tsx`)
- **Add Protocol** (`src/app/(app)/protocols/new.tsx`)

---

## Environment Variables

**Create `.env`:**
```
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**Create `.env.production`:**
```
EXPO_PUBLIC_API_URL=https://api.logmydose.com/api/v1
```

---

## Build & Deploy Setup

**Create `eas.json`:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.logmydose.app"
      }
    }
  }
}
```

**Update `app.json`:**
```json
{
  "expo": {
    "name": "LogMyDose",
    "slug": "logmydose",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.logmydose.app",
      "infoPlist": {
        "NSFaceIDUsageDescription": "Use Face ID to securely access your health data"
      }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "scheme": "logmydose"
  }
}
```

---

## Development Workflow

```bash
# Start development server
npm run start

# Run on iOS simulator
npm run ios

# Run on physical iOS device
npm run ios --device

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## Build Commands

```bash
# Development build for iOS simulator (free)
eas build --profile development --platform ios

# Preview build for TestFlight (requires Apple Developer account)
eas build --profile preview --platform ios

# Production build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

---

## Success Criteria

The mobile app is considered complete when:
- ✅ All 5 main screens implemented (Dashboard, Log, History, Insights, Profile)
- ✅ Authentication flow works end-to-end
- ✅ Dose logging creates doses via API
- ✅ Protocol management is functional
- ✅ History displays and filters correctly
- ✅ TypeScript compiles without errors
- ✅ App builds successfully for iOS simulator
- ✅ App builds successfully for iOS device (TestFlight)
- ✅ No critical bugs in core flows
- ✅ UI matches web app design language

---

## Estimated Timeline

**Total: ~13 days** (single developer, full-time)

| Phase | Days | Deliverable |
|-------|------|-------------|
| Setup & Foundation | 1 | Project configured, NativeWind working |
| Core Infrastructure | 1 | API client, storage, auth context |
| Backend Auth Updates | 1 | Dual-mode auth working |
| Authentication Screens | 1 | Login/register functional |
| Navigation & Dashboard | 2 | Main screen with protocols, stats |
| Dose Logging | 1 | Dose logging functional |
| Protocol Management | 1 | Detail screens working |
| Dose History | 1 | Paginated list with filters |
| Insights Placeholder | 0.5 | Placeholder screen |
| Profile/Settings | 1 | Settings screen, logout |
| Polish & Error Handling | 2 | Error handling, loading states |
| Build Setup | 0.5 | EAS config, TestFlight |

---

## Post-MVP Enhancements

### Phase 2: Enhanced Features
- Push notifications for dose reminders
- Camera integration for vial photos
- Biometric authentication (Face ID/Touch ID)
- AI insights screen (backend already supports)
- Side effects tracking
- Progress charts and visualizations

### Phase 3: Platform Expansion
- Android support
- Tablet optimization
- Apple Health integration
- Siri shortcuts
- Apple Watch companion app
- Widgets for home screen

### Phase 4: Offline & Advanced
- Offline mode with local database (WatermelonDB)
- Background sync
- Advanced filtering and search
- Data export (PDF reports)
- Multi-language support
