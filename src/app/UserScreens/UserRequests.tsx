import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMyDonations, useCompleteDonation } from "../../hooks/useDonation";
import type { DonationStatus } from "../../types/donationTypes";

const filters = ["Todos", "Pendente", "Em atendimento", "Concluído"] as const;

type Filter = (typeof filters)[number];

type RequestStatus =
  | "Pendente"
  | "Em atendimento"
  | "Aprovado"
  | "Recusado"
  | "Concluído"
  | "Cancelado";

type HelpRequest = {
  id: number;
  category: string;
  institution: string;
  description: string;
  date: string;
  status: RequestStatus;
  reviewNotes: string | null;
  reviewedAt: string | null;
  items: {
    name: string;
    quantity: number;
  }[];
};

function mapDonationStatus(status: DonationStatus): RequestStatus {
  const statusMap: Record<DonationStatus, RequestStatus> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em atendimento",
    APPROVED: "Aprovado",
    REJECTED: "Recusado",
    DELIVERED: "Concluído",
    CANCELLED: "Cancelado",
  };

  return statusMap[status];
}

export default function MyRequestsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useMyDonations();

  const completeMutation = useCompleteDonation();

  const [selectedFilter, setSelectedFilter] = useState<Filter>("Todos");
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  const requests: HelpRequest[] = (data?.content ?? [])
    .filter((donation) => donation.type === "HELP_REQUEST")
    .map((donation) => ({
      id: donation.id,
      category: [
        ...new Set(
          donation.items.map((item) => item.categoryLabel ?? item.category),
        ),
      ].join(", "),
      institution: donation.collectionPointName ?? "Instituição não informada",
      description: donation.description,
      date: new Date(donation.createdAt).toLocaleDateString("pt-BR"),
      status: mapDonationStatus(donation.status),
      reviewNotes: donation.reviewNotes,
      reviewedAt: donation.reviewedAt,
      items: donation.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    }));

  const filteredRequests =
    selectedFilter === "Todos"
      ? requests
      : requests.filter((request) => request.status === selectedFilter);

  function toggleRequest(id: number) {
    setExpandedRequest((current) => (current === id ? null : id));
  }

  function handleCompleteRequest(request: HelpRequest) {
    Alert.alert(
      "Confirmar recebimento",
      `Você confirma que recebeu a ajuda referente ao pedido #${request.id}? Após a confirmação, o pedido será marcado como concluído.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar recebimento",
          onPress: async () => {
            try {
              await completeMutation.mutateAsync(request.id);

              Alert.alert(
                "Pedido concluído!",
                "O recebimento foi confirmado e o status do seu pedido foi atualizado.",
              );
            } catch (error) {
              console.error("Erro ao concluir pedido:", error);

              Alert.alert(
                "Não foi possível concluir",
                error instanceof Error
                  ? error.message
                  : "Ocorreu um erro ao confirmar o recebimento. Tente novamente.",
              );
            }
          },
        },
      ],
    );
  }

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "Pendente":
        return {
          background: "#FFF3CD",
          text: "#856404",
          iconName: "time-outline" as const,
        };

      case "Em atendimento":
        return {
          background: "#D1ECF1",
          text: "#0C5460",
          iconName: "sync-outline" as const,
        };

      case "Aprovado":
        return {
          background: "#D4EDDA",
          text: "#155724",
          iconName: "checkmark-circle-outline" as const,
        };

      case "Recusado":
        return {
          background: "#F8D7DA",
          text: "#721C24",
          iconName: "close-circle-outline" as const,
        };

      case "Concluído":
        return {
          background: "#D4EDDA",
          text: "#155724",
          iconName: "checkmark-done-circle-outline" as const,
        };

      case "Cancelado":
        return {
          background: "#E2E3E5",
          text: "#383D41",
          iconName: "ban-outline" as const,
        };

      default:
        return {
          background: "#E2E3E5",
          text: "#383D41",
          iconName: "help-circle-outline" as const,
        };
    }
  };

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
            <Text style={styles.headerTitle}>Meus pedidos</Text>
            <Text style={styles.headerSubtitle}>
              Acompanhe suas solicitações de ajuda
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

        {/* Carregamento */}
        {isLoading && (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color="#16A36A" />
            <Text style={styles.feedbackText}>Carregando seus pedidos...</Text>
          </View>
        )}

        {/* Erro */}
        {isError && !isLoading && (
          <View style={styles.feedbackContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#C0392B" />
            <Text style={styles.emptyTitle}>
              Não foi possível carregar seus pedidos
            </Text>
            <Text style={styles.emptyText}>
              Verifique sua conexão e tente novamente.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text style={styles.evaluateButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && (
          <>
            {/* Resumo */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryTitle}>Seus pedidos</Text>
                  <Text style={styles.summarySubtitle}>
                    Histórico de solicitações
                  </Text>
                </View>

                <View style={styles.summaryIcon}>
                  <Ionicons
                    name="clipboard-outline"
                    size={25}
                    color="#16A36A"
                  />
                </View>
              </View>

              <View style={styles.summaryNumbers}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{requests.length}</Text>
                  <Text style={styles.summaryLabel}>Total</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: "#B7791F" }]}>
                    {requests.filter((r) => r.status === "Pendente").length}
                  </Text>
                  <Text style={styles.summaryLabel}>Pendentes</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: "#3478C7" }]}>
                    {
                      requests.filter((r) => r.status === "Em atendimento")
                        .length
                    }
                  </Text>
                  <Text style={styles.summaryLabel}>Em atendimento</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: "#16A36A" }]}>
                    {requests.filter((r) => r.status === "Concluído").length}
                  </Text>
                  <Text style={styles.summaryLabel}>Concluídos</Text>
                </View>
              </View>
            </View>

            {/* Filtros */}
            <Text style={styles.sectionTitle}>Minhas solicitações</Text>

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

            {/* Lista de pedidos */}
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const statusStyle = getStatusColor(request.status);
                const expanded = expandedRequest === request.id;
                const isCompleting =
                  completeMutation.isPending &&
                  completeMutation.variables === request.id;

                return (
                  <View key={request.id} style={styles.requestCard}>
                    {/* Cabeçalho do pedido */}
                    <View style={styles.requestHeader}>
                      <View style={styles.categoryIcon}>
                        <Ionicons
                          name="heart-outline"
                          size={22}
                          color="#16A36A"
                        />
                      </View>

                      <View style={styles.requestHeaderInfo}>
                        <Text style={styles.categoryText}>
                          {request.category || "Categoria não informada"}
                        </Text>
                        <Text style={styles.requestDate}>
                          Pedido #{request.id} • {request.date}
                        </Text>
                      </View>
                    </View>

                    {/* Status */}
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.background },
                      ]}
                    >
                      <Ionicons
                        name={statusStyle.iconName}
                        size={15}
                        color={statusStyle.text}
                      />
                      <Text
                        style={[styles.statusText, { color: statusStyle.text }]}
                      >
                        {request.status}
                      </Text>
                    </View>

                    {/* Confirmar recebimento */}
                    {request.status === "Em atendimento" && (
                      <View style={styles.completionContainer}>
                        <View style={styles.completionInfo}>
                          <Ionicons
                            name="gift-outline"
                            size={21}
                            color="#16A36A"
                          />
                          <View style={styles.completionTextContainer}>
                            <Text style={styles.completionTitle}>
                              Já recebeu a ajuda?
                            </Text>
                            <Text style={styles.completionDescription}>
                              Confirme o recebimento para concluir sua
                              solicitação.
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.completeButton,
                            completeMutation.isPending && styles.disabledButton,
                          ]}
                          onPress={() => handleCompleteRequest(request)}
                          disabled={completeMutation.isPending}
                          activeOpacity={0.8}
                        >
                          {isCompleting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={19}
                              color="#FFFFFF"
                            />
                          )}

                          <Text style={styles.completeButtonText}>
                            {isCompleting
                              ? "Concluindo..."
                              : "Confirmar recebimento e concluir"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Avaliação */}
                    {request.status === "Concluído" && (
                      <TouchableOpacity
                        style={styles.evaluateButton}
                        onPress={() =>
                          router.push({
                            pathname: "/UserScreens/EvaluateUserScreen",
                            params: {
                              requestId: String(request.id),
                              institution: request.institution,
                              category: request.category,
                            },
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="star-outline"
                          size={18}
                          color="#FFFFFF"
                        />
                        <Text style={styles.evaluateButtonText}>
                          Avaliar atendimento
                        </Text>
                      </TouchableOpacity>
                    )}

                    <View style={styles.cardDivider} />

                    {/* Instituição */}
                    <View style={styles.institutionRow}>
                      <Ionicons
                        name="business-outline"
                        size={18}
                        color="#718078"
                      />
                      <View style={styles.institutionTextContainer}>
                        <Text style={styles.smallLabel}>
                          Instituição responsável
                        </Text>
                        <Text style={styles.institutionName}>
                          {request.institution}
                        </Text>
                      </View>
                    </View>

                    {/* Detalhes */}
                    {/* Detalhes */}
                    {expanded && (
                      <View style={styles.detailsContainer}>
                        <Text style={styles.detailTitle}>
                          Descrição da necessidade
                        </Text>

                        <Text style={styles.description}>
                          {request.description}
                        </Text>

                        <Text style={styles.detailTitle}>
                          Itens solicitados
                        </Text>

                        {request.items.map((item, index) => (
                          <View
                            key={`${request.id}-${index}`}
                            style={styles.itemRow}
                          >
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQuantity}>
                              Quantidade: {item.quantity}
                            </Text>
                          </View>
                        ))}

                        {/* Comentário da avaliação */}
                        {request.reviewNotes && (
                          <View style={styles.reviewContainer}>
                            <View style={styles.reviewHeader}>
                              <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={18}
                                color="#16A36A"
                              />

                              <Text style={styles.detailTitle}>
                                Comentário sobre o atendimento
                              </Text>
                            </View>

                            <Text style={styles.reviewText}>
                              {request.reviewNotes}
                            </Text>

                            {request.reviewedAt && (
                              <Text style={styles.reviewDate}>
                                Avaliado em{" "}
                                {new Date(
                                  request.reviewedAt,
                                ).toLocaleDateString("pt-BR")}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => toggleRequest(request.id)}
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
                <Ionicons name="file-tray-outline" size={45} color="#AAB5AE" />
                <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
                <Text style={styles.emptyText}>
                  Você ainda não possui pedidos com esse status.
                </Text>
              </View>
            )}

            {/* Novo pedido */}
            <TouchableOpacity
              style={styles.newRequestButton}
              onPress={() => router.push("/UserScreens/RequestHelpScreen")}
            >
              <Ionicons name="add-circle-outline" size={21} color="#FFFFFF" />
              <Text style={styles.newRequestText}>Criar novo pedido</Text>
            </TouchableOpacity>
          </>
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#173D2E",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#718078",
    marginTop: 3,
  },
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
  feedbackText: {
    fontSize: 13,
    color: "#718078",
  },
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
  summaryTitle: {
    color: "#173D2E",
    fontSize: 16,
    fontWeight: "700",
  },
  summarySubtitle: {
    color: "#89958D",
    fontSize: 12,
    marginTop: 4,
  },
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
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 21,
    fontWeight: "800",
    color: "#173D2E",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#89958D",
    marginTop: 5,
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5EDE8",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 13,
  },
  filtersContainer: {
    gap: 8,
    paddingBottom: 17,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
  },
  filterButtonSelected: {
    backgroundColor: "#16A36A",
    borderColor: "#16A36A",
  },
  filterText: {
    color: "#718078",
    fontSize: 11,
    fontWeight: "600",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    justifyContent: "center",
    alignItems: "center",
  },
  requestHeaderInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 15,
    color: "#173D2E",
    fontWeight: "700",
  },
  requestDate: {
    fontSize: 11,
    color: "#89958D",
    marginTop: 4,
  },
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
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  completionContainer: {
    marginTop: 15,
    padding: 13,
    borderRadius: 13,
    backgroundColor: "#F0F9F4",
    borderWidth: 1,
    borderColor: "#D6EDE0",
  },
  completionInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 13,
  },
  completionTextContainer: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#173D2E",
  },
  completionDescription: {
    fontSize: 11,
    color: "#718078",
    lineHeight: 17,
    marginTop: 4,
  },
  completeButton: {
    minHeight: 44,
    borderRadius: 11,
    backgroundColor: "#16A36A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#EDF1EE",
    marginVertical: 15,
  },
  institutionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  institutionTextContainer: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 10,
    color: "#89958D",
    marginBottom: 4,
  },
  institutionName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#173D2E",
  },
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
    marginBottom: 17,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#E5EDE8",
  },
  itemName: {
    color: "#52645A",
    fontSize: 12,
    fontWeight: "600",
  },
  itemQuantity: {
    color: "#89958D",
    fontSize: 11,
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
  detailsButtonText: {
    color: "#16A36A",
    fontSize: 12,
    fontWeight: "700",
  },
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
  evaluateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#16A36A",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 15,
  },
  evaluateButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  newRequestButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: "#16A36A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 10,
  },
  newRequestText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  reviewContainer: {
    marginTop: 18,
    padding: 13,
    backgroundColor: "#F0F9F4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6EDE0",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  reviewText: {
    fontSize: 12,
    color: "#52645A",
    lineHeight: 19,
  },

  reviewDate: {
    fontSize: 10,
    color: "#89958D",
    marginTop: 10,
  },
});
