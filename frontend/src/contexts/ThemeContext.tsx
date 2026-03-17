import AsyncStorage from "@react-native-async-storage/async-storage";
import type React from "react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeColors {
  background: string;
  cardBackground: string;
  border: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  icon: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
}

const themes: Record<Theme, ThemeColors> = {
  dark: {
    background: "#1a1a2e",
    cardBackground: "#16213e",
    border: "#0f3460",
    text: "#fff",
    textSecondary: "#888",
    accent: "#e94560",
    accentText: "#fff",
    icon: "#00d9ff",
    tabBarBackground: "#16213e",
    tabBarBorder: "#0f3460",
    tabBarActive: "#e94560",
    tabBarInactive: "#6b7db3",
  },
  light: {
    background: "#f5f5f5",
    cardBackground: "#fff",
    border: "#e0e0e0",
    text: "#333",
    textSecondary: "#666",
    accent: "#e94560",
    accentText: "#fff",
    icon: "#333",
    tabBarBackground: "#fff",
    tabBarBorder: "#e0e0e0",
    tabBarActive: "#e94560",
    tabBarInactive: "#999",
  },
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme as Theme);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    try {
      await AsyncStorage.setItem("@theme", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const colors = themes[theme];
  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
