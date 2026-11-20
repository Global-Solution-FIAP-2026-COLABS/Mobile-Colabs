import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Substitua pelo hash do commit utilizado na versão publicada.
const COMMIT_HASH = "INSIRA_O_HASH_DO_COMMIT";

export default function SobreAppScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={23} color="#173D2E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sobre o App</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="people" size={42} color="#FFFFFF" />
          </View>

          <Text style={styles.appName}>Colabs<Text style={styles.plus}>+</Text></Text>
          <Text style={styles.tagline}>
            Conectando pessoas. Transformando realidades.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#16A36A"
            />
            <Text style={styles.sectionTitle}>Sobre o Colabs+</Text>
          </View>

          <Text style={styles.description}>
            O Colabs+ é uma plataforma mobile criada para aproximar
            pessoas e instituições por meio da solidariedade.
          </Text>

          <Text style={styles.description}>
            A aplicação facilita a divulgação de necessidades,
            a organização de doações e a conexão entre quem deseja
            ajudar e quem precisa de apoio.
          </Text>

          <Text style={styles.description}>
            Por meio de recursos de localização, solicitações de ajuda
            e acompanhamento das doações, o Colabs+ busca tornar
            a colaboração mais acessível, organizada e transparente.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="heart-outline"
              size={22}
              color="#16A36A"
            />
            <Text style={styles.sectionTitle}>O que você pode fazer?</Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="hand-left-outline" size={20} color="#16A36A" />
            <Text style={styles.featureText}>
              Criar e atender solicitações de ajuda.
            </Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="people-outline" size={20} color="#16A36A" />
            <Text style={styles.featureText}>
              Conectar cidadãos e instituições.
            </Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="location-outline" size={20} color="#16A36A" />
            <Text style={styles.featureText}>
              Encontrar pontos de coleta próximos.
            </Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="clipboard-outline" size={20} color="#16A36A" />
            <Text style={styles.featureText}>
              Acompanhar o histórico e o andamento das doações.
            </Text>
          </View>
        </View>

        <View style={styles.commitCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="git-branch-outline"
              size={22}
              color="#16A36A"
            />
            <Text style={styles.sectionTitle}>
              Versão de referência
            </Text>
          </View>

          <Text style={styles.commitLabel}>
            Hash do commit
          </Text>

          <View style={styles.hashContainer}>
            <Text style={styles.hash} selectable>
              e920b78
            </Text>
          </View>

          <Text style={styles.commitDescription}>
            Identificador do commit utilizado como referência
            para esta versão do aplicativo.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Colabs+</Text>
          <Text style={styles.footerText}>
            Projeto acadêmico desenvolvido para a FIAP.
          </Text>
          <Text style={styles.footerText}>
            Tecnologia a serviço da colaboração.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E8F2EC",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#173D2E",
  },
  headerPlaceholder: {
    width: 42,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  logo: {
    width: 86,
    height: 86,
    borderRadius: 26,
    backgroundColor: "#16A36A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#173D2E",
  },
  plus: {
    color: "#16A36A",
  },
  tagline: {
    fontSize: 13,
    color: "#75847B",
    marginTop: 7,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E8EEEA",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#173D2E",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64736A",
    marginBottom: 12,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 14,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: "#52635A",
    lineHeight: 20,
  },
  commitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E8EEEA",
  },
  commitLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#75847B",
    marginBottom: 9,
  },
  hashContainer: {
    backgroundColor: "#F1F5F2",
    borderRadius: 10,
    padding: 13,
  },
  hash: {
    fontSize: 13,
    color: "#173D2E",
    fontWeight: "700",
  },
  commitDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#87938B",
    marginTop: 10,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#173D2E",
    marginBottom: 6,
  },
  footerText: {
    fontSize: 12,
    color: "#87938B",
    marginTop: 4,
    textAlign: "center",
  },
});
