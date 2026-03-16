import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeScreenProps {
	username: string;
	email: string;
	onLogout: () => void;
}

export default function HomeScreen({
	username,
	email,
	onLogout,
}: HomeScreenProps) {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBar style="auto" />
			<View style={styles.content}>
				<Text style={styles.welcome}>Bienvenue, {username} !</Text>
				<Text style={styles.info}>Email: {email}</Text>
				<Text style={styles.subtitle}>
					Cette zone est réservée aux membres connectés
				</Text>
			</View>
			<TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
				<Text style={styles.logoutText}>Se déconnecter</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1a2e",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	welcome: {
		fontSize: 24,
		color: "#00d9ff",
		marginBottom: 10,
	},
	info: {
		fontSize: 16,
		color: "#fff",
		marginBottom: 20,
	},
	subtitle: {
		fontSize: 14,
		color: "#888",
		textAlign: "center",
	},
	logoutButton: {
		backgroundColor: "#e94560",
		margin: 20,
		padding: 14,
		borderRadius: 8,
		alignItems: "center",
	},
	logoutText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
