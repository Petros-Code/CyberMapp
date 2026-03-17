import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Loader from "./components/Loader";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ParamsScreen from "./screens/ParamsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { useAuthStore } from "./store/authStore";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

type TabParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
  Params: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#16213e",
          borderTopColor: "#0f3460",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#e94560",
        tabBarInactiveTintColor: "#6b7db3",
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<
            TabParamList[keyof TabParamList] extends undefined
              ? keyof TabParamList
              : keyof TabParamList,
            { focused: string; unfocused: string }
          > = {
            Home: { focused: "home", unfocused: "home-outline" },
            Map: { focused: "map", unfocused: "map-outline" },
            Profile: { focused: "person", unfocused: "person-outline" },
            Params: { focused: "settings", unfocused: "settings-outline" },
          };
          const iconSet = icons[route.name as keyof typeof icons];
          const iconName = focused ? iconSet.focused : iconSet.unfocused;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Accueil" }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarLabel: "Carte" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profil" }}
      />
      <Tab.Screen
        name="Params"
        component={ParamsScreen}
        options={{ tabBarLabel: "Paramètres" }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { token, isLoading, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  onNavigateToRegister={() => navigation.navigate("Register")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {({ navigation }) => (
                <RegisterScreen
                  onRegisterSuccess={() => navigation.navigate("Login")}
                  onNavigateToLogin={() => navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
});
