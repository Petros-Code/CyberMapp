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

interface RegisterScreenProps {
	onRegisterSuccess: () => void;
	onNavigateToLogin: () => void;
}

export default function RegisterScreen({
	onRegisterSuccess,
	onNavigateToLogin,
}: RegisterScreenProps) {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);

	const handleRegister = async () => {
		if (
			!username.trim() ||
			!email.trim() ||
			!password.trim() ||
			!confirmPassword.trim()
		) {
			Alert.alert("Erreur", "Veuillez remplir tous les champs");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
			return;
		}

		if (password.length < 8) {
			Alert.alert(
				"Erreur",
				"Le mot de passe doit contenir au moins 8 caractères",
			);
			return;
		}

		if (!/[A-Z]/.test(password)) {
			Alert.alert(
				"Erreur",
				"Le mot de passe doit contenir au moins une majuscule",
			);
			return;
		}

		if (!/[0-9]/.test(password)) {
			Alert.alert(
				"Erreur",
				"Le mot de passe doit contenir au moins un chiffre",
			);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				Alert.alert("Erreur", data.message || "Échec de l'inscription");
				console.log("Registration error data:", data);
				return;
			}

			Alert.alert(
				"Succès",
				"Compte créé ! Veuillez vérifier votre email pour activer votre compte.",
				[{ text: "OK", onPress: onNavigateToLogin }],
			);
			console.log("Registration success data:", data);
		} catch (error) {
			console.error("Registration error:", error);
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
					<Text style={styles.subtitle}>Créer un compte</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Nom d'utilisateur</Text>
						<TextInput
							style={styles.input}
							value={username}
							onChangeText={setUsername}
							placeholder="Pseudo"
							placeholderTextColor="#999"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</View>

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

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Confirmer le mot de passe</Text>
						<View style={styles.passwordRow}>
							<TextInput
								style={styles.passwordInput}
								value={confirmPassword}
								onChangeText={setConfirmPassword}
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
						onPress={handleRegister}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>S'inscrire</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.linkButton}
						onPress={onNavigateToLogin}
					>
						<Text style={styles.linkText}>
							Déjà un compte ?{" "}
							<Text style={styles.linkHighlight}>Se connecter</Text>
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
	input: {
		backgroundColor: "#0f3460",
		borderRadius: 8,
		padding: 14,
		color: "#fff",
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#1a4a7a",
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
