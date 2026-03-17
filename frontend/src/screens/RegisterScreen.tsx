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
import { registerSchema } from "../../validations/authValidation";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({
  onNavigateToLogin,
}: RegisterScreenProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.message || "Échec de l'inscription");
        return;
      }

      Alert.alert(
        "Succès",
        "Compte créé ! Veuillez vérifier votre email pour activer votre compte.",
        [{ text: "OK", onPress: onNavigateToLogin }],
      );
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
              style={[styles.input, errors.username && styles.inputError]}
              value={username}
              onChangeText={setUsername}
              placeholder="Pseudo"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="exemple@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View
              style={[styles.passwordRow, errors.password && styles.inputError]}
            >
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
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View
              style={[
                styles.passwordRow,
                errors.confirmPassword && styles.inputError,
              ]}
            >
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
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
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
  input: {
    backgroundColor: "#0f3460",
    borderRadius: 8,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1a4a7a",
  },
  inputError: {
    borderColor: "#e94560",
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
  errorText: {
    color: "#e94560",
    fontSize: 12,
    marginTop: 4,
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
