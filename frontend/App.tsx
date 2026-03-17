import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Loader from "./components/Loader";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { useAuthStore } from "./store/authStore";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
					<Stack.Screen name="Home" component={HomeScreen} />
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
