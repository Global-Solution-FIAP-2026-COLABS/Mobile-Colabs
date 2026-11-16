
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

type UserType = "usuario" | "instituicao";

export default function Index() {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  function handleContinue() {
    if (!selectedType) return;

    const accountType = 
      selectedType === "usuario" ? "CITIZEN" : "COLLECTION_POINT";

    if(selectedType === "usuario"){
      router.push("/AuthScreen/AuthPersonScreen")
    } else{
      router.push("/AuthScreen/AuthOrgScreen")
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>
        {/* Logo e apresentação */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>♡</Text>
          </View>

          <Text style={styles.appName}>Colabs+</Text>

          <Text style={styles.title}>
            Juntos podemos{"\n"}
            <Text style={styles.highlight}>fazer a diferença.</Text>
          </Text>

          <Text style={styles.subtitle}>
            Escolha como deseja participar da nossa comunidade.
          </Text>
        </View>

        {/* Opções */}
        <View style={styles.options}>
          <Text style={styles.sectionTitle}>
            Como você deseja acessar?
          </Text>

          <TouchableOpacity
            style={[
              styles.option,
              selectedType === "usuario" && styles.optionSelected,
            ]}
            onPress={() => setSelectedType("usuario")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#E8F5EE" }]}>
              <Text style={styles.optionIcon}>🤝</Text>
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Sou uma pessoa</Text>
              <Text style={styles.optionDescription}>
                Quero pedir ajuda ou realizar doações.
              </Text>
            </View>

            <View style={[
              styles.radio,
              selectedType === "usuario" && styles.radioSelected,
            ]}>
              {selectedType === "usuario" && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedType === "instituicao" && styles.optionSelected,
            ]}
            onPress={() => setSelectedType("instituicao")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#EAF0FF" }]}>
              <Text style={styles.optionIcon}>🏢</Text>
            </View>

            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Sou uma instituição</Text>
              <Text style={styles.optionDescription}>
                Quero receber e administrar pedidos de ajuda.
              </Text>
            </View>

            <View style={[
              styles.radio,
              selectedType === "instituicao" && styles.radioSelected,
            ]}>
              {selectedType === "instituicao" && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Botão */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              !selectedType && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedType}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continuar</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Ao continuar, você estará dando o primeiro passo{"\n"}
            para transformar vidas.
          </Text>
        </View>
      </View>
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
    justifyContent: "space-between",
    paddingTop: 35,
    paddingBottom: 25,
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "#16A36A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoIcon: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16A36A",
    marginBottom: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#172B24",
    textAlign: "center",
    lineHeight: 38,
  },
  highlight: {
    color: "#16A36A",
  },
  subtitle: {
    fontSize: 14,
    color: "#718078",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  options: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#25352D",
    marginBottom: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5EBE7",
    borderRadius: 16,
    padding: 16,
    minHeight: 105,
  },
  optionSelected: {
    borderColor: "#16A36A",
    backgroundColor: "#F0FAF5",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  optionIcon: {
    fontSize: 25,
  },
  optionText: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#25352D",
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 12,
    color: "#77847C",
    lineHeight: 18,
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#C8D2CC",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#16A36A",
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#16A36A",
  },
  footer: {
    gap: 17,
  },
  button: {
    backgroundColor: "#16A36A",
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A9CDBB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 10,
  },
  footerText: {
    color: "#98A49D",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 17,
  },
});
