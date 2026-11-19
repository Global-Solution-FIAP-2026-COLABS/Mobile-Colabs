import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useMyDonations } from "../../hooks/useDonation";
import type {
  DonationStatus,
  DonationCategory,
} from "../../types/donationTypes";

const filters = [
  "Todas",
  "Pendente",
  "Em atendimento",
  "Aprovada",
  "Concluída",
] as const;

type Filter = (typeof filters)[number];

type DonationStatusLabel =
  | "Pendente"
  | "Em atendimento"
  | "Aprovada"
  | "Recusada"
  | "Concluída"
  | "Cancelada";

const statusMap: Record<DonationStatus, DonationStatusLabel> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em atendimento",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
  DELIVERED: "Concluída",
  CANCELLED: "Cancelada",
};

const categoryMap: Record<DonationCategory, string> = {
  FOOD: "Alimentos",
  CLOTHING: "Roupas",
  HYGIENE: "Higiene",
  MEDICINE: "Medicamentos",
  FURNITURE: "Móveis",
  OTHER: "Outros",
};

export default function MyDonationsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useMyDonations();

  const [selectedFilter, setSelectedFilter] = useState<Filter>("Todas");
  const [expandedDonation, setExpandedDonation] = useState<number | null>(null);

  console.log("RESPOSTA COMPLETA:", JSON.stringify(data, null, 2));
  console.log("TOTAL RECEBIDO:", data?.totalElements);

  console.log(
    "TIPOS RECEBIDOS:",
    data?.content?.map((donation) => ({
      id: donation.id,
      type: donation.type,
      status: donation.status,
    })),
  );

  const donations = (data?.content ?? []).map((donation) => ({
      ...donation,
      statusLabel: statusMap[donation.status],
      date: new Date(donation.createdAt).toLocaleDateString("pt-BR"),
      categories: [
        ...new Set(
          donation.items.map(
            (item) => item.categoryLabel || categoryMap[item.category],
          ),
        ),
      ].join(", "),
    }));

  const filteredDonations =
    selectedFilter === "Todas"
      ? donations
      : donations.filter((donation) => donation.statusLabel === selectedFilter);

  function toggleDonation(id: number) {
    setExpandedDonation((current) => (current === id ? null : id));
  }

  function getStatusStyle(status: DonationStatusLabel) {
    switch (status) {
      case "Pendente":
        return {
          background: "#FFF3CD",
          color: "#856404",
          icon: "time-outline" as const,
        };
      case "Em atendimento":
        return {
          background: "#D1ECF1",
          color: "#0C5460",
          icon: "sync-outline" as const,
        };
      case "Aprovada":
      case "Concluída":
        return {
          background: "#D4EDDA",
          color: "#155724",
          icon: "checkmark-circle-outline" as const,
        };
      case "Recusada":
        return {
          background: "#F8D7DA",
          color: "#721C24",
          icon: "close-circle-outline" as const,
        };
      case "Cancelada":
        return {
          background: "#E2E3E5",
          color: "#383D41",
          icon: "ban-outline" as const,
        };
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/UserScreens/HomeUserScreen");
              }
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#173D2E" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Minhas doações</Text>
            <Text style={styles.headerSubtitle}>
              Acompanhe as doações que você realizou
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => refetch()}
            disabled={isRefetching}
          >
            <Ionicons name="refresh-outline" size={22} color="#16A36A" />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color="#16A36A" />
            <Text style={styles.feedbackText}>Carregando suas doações...</Text>
          </View>
        )}

        {isError && !isLoading && (
          <View style={styles.feedbackContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#C0392B" />
            <Text style={styles.emptyTitle}>
              Não foi possível carregar suas doações
            </Text>
            <Text style={styles.emptyText}>
              Verifique sua conexão e tente novamente.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && (
          <>
            {/* Resumo */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryTitle}>Suas doações</Text>
                  <Text style={styles.summarySubtitle}>
                    Histórico de contribuições
                  </Text>
                </View>
                <View style={styles.summaryIcon}>
                  <Ionicons name="gift-outline" size={25} color="#16A36A" />
                </View>
              </View>

              <View style={styles.summaryNumbers}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{donations.length}</Text>
                  <Text style={styles.summaryLabel}>Total</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: "#B7791F" }]}>
                    {donations.filter((d) => d.status === "PENDING").length}
                  </Text>
                  <Text style={styles.summaryLabel}>Pendentes</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: "#3478C7" }]}>
                    {donations.filter((d) => d.status === "IN_PROGRESS").length}
                  </Text>
                  <Text style={styles.summaryLabel}>Em atendimento</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: "#16A36A" }]}>
                    {donations.filter((d) => d.status === "DELIVERED").length}
                  </Text>
                  <Text style={styles.summaryLabel}>Concluídas</Text>
                </View>
              </View>
            </View>

            {/* Filtros */}
            <Text style={styles.sectionTitle}>Minhas contribuições</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {filters.map((filter) => {
                const selected = selectedFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterButton,
                      selected && styles.filterButtonSelected,
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected && styles.filterTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Lista */}
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => {
                const statusStyle = getStatusStyle(donation.statusLabel);
                const expanded = expandedDonation === donation.id;

                return (
                  <View key={donation.id} style={styles.donationCard}>
                    <View style={styles.donationHeader}>
                      <View style={styles.donationIcon}>
                        <Ionicons
                          name="gift-outline"
                          size={22}
                          color="#16A36A"
                        />
                      </View>
                      <View style={styles.donationHeaderInfo}>
                        <Text style={styles.donationTitle}>
                          {donation.title}
                        </Text>
                        <Text style={styles.donationDate}>
                          Doação #{donation.id} • {donation.date}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.background },
                      ]}
                    >
                      <Ionicons
                        name={statusStyle.icon}
                        size={15}
                        color={statusStyle.color}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusStyle.color },
                        ]}
                      >
                        {donation.statusLabel}
                      </Text>
                    </View>

                    <View style={styles.cardDivider} />

                    {/* Ponto de coleta */}
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="business-outline"
                        size={18}
                        color="#718078"
                      />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.smallLabel}>Ponto de coleta</Text>
                        <Text style={styles.infoValue}>
                          {donation.collectionPointName ?? "Não informado"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.infoRow, { marginTop: 13 }]}>
                      <Ionicons
                        name="layers-outline"
                        size={18}
                        color="#718078"
                      />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.smallLabel}>Categorias</Text>
                        <Text style={styles.infoValue}>
                          {donation.categories || "Não informadas"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.infoRow, { marginTop: 13 }]}>
                      <Ionicons name="cube-outline" size={18} color="#718078" />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.smallLabel}>Quantidade total</Text>
                        <Text style={styles.infoValue}>
                          {donation.totalQuantity} itens
                        </Text>
                      </View>
                    </View>

                    {expanded && (
                      <View style={styles.detailsContainer}>
                        <Text style={styles.detailTitle}>Descrição</Text>
                        <Text style={styles.description}>
                          {donation.description || "Sem descrição."}
                        </Text>

                        <Text style={styles.detailTitle}>Itens doados</Text>
                        {donation.items.map((item) => (
                          <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                              <Text style={styles.itemName}>{item.name}</Text>
                              <Text style={styles.itemCategory}>
                                {item.categoryLabel}
                              </Text>
                            </View>
                            <Text style={styles.itemQuantity}>
                              Quantidade: {item.quantity}
                            </Text>
                          </View>
                        ))}

                        {donation.collectionPointAddress && (
                          <>
                            <Text
                              style={[styles.detailTitle, { marginTop: 15 }]}
                            >
                              Endereço do ponto de coleta
                            </Text>
                            <Text style={styles.description}>
                              {donation.collectionPointAddress}
                            </Text>
                          </>
                        )}

                        {donation.reviewNotes && (
                          <View style={styles.reviewContainer}>
                            <Text style={styles.detailTitle}>
                              Observações do atendimento
                            </Text>
                            <Text style={styles.description}>
                              {donation.reviewNotes}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => toggleDonation(donation.id)}
                    >
                      <Text style={styles.detailsButtonText}>
                        {expanded ? "Ocultar detalhes" : "Ver detalhes"}
                      </Text>
                      <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={17}
                        color="#16A36A"
                      />
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="gift-outline" size={45} color="#AAB5AE" />
                <Text style={styles.emptyTitle}>Nenhuma doação encontrada</Text>
                <Text style={styles.emptyText}>
                  Você ainda não realizou doações com esse status.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.newDonationButton}
              onPress={() => router.push("/UserScreens/MyDonationsScreen")}
            >
              <Ionicons name="add-circle-outline" size={21} color="#FFFFFF" />
              <Text style={styles.newDonationText}>Fazer uma doação</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 55, paddingBottom: 35 },
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 23, fontWeight: "800", color: "#173D2E" },
  headerSubtitle: { fontSize: 13, color: "#718078", marginTop: 3 },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    gap: 10,
  },
  feedbackText: { fontSize: 13, color: "#718078" },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5EDE8",
    marginBottom: 28,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: { color: "#173D2E", fontSize: 16, fontWeight: "700" },
  summarySubtitle: { color: "#89958D", fontSize: 12, marginTop: 4 },
  summaryIcon: {
    width: 43,
    height: 43,
    backgroundColor: "#E5F5EC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 23,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryNumber: { fontSize: 21, fontWeight: "800", color: "#173D2E" },
  summaryLabel: {
    fontSize: 9,
    color: "#89958D",
    marginTop: 5,
    textAlign: "center",
  },
  summaryDivider: { width: 1, height: 32, backgroundColor: "#E5EDE8" },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 13,
  },
  filtersContainer: { gap: 8, paddingBottom: 17 },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
  },
  filterButtonSelected: { backgroundColor: "#16A36A", borderColor: "#16A36A" },
  filterText: { color: "#718078", fontSize: 11, fontWeight: "600" },
  filterTextSelected: { color: "#FFFFFF" },
  donationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  donationHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  donationIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    justifyContent: "center",
    alignItems: "center",
  },
  donationHeaderInfo: { flex: 1 },
  donationTitle: { fontSize: 15, color: "#173D2E", fontWeight: "700" },
  donationDate: { fontSize: 11, color: "#89958D", marginTop: 4 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
    marginTop: 15,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardDivider: { height: 1, backgroundColor: "#EDF1EE", marginVertical: 15 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  infoTextContainer: { flex: 1 },
  smallLabel: { fontSize: 10, color: "#89958D", marginBottom: 4 },
  infoValue: { fontSize: 12, fontWeight: "600", color: "#173D2E" },
  detailsContainer: {
    marginTop: 17,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 8,
  },
  description: {
    color: "#718078",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#E5EDE8",
    gap: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { color: "#52645A", fontSize: 12, fontWeight: "600" },
  itemCategory: { color: "#89958D", fontSize: 10, marginTop: 3 },
  itemQuantity: { color: "#89958D", fontSize: 11 },
  reviewContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#F0F9F4",
    borderRadius: 12,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDF1EE",
  },
  detailsButtonText: { color: "#16A36A", fontSize: 12, fontWeight: "700" },
  emptyContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#173D2E",
    marginTop: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#89958D",
    textAlign: "center",
    marginTop: 6,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#16A36A",
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 10,
  },
  retryText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  newDonationButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: "#16A36A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 10,
  },
  newDonationText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
});
