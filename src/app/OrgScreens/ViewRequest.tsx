import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

type RequestItem = {
  name: string;
  quantity: number;
};

export default function ViewRequestScreen() {
  const params = useLocalSearchParams<{
    id: string;
    user: string;
    category: string;
    institution: string;
    distance: string;
    description: string;
    date: string;
    status: string;
    items: string;
  }>();

  let items: RequestItem[] = [];

  try {
    items = JSON.parse(params.items || "[]");
  } catch {
    items = [];
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/OrgScreens/FindRequests");
    }
  }

  function handleRegisterDonation() {
    router.push({
      pathname: "/OrgScreens/RegisterDonation",
      params: {
        requestId: params.id,
        user: params.user,
        category: params.category,
        institution: params.institution,
        items: params.items,
      },
    } as any);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#173D2E" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Visualizar pedido</Text>
            <Text style={styles.headerSubtitle}>
              Confira os detalhes da solicitação.
            </Text>
          </View>
        </View>

        {/* Identificação do pedido */}
        <View style={styles.requestHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{params.category}</Text>
          </View>

          <Text style={styles.requestId}>Pedido #{params.id}</Text>
        </View>

        {/* Informações do solicitante */}
        <View style={styles.card}>
          <View style={styles.sectionHeading}>
            <Ionicons name="person-circle-outline" size={21} color="#16A36A" />
            <Text style={styles.sectionTitle}>Informações do solicitante</Text>
          </View>

          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{params.user}</Text>

          <View style={styles.infoDivider} />

          <Text style={styles.label}>Instituição vinculada</Text>
          <Text style={styles.value}>{params.institution}</Text>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Distância</Text>
              <Text style={styles.value}>{params.distance} km</Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.label}>Data do pedido</Text>
              <Text style={styles.value}>{params.date}</Text>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.card}>
          <View style={styles.sectionHeading}>
            <Ionicons name="document-text-outline" size={21} color="#16A36A" />
            <Text style={styles.sectionTitle}>Descrição da necessidade</Text>
          </View>

          <Text style={styles.description}>{params.description}</Text>
        </View>

        {/* Itens necessários */}
        <View style={styles.card}>
          <View style={styles.itemsHeader}>
            <View style={styles.sectionHeading}>
              <Ionicons name="cube-outline" size={21} color="#16A36A" />
              <Text style={styles.sectionTitle}>Itens necessários</Text>
            </View>

            <View style={styles.itemCount}>
              <Text style={styles.itemCountText}>{items.length}</Text>
            </View>
          </View>

          <Text style={styles.itemsSubtitle}>
            Confira os produtos e as quantidades solicitadas.
          </Text>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum item informado neste pedido.
            </Text>
          ) : (
            items.map((item, index) => (
              <View key={`${item.name}-${index}`} style={styles.itemRow}>
                <View style={styles.itemIcon}>
                  <Ionicons name="cube-outline" size={18} color="#16A36A" />
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemNumber}>Item {index + 1}</Text>
                </View>

                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{item.quantity} un.</Text>
                </View>
              </View>
            ))
          )}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total de unidades</Text>

            <Text style={styles.totalValue}>
              {items.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0,
              )}
            </Text>
          </View>
        </View>

        {/* Situação */}
        <View style={styles.statusCard}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#16A36A"
          />

          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>Situação do pedido</Text>
            <Text style={styles.statusValue}>{params.status}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.donationButton}
          onPress={handleRegisterDonation}
          activeOpacity={0.85}
        >
          <Ionicons name="gift-outline" size={21} color="#FFFFFF" />

          <Text style={styles.donationButtonText}>Registrar doação</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Conecta+ • Juntos por uma comunidade melhor.
        </Text>
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
    alignItems: "center",
    gap: 14,
    marginBottom: 25,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#173D2E",
    fontSize: 21,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#718078",
    fontSize: 12,
    marginTop: 4,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: "#E5F5EC",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryBadgeText: {
    color: "#16A36A",
    fontSize: 11,
    fontWeight: "700",
  },
  requestId: {
    color: "#89958D",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 17,
  },
  sectionTitle: {
    color: "#173D2E",
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    color: "#89958D",
    fontSize: 11,
    marginBottom: 5,
  },
  value: {
    color: "#173D2E",
    fontSize: 13,
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#EDF1EE",
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: "row",
    gap: 15,
  },
  infoColumn: {
    flex: 1,
  },
  description: {
    color: "#52645A",
    fontSize: 13,
    lineHeight: 21,
  },
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemCount: {
    backgroundColor: "#E5F5EC",
    width: 29,
    height: 29,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  itemCountText: {
    color: "#16A36A",
    fontSize: 12,
    fontWeight: "800",
  },
  itemsSubtitle: {
    color: "#89958D",
    fontSize: 11,
    marginTop: -7,
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1EE",
    gap: 11,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#173D2E",
    fontSize: 13,
    fontWeight: "700",
  },
  itemNumber: {
    color: "#A0AAA3",
    fontSize: 10,
    marginTop: 3,
  },
  quantityBadge: {
    backgroundColor: "#F0F5F1",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  quantityText: {
    color: "#52645A",
    fontSize: 11,
    fontWeight: "700",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
  },
  totalLabel: {
    color: "#718078",
    fontSize: 12,
    fontWeight: "600",
  },
  totalValue: {
    color: "#16A36A",
    fontSize: 17,
    fontWeight: "800",
  },
  emptyText: {
    color: "#89958D",
    fontSize: 12,
    paddingVertical: 12,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#E5F5EC",
    borderRadius: 14,
    padding: 15,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    color: "#52645A",
    fontSize: 11,
  },
  statusValue: {
    color: "#16A36A",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },
  footer: {
    color: "#A0AAA3",
    fontSize: 10,
    textAlign: "center",
    marginTop: 25,
  },
  donationButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  backgroundColor: "#16A36A",
  padding: 16,
  borderRadius: 13,
  marginTop: 18,
},

donationButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "700",
},
});
