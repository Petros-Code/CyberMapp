import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../contexts/ThemeContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    welcome: {
      fontSize: 24,
      color: colors.icon,
      marginBottom: 10,
    },
    info: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
    logoutButton: {
      backgroundColor: colors.accent,
      margin: 20,
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    logoutText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  if (!user) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.welcome}>Bienvenue, {user.username} !</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Text style={styles.subtitle}>
          Cette zone est réservée aux membres connectés
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
