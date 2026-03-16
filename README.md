# CyberMapp — Architecture & TSX Reference

> **Purpose**: Use this document as a prompt context for Claude Sonnet when building this Expo Native project.

---

## Project Context

CyberMapp is a real-time map mobile app built with **React Native + Expo** (managed workflow).
Users are geolocated and appear on a shared live map.

**Stack**:

- Expo SDK / React Native / React 19
- TypeScript (strict mode)
- expo-location (geolocation)
- react-native-maps (interactive map)
- WebSocket (real-time user positions)
- @react-navigation/stack v6
- Backend: Node.js/Express on Railway + MySQL (AlwaysData)

---

## Architecture: Clean MVC

The project follows a strict **Model → Controller → View** separation.

```
src/
├── types/          # All TypeScript interfaces (single source of truth)
├── constants/      # Design tokens (colors, spacing, fonts)
├── services/       # ApiService (HTTP), SocketService (WebSocket), LocationService
├── models/         # API call wrappers — one file per resource
├── controllers/    # Business logic — orchestrates models + services
├── views/          # React Native screens (UI only)
├── components/     # Reusable UI fragments (BottomBar, Sidebar, UserMarker, etc.)
└── navigation/     # Navigator + screen routing
```

**Data flow (unidirectional)**:
```
User Action → Screen → Controller → Model → API / Socket
                 ↑                               |
                 └──── typed response ←──────────┘
```

Rules:
- Screens **never** import models directly, only controllers
- Controllers **never** import navigation or UI
- Models **never** contain business logic — only API calls

---

## 1. Types (`src/types/index.ts`)

Single file exporting all entity interfaces. Every layer imports from here.

```typescript
export interface User {
  id: number
  username: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface UserLocation {
  user_id: number
  latitude: number
  longitude: number
  updated_at: string
}

export interface UserOnMap extends User {
  location: UserLocation
}
```

---

## 2. Constants (`src/constants/index.ts`)

Design system as typed constants. All screens import from here — **no raw hex values in components**.

```typescript
export const COLORS = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceAlt: '#242424',
  border: '#2A2A2A',
  primary: '#E8FF47',
  primaryDark: '#C8DF27',
  text: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#555555',
  success: '#4ADE80',
  warning: '#FACC15',
  error: '#F87171',
  info: '#60A5FA',
}

export const FONT_SIZES = {
  xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30,
  '4xl': 36, display: 48,
}

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 48 }

export const RADIUS = { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 }
```

---

## 3. Services (`src/services/`)

### ApiService

Singleton. Handles all HTTP requests to the Express backend.

```typescript
// src/services/ApiService.ts
class ApiService {
  private baseUrl: string = process.env.EXPO_PUBLIC_API_URL ?? ''
  private token: string | null = null

  setToken(token: string) { this.token = token }

  private async request<T>(method: string, path: string, body?: object): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  get<T>(path: string) { return this.request<T>('GET', path) }
  post<T>(path: string, body: object) { return this.request<T>('POST', path, body) }
  put<T>(path: string, body: object) { return this.request<T>('PUT', path, body) }
  delete<T>(path: string) { return this.request<T>('DELETE', path) }
}

export const apiService = new ApiService()
```

### SocketService

Singleton. Manages WebSocket connection for real-time user positions.

```typescript
// src/services/SocketService.ts
class SocketService {
  private ws: WebSocket | null = null

  connect(url: string): void
  disconnect(): void
  send(event: string, data: object): void
  on(event: string, handler: (data: any) => void): void
  off(event: string): void
}

export const socketService = new SocketService()
```

### LocationService

Singleton. Handles expo-location permissions and position tracking.

```typescript
// src/services/LocationService.ts
import * as Location from 'expo-location'

class LocationService {
  async requestPermissions(): Promise<boolean>
  async getCurrentPosition(): Promise<Location.LocationObject>
  startWatching(onUpdate: (loc: Location.LocationObject) => void): void
  stopWatching(): void
}

export const locationService = new LocationService()
```

---

## 4. Models (`src/models/`)

One file per resource. Each model uses `apiService` and exposes async methods.

```typescript
// src/models/UserModel.ts
import { apiService } from '../services'
import { User } from '../types'

class UserModel {
  async getMe(): Promise<User> {
    return apiService.get<User>('/users/me')
  }

  async getUsersOnMap(): Promise<User[]> {
    return apiService.get<User[]>('/users/map')
  }

  async updateLocation(latitude: number, longitude: number): Promise<void> {
    return apiService.put('/users/me/location', { latitude, longitude })
  }
}

export const userModel = new UserModel()
```

---

## 5. Controllers (`src/controllers/`)

Business logic layer. Composes models + services, builds composite types for screens.

```typescript
// src/controllers/MapController.ts
import { userModel } from '../models'
import { locationService, socketService } from '../services'
import { UserOnMap } from '../types'

class MapController {
  async startTracking(onUsersUpdate: (users: UserOnMap[]) => void): Promise<void> {
    locationService.startWatching(async (loc) => {
      await userModel.updateLocation(loc.coords.latitude, loc.coords.longitude)
    })

    socketService.on('users:update', (users: UserOnMap[]) => {
      onUsersUpdate(users)
    })
  }

  stopTracking(): void {
    locationService.stopWatching()
    socketService.off('users:update')
  }
}

export const mapController = new MapController()
```

---

## 6. Navigation (`src/navigation/index.tsx`)

Root navigator decides between **Auth** and **Main App** based on session.
Main App uses local state-based navigation with a `Sidebar` + `BottomBar`.

```typescript
// src/navigation/index.tsx
const Stack = createStackNavigator()

export default function AppNavigator({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated
          ? <Stack.Screen name="Auth" component={AuthScreen} />
          : <Stack.Screen name="Main" component={MainApp} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function MainApp() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('Map')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const screens: Record<ScreenName, React.ReactElement> = {
    Map: <MapScreen />,
    Profile: <ProfileScreen />,
    Settings: <SettingsScreen />,
  }

  return (
    <View style={{ flex: 1 }}>
      {screens[activeScreen]}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(screen) => { setActiveScreen(screen); setSidebarOpen(false) }}
        activeScreen={activeScreen}
      />
      <BottomBar
        onMenuPress={() => setSidebarOpen(!sidebarOpen)}
        onHomePress={() => setActiveScreen('Map')}
        onSettingsPress={() => setActiveScreen('Settings')}
        isMenuOpen={sidebarOpen}
      />
    </View>
  )
}
```

---

## 7. Screens (TSX Patterns)

### Standard Screen Structure

```tsx
// src/views/MapScreen.tsx
import React, { useState, useCallback } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { mapController } from '../../controllers'
import { UserOnMap } from '../../types'
import { COLORS } from '../../constants'

export default function MapScreen() {
  const [users, setUsers] = useState<UserOnMap[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      mapController.startTracking(setUsers).then(() => setLoading(false))
      return () => mapController.stopTracking()
    }, [])
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {users.map(user => (
          <Marker
            key={user.id}
            coordinate={{ latitude: user.location.latitude, longitude: user.location.longitude }}
            title={user.username}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  map: { flex: 1 },
})
```

### Key Screen Patterns

| Pattern | Usage |
|---------|-------|
| `useFocusEffect` + `useCallback` | Reload data + cleanup quand screen focus/unfocus |
| `useState<T \| null>` + loading flag | Standard async data state |
| `StyleSheet.create` at bottom of file | All styles co-located, named semantically |
| `COLORS.*` / `SPACING.*` / `FONT_SIZES.*` | Never raw values in styles |
| `contentContainerStyle: { paddingBottom: 120 }` | Space for BottomBar on ScrollViews |
| Optional chaining `?.` everywhere on nullable data | Safe rendering without crashes |

---

## 8. App Entry Point (`App.tsx`)

```tsx
export default function App() {
  const [ready, setReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function init() {
      // 1. Request location permissions
      await locationService.requestPermissions()
      // 2. Check existing session (token in SecureStore)
      const user = await authController.getSession()
      setIsAuthenticated(!!user)
      // 3. Connect WebSocket if authenticated
      if (user) socketService.connect(process.env.EXPO_PUBLIC_WS_URL ?? '')
      setReady(true)
    }
    init()
  }, [])

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <AppNavigator isAuthenticated={isAuthenticated} />
    </SafeAreaProvider>
  )
}
```

---

## 9. File Naming & Export Conventions

| What | Convention | Example |
|------|-----------|---------|
| Screen files | PascalCase + `Screen` suffix | `MapScreen.tsx` |
| Component files | PascalCase | `UserMarker.tsx` |
| Service/Model/Controller | camelCase singleton exported | `export const userModel = new UserModel()` |
| Barrel exports | `index.ts` in each folder | `export { userModel } from './UserModel'` |
| Type file | single `index.ts` | all interfaces in one file |
| Constant file | single `index.ts` | all constants in one file |

---

## 10. Prompt Instructions for Claude Sonnet

When building features for CyberMapp, follow these rules:

1. **Start with types** — define all entity interfaces in `src/types/index.ts` first.
2. **Design system first** — use `src/constants/index.ts` tokens, never raw values.
3. **Build bottom-up**: types → constants → services → models → controllers → screens/components.
4. **Never skip layers** — screens call controllers, controllers call models, models call services.
5. **All styles** via `StyleSheet.create` at the bottom of the file, using constant tokens.
6. **useFocusEffect** (not useEffect) for data loading in screens + return cleanup function.
7. **Navigation** — `createStackNavigator` only for the auth gate; local `activeScreen` state for main app.
8. **Singleton services/models/controllers** — instantiate once in the module, export the instance.
9. **paddingBottom: 120** on every ScrollView contentContainerStyle to clear the BottomBar.
10. **Real-time** — location updates go through `LocationService` → `UserModel.updateLocation()` → backend broadcasts via WebSocket → `SocketService` → `MapController` → screen state.
