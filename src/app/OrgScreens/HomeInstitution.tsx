
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const menuItems = [
  {
    title: "Encontrar pedidos",
    description: "Encontre pessoas que precisam de ajuda.",
    icon: "search-outline" as const,
    route: "/OrgScreens/FindRequests",
    color: "#16A36A",
  },

  {
    title: "Entregar doação",
    description: "Consulte e gerencie as entregas pendentes.",
    icon: "car-outline" as const,
    route: "/OrgScreens/DeliverDonation",
    color: "#8062B5",
  },
  {
    title: "Histórico",
    description: "Consulte os pedidos e as doações realizadas.",
    icon: "time-outline" as const,
    route: "/OrgScreens/DonationHistory",
    color: "#438C91",
  },
];

export default function HomeInstitutionScreen() {
  function navigateTo(route: string) {
    router.push(route as any);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Conecta+</Text>
            <Text style={styles.welcome}>Olá, Instituição!</Text>
            <Text style={styles.subtitle}>
              Sua ajuda transforma comunidades.
            </Text>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <Ionicons
              name="business-outline"
              size={24}
              color="#16A36A"
            />
          </TouchableOpacity>
        </View>

        {/* Painel de resumo */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>
                Resumo das atividades
              </Text>
              <Text style={styles.summarySubtitle}>
                Acompanhe sua atuação na plataforma.
              </Text>
            </View>

            <Ionicons
              name="stats-chart-outline"
              size={25}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>
                Pedidos disponíveis
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>
                Em atendimento
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>
                Doações realizadas
              </Text>
            </View>
          </View>
        </View>

        {/* Menu principal */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Painel da instituição</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha uma funcionalidade para continuar.
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuCard}
              onPress={() => navigateTo(item.route)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: `${item.color}18` },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={25}
                  color={item.color}
                />
              </View>

              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>
                  {item.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#AAB5AE"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  brand: {
    color: "#16A36A",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  welcome: {
    color: "#173D2E",
    fontSize: 23,
    fontWeight: "800",
  },
  subtitle: {
    color: "#718078",
    fontSize: 12,
    marginTop: 5,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    backgroundColor: "#173D2E",
    borderRadius: 20,
    padding: 18,
    marginBottom: 30,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  summarySubtitle: {
    color: "#D0E2D7",
    fontSize: 11,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },
  statLabel: {
    color: "#D0E2D7",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#496858",
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#173D2E",
    fontSize: 17,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#89958D",
    fontSize: 12,
    marginTop: 5,
  },
  menuContainer: {
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5EDE8",
    gap: 13,
  },
  menuIcon: {
    width: 49,
    height: 49,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    color: "#173D2E",
    fontSize: 13,
    fontWeight: "700",
  },
  menuDescription: {
    color: "#89958D",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  recentSection: {
    marginTop: 30,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAll: {
    color: "#16A36A",
    fontSize: 11,
    fontWeight: "700",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5EDE8",
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  activityIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    justifyContent: "center",
    alignItems: "center",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: "#173D2E",
    fontSize: 12,
    fontWeight: "700",
  },
  activityDescription: {
    color: "#718078",
    fontSize: 10,
    marginTop: 4,
  },
  activityDate: {
    color: "#A0AAA3",
    fontSize: 10,
    marginTop: 5,
  },
  completedBadge: {
    backgroundColor: "#E5F5EC",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  completedText: {
    color: "#16A36A",
    fontSize: 9,
    fontWeight: "700",
  },
  footer: {
    color: "#A0AAA3",
    fontSize: 10,
    textAlign: "center",
    marginTop: 25,
  },
});
