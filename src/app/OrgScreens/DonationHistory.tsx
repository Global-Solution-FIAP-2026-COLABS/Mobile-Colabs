
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useMyDonations } from "../../hooks/useDonation";

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

type Filter = "Todas" | "Em andamento" | "Concluídas";

export default function DonationHistory() {
  const [filter, setFilter] = useState<Filter>("Todas");

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMyDonations();

  // Filtra somente pedidos de ajuda vinculados à instituição.
  // Exibe pedidos em andamento e pedidos entregues.
  const donations: Donation[] = (data?.content ?? [])
    .filter(
      (donation) =>
        donation.type === "HELP_REQUEST" &&
        donation.collectionPointId != null &&
        (donation.status === "IN_PROGRESS" ||
          donation.status === "DELIVERED")
    )
    .map((donation) => ({
      id: String(donation.id),
      requester: donation.citizenName || "Solicitante",
      category:
        donation.items?.[0]?.categoryLabel ||
        donation.items?.[0]?.category ||
        "Não informada",
      items: (donation.items ?? []).map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      status:
        donation.status === "DELIVERED"
          ? "Concluída"
          : "Em andamento",
      date: donation.createdAt
        ? new Date(donation.createdAt).toLocaleDateString("pt-BR")
        : "Data não informada",
    }));

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

  const inProgressCount = donations.filter(
    (donation) => donation.status === "Em andamento"
  ).length;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/OrgScreens/HomeInstitution" as any);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#16A36A" />
        <Text style={styles.stateText}>
          Carregando histórico de doações...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <Ionicons
          name="cloud-offline-outline"
          size={45}
          color="#A0ADA5"
        />

        <Text style={styles.emptyTitle}>
          Não foi possível carregar o histórico
        </Text>

        <Text style={styles.emptyText}>
          Verifique sua conexão e tente novamente.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={handleBack}
        >
          <Text style={styles.backLinkText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
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

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>
            Histórico de doações
          </Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe suas entregas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => refetch()}
          disabled={isRefetching}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color="#173D2E"
          />
        </TouchableOpacity>
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
              Total de pedidos
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons
              name="time-outline"
              size={25}
              color="#B7791F"
            />

            <Text style={styles.summaryNumber}>
              {inProgressCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Em andamento
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

        {/* Lista */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Pedidos da instituição
          </Text>

          {isRefetching && (
            <ActivityIndicator size="small" color="#16A36A" />
          )}
        </View>

        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <View key={donation.id} style={styles.donationCard}>
              <View style={styles.cardHeader}>
                <View style={styles.requesterContainer}>
                  <Text style={styles.donationId}>
                    Pedido #{donation.id}
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
                  Itens solicitados
                </Text>

                {donation.items.length > 0 ? (
                  donation.items.map((item, index) => (
                    <Text
                      key={`${item.name}-${index}`}
                      style={styles.itemText}
                    >
                      • {item.name} — {item.quantity} unidade(s)
                    </Text>
                  ))
                ) : (
                  <Text style={styles.emptyItemsText}>
                    Nenhum item informado.
                  </Text>
                )}
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
              Nenhum pedido encontrado
            </Text>

            <Text style={styles.emptyText}>
              Não existem pedidos nesta categoria vinculados à instituição.
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
  headerTextContainer: {
    flex: 1,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
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
    gap: 10,
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#173D2E",
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 11,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#173D2E",
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
  requesterContainer: {
    flex: 1,
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
  emptyItemsText: {
    fontSize: 12,
    color: "#718078",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 35,
  },
  stateContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  stateText: {
    fontSize: 13,
    color: "#718078",
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#173D2E",
    marginTop: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#718078",
    marginTop: 5,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#173D2E",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  backLink: {
    marginTop: 15,
    padding: 8,
  },
  backLinkText: {
    color: "#52635A",
    fontSize: 13,
    fontWeight: "600",
  },
});
