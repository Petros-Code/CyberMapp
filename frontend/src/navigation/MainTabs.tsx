import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ParamsScreen from "../screens/ParamsScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
  Params: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackground,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: 80,
            paddingTop: 10,
            paddingBottom: insets.bottom,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
          },
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarIcon: ({ focused, color, size }) => {
            const icons: Record<
              keyof TabParamList,
              { focused: string; unfocused: string }
            > = {
              Home: { focused: "home", unfocused: "home-outline" },
              Map: { focused: "map", unfocused: "map-outline" },
              Profile: { focused: "person", unfocused: "person-outline" },
              Params: { focused: "settings", unfocused: "settings-outline" },
            };

            const iconSet = icons[route.name as keyof typeof icons];
            const iconName = focused ? iconSet.focused : iconSet.unfocused;

            return (
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={size}
                color={color}
              />
            );
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
    </View>
  );
}
