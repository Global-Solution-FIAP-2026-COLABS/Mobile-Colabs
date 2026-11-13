import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

type FormData = {
  name: string;
  cnpj: string;
  address: string;
  email: string;
  password: string;
};

export default function AuthOrgScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cnpj: "",
    address: "",
    email: "",
    password: "",
  });

  function updateFormData(field: keyof FormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Formata o CNPJ
  function formatCNPJ(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function handleRegister() {
    const { name, cnpj, address, email, password } = formData;

    if (!name || !cnpj || !address || !email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (cnpj.replace(/\D/g, "").length !== 14) {
      Alert.alert("CNPJ inválido", "Informe um CNPJ com 14 dígitos.");
      return;
    }

    Alert.alert(
      "Cadastro",
      "Dados validados! Agora podemos integrar o cadastro com a API.",
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

            <Text style={styles.title}>Cadastre sua instituição</Text>

            <Text style={styles.subtitle}>
              Faça parte da nossa rede de solidariedade!
              {"\n"}Preencha os dados da sua instituição.
            </Text>
          </View>

          {/* Institution information */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Dados da instituição</Text>

            <Text style={styles.label}>Nome da instituição</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da instituição"
              placeholderTextColor="#A0AAA4"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              autoCapitalize="words"
            />

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              style={styles.input}
              placeholder="00.000.000/0000-00"
              placeholderTextColor="#A0AAA4"
              value={formData.cnpj}
              onChangeText={(value) =>
                updateFormData("cnpj", formatCNPJ(value))
              }
              keyboardType="numeric"
              maxLength={18}
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Rua, número, bairro, cidade..."
              placeholderTextColor="#A0AAA4"
              value={formData.address}
              onChangeText={(value) => updateFormData("address", value)}
              multiline
            />

            {/* Location */}
            <View style={styles.locationBox}>
              <View style={styles.locationIcon}>
                <Text style={{ fontSize: 21 }}>📍</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.locationTitle}>
                  Localização da instituição
                </Text>

                <Text style={styles.locationDescription}>
                  Será utilizada para localizar sua instituição e conectar
                  pessoas que precisam de ajuda.
                </Text>
              </View>
            </View>

            {/* Account information */}
            <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
              Dados de acesso
            </Text>

            <Text style={styles.label}>E-mail institucional</Text>
            <TextInput
              style={styles.input}
              placeholder="contato@instituicao.com.br"
              placeholderTextColor="#A0AAA4"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor="#A0AAA4"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              secureTextEntry
            />
          </View>

          {/* Register button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Cadastrar instituição</Text>

              <Text style={styles.buttonArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já possui uma conta?</Text>

              <TouchableOpacity
                onPress={() => router.push("/AuthScreen/LoginOrgScreen")}
              >
                <Text style={styles.loginLink}> Entrar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              Juntos podemos transformar vidas e fortalecer
              {"\n"}nossa comunidade.
            </Text>
          </View>
        </ScrollView>
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
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 35,
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    color: "#16A36A",
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#16A36A",
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16A36A",
    marginTop: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#172B24",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#718078",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
  form: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#25352D",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#35463C",
    marginTop: 5,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E1E9E4",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#25352D",
  },
  addressInput: {
    height: 75,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF8F2",
    padding: 14,
    borderRadius: 13,
    marginTop: 10,
    gap: 12,
  },
  locationIcon: {
    width: 42,
    height: 42,
    backgroundColor: "#DDF0E4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#246B48",
  },
  locationDescription: {
    fontSize: 11,
    color: "#718078",
    lineHeight: 16,
    marginTop: 3,
  },
  footer: {
    marginTop: 30,
    gap: 15,
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
    fontSize: 15,
    fontWeight: "700",
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 21,
    marginLeft: 10,
  },
  footerText: {
    fontSize: 11,
    color: "#98A49D",
    textAlign: "center",
    lineHeight: 17,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  loginText: {
    color: "#718078",
    fontSize: 13,
  },
  loginLink: {
    color: "#16A36A",
    fontSize: 13,
    fontWeight: "700",
  },
});
