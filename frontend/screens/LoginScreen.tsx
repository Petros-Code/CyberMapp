import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const API_URL = "http://192.168.5.149:3000/api/auth";

interface LoginScreenProps {
	onLoginSuccess: (
		token: string,
		user: { id: number; username: string; email: string },
	) => void;
	onNavigateToRegister: () => void;
}

export default function LoginScreen({
	onLoginSuccess,
	onNavigateToRegister,
}: LoginScreenProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			Alert.alert("Erreur", "Veuillez remplir tous les champs");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				Alert.alert("Erreur", data.message || "Échec de la connexion");
				return;
			}

			onLoginSuccess(data.token, data.user);
		} catch (_error) {
			Alert.alert("Erreur", "Impossible de se connecter au serveur");
		} finally {
			setLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible((v) => !v);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.formContainer}>
					<Text style={styles.title}>CyberMapp</Text>
					<Text style={styles.subtitle}>Connexion</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							value={email}
							onChangeText={setEmail}
							placeholder="exemple@email.com"
							placeholderTextColor="#999"
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Mot de passe</Text>
						<View style={styles.passwordRow}>
							<TextInput
								style={styles.passwordInput}
								value={password}
								onChangeText={setPassword}
								placeholder={passwordVisible ? "Mot de passe" : "••••••••"}
								placeholderTextColor="#999"
								secureTextEntry={!passwordVisible}
							/>
							<Pressable
								onPress={togglePasswordVisibility}
								style={styles.eyeButton}
							>
								<Text>{passwordVisible ? "🙈" : "👁️"}</Text>
							</Pressable>
						</View>
					</View>

					<TouchableOpacity
						style={[styles.button, loading && styles.buttonDisabled]}
						onPress={handleLogin}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>Se connecter</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.linkButton}
						onPress={onNavigateToRegister}
					>
						<Text style={styles.linkText}>
							Pas encore de compte ?{" "}
							<Text style={styles.linkHighlight}>S'inscrire</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1a2e",
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 20,
	},
	formContainer: {
		backgroundColor: "#16213e",
		borderRadius: 16,
		padding: 24,
		width: "100%",
		maxWidth: 400,
		alignSelf: "center",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#00d9ff",
		textAlign: "center",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 18,
		color: "#fff",
		textAlign: "center",
		marginBottom: 32,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		color: "#ccc",
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#0f3460",
		borderRadius: 8,
		padding: 14,
		color: "#fff",
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#1a4a7a",
	},
	passwordRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#0f3460",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#1a4a7a",
	},
	passwordInput: {
		flex: 1,
		padding: 14,
		color: "#fff",
		fontSize: 16,
	},
	eyeButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	button: {
		backgroundColor: "#00d9ff",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 10,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: "#1a1a2e",
		fontSize: 16,
		fontWeight: "bold",
	},
	linkButton: {
		marginTop: 20,
		alignItems: "center",
	},
	linkText: {
		color: "#888",
		fontSize: 14,
	},
	linkHighlight: {
		color: "#00d9ff",
		fontWeight: "bold",
	},
});
