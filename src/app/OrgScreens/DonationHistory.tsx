
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

type DonationItem = {
  name: string;
  quantity: number;
};

type Donation = {
  id: string;
  requester: string;
  category: string;
  items: DonationItem[];
  status: "Concluída" | "Em andamento";
  date: string;
};

// Dados fictícios para demonstrar o histórico
const initialDonations: Donation[] = [
  {
    id: "101",
    requester: "Maria Oliveira",
    category: "Alimentos",
    items: [
      { name: "Arroz", quantity: 5 },
      { name: "Feijão", quantity: 3 },
    ],
    status: "Concluída",
    date: "10/11/2026",
  },
  {
    id: "102",
    requester: "João Santos",
    category: "Roupas",
    items: [
      { name: "Camisetas", quantity: 10 },
    ],
    status: "Em andamento",
    date: "12/11/2026",
  },
];

type Filter = "Todas" | "Em andamento" | "Concluídas";

export default function DonationHistory() {
  const params = useLocalSearchParams<{
    requestId?: string;
    user?: string;
    category?: string;
    items?: string;
    status?: string;
    completedAt?: string;
  }>();

  const [filter, setFilter] = useState<Filter>("Todas");

  // Adiciona a doação recebida pela navegação à lista
  const donations = useMemo(() => {
    if (!params.requestId) return initialDonations;

    let receivedItems: DonationItem[] = [];

    try {
      receivedItems = JSON.parse(params.items || "[]");
    } catch {
      receivedItems = [];
    }

    const receivedDonation: Donation = {
      id: params.requestId,
      requester: params.user || "Solicitante",
      category: params.category || "Não informada",
      items: receivedItems,
      status:
        params.status === "Concluída"
          ? "Concluída"
          : "Em andamento",
      date: params.completedAt
        ? new Date(params.completedAt).toLocaleDateString("pt-BR")
        : new Date().toLocaleDateString("pt-BR"),
    };

    return [
      receivedDonation,
      ...initialDonations.filter(
        (donation) => donation.id !== receivedDonation.id
      ),
    ];
  }, [
    params.requestId,
    params.user,
    params.category,
    params.items,
    params.status,
    params.completedAt,
  ]);

  const filteredDonations = donations.filter((donation) => {
    if (filter === "Todas") return true;
    if (filter === "Concluídas") {
      return donation.status === "Concluída";
    }
    return donation.status === "Em andamento";
  });

  const completedCount = donations.filter(
    (donation) => donation.status === "Concluída"
  ).length;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/OrgScreens/HomeInstitution" as any);
    }
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={23} color="#173D2E" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>
            Histórico de doações
          </Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe suas entregas
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons
              name="gift-outline"
              size={25}
              color="#16A36A"
            />
            <Text style={styles.summaryNumber}>
              {donations.length}
            </Text>
            <Text style={styles.summaryLabel}>
              Total de doações
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={25}
              color="#16A36A"
            />
            <Text style={styles.summaryNumber}>
              {completedCount}
            </Text>
            <Text style={styles.summaryLabel}>
              Concluídas
            </Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filters}>
          {(["Todas", "Em andamento", "Concluídas"] as Filter[]).map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  filter === item && styles.activeFilter,
                ]}
                onPress={() => setFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Lista de doações */}
        <Text style={styles.sectionTitle}>
          Suas doações
        </Text>

        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <View key={donation.id} style={styles.donationCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.donationId}>
                    Doação #{donation.id}
                  </Text>
                  <Text style={styles.requester}>
                    {donation.requester}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    donation.status === "Concluída"
                      ? styles.completedBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      donation.status === "Concluída"
                        ? styles.completedText
                        : styles.pendingText,
                    ]}
                  >
                    {donation.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons
                  name="grid-outline"
                  size={17}
                  color="#718078"
                />
                <Text style={styles.infoText}>
                  {donation.category}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color="#718078"
                />
                <Text style={styles.infoText}>
                  {donation.date}
                </Text>
              </View>

              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>
                  Itens doados
                </Text>

                {donation.items.map((item, index) => (
                  <Text
                    key={`${item.name}-${index}`}
                    style={styles.itemText}
                  >
                    • {item.name} — {item.quantity} unidade(s)
                  </Text>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="file-tray-outline"
              size={45}
              color="#A0ADA5"
            />
            <Text style={styles.emptyTitle}>
              Nenhuma doação encontrada
            </Text>
            <Text style={styles.emptyText}>
              Não existem doações nesta categoria.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5EDE8",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#173D2E",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#718078",
    marginTop: 3,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  summaryNumber: {
    fontSize: 25,
    fontWeight: "700",
    color: "#173D2E",
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#718078",
    marginTop: 3,
  },
  filters: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 22,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  activeFilter: {
    backgroundColor: "#173D2E",
    borderColor: "#173D2E",
  },
  filterText: {
    fontSize: 11,
    color: "#52635A",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 14,
  },
  donationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  donationId: {
    fontSize: 12,
    color: "#718078",
    marginBottom: 5,
  },
  requester: {
    fontSize: 16,
    fontWeight: "700",
    color: "#173D2E",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedBadge: {
    backgroundColor: "#E5F5EC",
  },
  pendingBadge: {
    backgroundColor: "#FFF2DF",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  completedText: {
    color: "#16804F",
  },
  pendingText: {
    color: "#B7791F",
  },
  divider: {
    height: 1,
    backgroundColor: "#EDF1EE",
    marginVertical: 13,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },
  infoText: {
    fontSize: 13,
    color: "#52635A",
  },
  itemsContainer: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 7,
  },
  itemText: {
    fontSize: 12,
    color: "#52635A",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 35,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#173D2E",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: "#718078",
    marginTop: 5,
    textAlign: "center",
  },
});
