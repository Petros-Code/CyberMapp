import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../contexts/ThemeContext";

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
    },
    profileSection: {
      margin: 20,
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    avatarText: {
      fontSize: 32,
      color: colors.accentText,
      fontWeight: "bold",
    },
    username: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 5,
    },
    email: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 15,
    },
    infoSection: {
      margin: 20,
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      padding: 20,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 15,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    infoIcon: {
      marginRight: 15,
    },
    infoLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      flex: 1,
    },
    infoValue: {
      fontSize: 16,
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: colors.accent,
      margin: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    logoutText: {
      color: colors.accentText,
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 10,
    },
  });

  if (!user) return null;

  const getInitial = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.content}>
        <View>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial(user.username)}</Text>
            </View>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Informations du compte</Text>

            <View style={styles.infoItem}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.icon}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Nom d'utilisateur</Text>
              <Text style={styles.infoValue}>{user.username}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.icon}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.accentText}
          />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
