import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

const ParamsScreen = () => {
  const { colors, toggleTheme, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
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
    section: {
      marginTop: 20,
      backgroundColor: colors.cardBackground,
      marginHorizontal: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    settingValue: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={20} color={colors.icon} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.icon}
              />
              <Text style={styles.settingLabel}>Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.icon}
              />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParamsScreen;
