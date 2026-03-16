import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Loader from "./components/Loader";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

interface User {
	id: number;
	username: string;
	email: string;
}

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	Home: { user: User; token: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const loadStoredSession = async (
	setToken: (token: string | null) => void,
	setUser: (user: User | null) => void,
	setLoading: (loading: boolean) => void,
) => {
	try {
		const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
		const storedUser = await AsyncStorage.getItem(USER_KEY);

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
	} catch (error) {
		console.error("Failed to load session:", error);
	} finally {
		setLoading(false);
	}
};

function AppContent() {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation<NavigationProp>();

	const handleLoginSuccess = async (authToken: string, userData: User) => {
		try {
			await AsyncStorage.setItem(TOKEN_KEY, authToken);
			await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
		} catch (error) {
			console.error("Failed to save session:", error);
		}
		setToken(authToken);
		setUser(userData);
	};

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem(TOKEN_KEY);
			await AsyncStorage.removeItem(USER_KEY);
		} catch (error) {
			console.error("Failed to clear session:", error);
		}
		setToken(null);
		setUser(null);
	};

	useEffect(() => {
		loadStoredSession(setToken, setUser, setLoading);
	}, []);

	if (loading) {
		return <Loader />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="auto" />
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{token && user ? (
						<Stack.Screen name="Home">
							{() => (
								<HomeScreen
									username={user.username}
									email={user.email}
									onLogout={handleLogout}
								/>
							)}
						</Stack.Screen>
					) : (
						<>
							<Stack.Screen name="Login">
								{() => (
									<LoginScreen
										onLoginSuccess={handleLoginSuccess}
										onNavigateToRegister={() => navigation.navigate("Register")}
									/>
								)}
							</Stack.Screen>
							<Stack.Screen name="Register">
								{() => (
									<RegisterScreen
										onRegisterSuccess={() => navigation.navigate("Login")}
										onNavigateToLogin={() => navigation.navigate("Login")}
									/>
								)}
							</Stack.Screen>
						</>
					)}
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	);
}

export default function App() {
	return (
		<SafeAreaProvider>
			<AppContent />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1a2e",
	},
});
