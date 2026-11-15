
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";

type FormData = {
  email: string;
  password: string;
};

export default function LoginOrgScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  function updateFormData(field: keyof FormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleLogin() {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert("Atenção", "Preencha seu e-mail e senha.");
      return;
    }

    Alert.alert(
      "Login",
      "Dados preenchidos! Agora podemos integrar a autenticação com a API."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
          >
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>♡</Text>
            </View>

            <Text style={styles.appName}>Conecta+</Text>

            <Text style={styles.title}>Bem-vindo de volta!</Text>

            <Text style={styles.subtitle}>
              Entre na sua conta e continue fazendo a diferença.
            </Text>
          </View>

          {/* Login form */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Acesse sua conta</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#A0AAA4"
              value={formData.email}
              onChangeText={(value) =>
                updateFormData("email", value)
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#A0AAA4"
              value={formData.password}
              onChangeText={(value) =>
                updateFormData("password", value)
              }
              secureTextEntry
            />
          </View>

          {/* Login button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/OrgScreens/HomeInstitution")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Entrar</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Ainda não possui conta?
              </Text>

              <TouchableOpacity onPress={() => router.replace("/")}>
                <Text style={styles.registerLink}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              Conecta+ — Juntos podemos transformar vidas.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: "#16A36A",
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#16A36A",
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16A36A",
    marginTop: 10,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#172B24",
    marginTop: 30,
  },
  subtitle: {
    fontSize: 13,
    color: "#718078",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },
  form: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#25352D",
    marginBottom: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#35463C",
    marginTop: 5,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#E1E9E4",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#25352D",
  },
  footer: {
    gap: 20,
  },
  button: {
    height: 55,
    backgroundColor: "#16A36A",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 21,
    marginLeft: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#718078",
    fontSize: 13,
  },
  registerLink: {
    color: "#16A36A",
    fontSize: 13,
    fontWeight: "700",
  },
  footerText: {
    color: "#98A49D",
    fontSize: 11,
    textAlign: "center",
  },
});
