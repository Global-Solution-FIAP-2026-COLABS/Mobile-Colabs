import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { getRole } from "../../api/api";
import {
  useCommunityDonations,
  useFulfillDonation,
} from "../../hooks/useDonation";

import type { DonationResponse } from "../../types/donationTypes";

const categories = [
  "Todas",
  "Alimentos",
  "Roupas",
  "Higiene",
  "Medicamentos",
  "Móveis",
  "Outros",
];

const categoryLabels: Record<string, string> = {
  FOOD: "Alimentos",
  CLOTHING: "Roupas",
  HYGIENE: "Higiene",
  MEDICINE: "Medicamentos",
  FURNITURE: "Móveis",
  OTHER: "Outros",
};

function formatDate(date: string) {
  if (!date) return "Data não informada";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não informada";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

function getRequestCategories(request: DonationResponse) {
  const labels = (request.items ?? []).map(
    (item) => item.categoryLabel || categoryLabels[item.category] || "Outros",
  );

  return [...new Set(labels)];
}

export default function FindRequestsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedInstitution, setSelectedInstitution] = useState("Todas");
  const [itemType, setItemType] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);


  const { data, isLoading, isError, error, refetch, isRefetching } =
    useCommunityDonations();

  const fulfillMutation = useFulfillDonation();

  const requests = data?.content ?? [];

  useEffect(() => {
  async function loadUserRole() {
    try {
      const role = await getRole();
      setUserRole(role);
    } catch (error) {
      console.error("Erro ao carregar papel do usuário:", error);
    } finally {
      setRoleLoading(false);
    }
  }

  loadUserRole();
}, []);

  // Instituições disponíveis
  const institutionOptions = useMemo(() => {
    const institutions = requests
      .map((request) => request.collectionPointName || "Sem ponto de coleta")
      .filter((institution) => institution.trim().length > 0);

    return ["Todas", ...Array.from(new Set(institutions))];
  }, [requests]);

  // Filtros
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const requestCategories = getRequestCategories(request);
      const search = searchText.toLowerCase().trim();

      const matchesSearch =
        request.citizenName.toLowerCase().includes(search) ||
        request.title.toLowerCase().includes(search) ||
        request.description.toLowerCase().includes(search) ||
        request.items.some((item) => item.name.toLowerCase().includes(search));

      const matchesCategory =
        selectedCategory === "Todas" ||
        requestCategories.includes(selectedCategory);

      const institution = request.collectionPointName || "Sem ponto de coleta";

      const matchesInstitution =
        selectedInstitution === "Todas" || institution === selectedInstitution;

      const matchesItem =
        !itemType.trim() ||
        request.items.some((item) =>
          item.name.toLowerCase().includes(itemType.toLowerCase().trim()),
        );

      return (
        request.type === "HELP_REQUEST" &&
        request.status === "PENDING" &&
        matchesSearch &&
        matchesCategory &&
        matchesInstitution &&
        matchesItem
      );
    });
  }, [requests, searchText, selectedCategory, selectedInstitution, itemType]);

  function clearFilters() {
    setSearchText("");
    setSelectedCategory("Todas");
    setSelectedInstitution("Todas");
    setItemType("");
  }

  // Assumir pedido
async function handleFulfill(request: DonationResponse) {
  const isCitizen = userRole === "CITIZEN";

  Alert.alert(
    isCitizen ? "Confirmar ajuda" : "Confirmar atendimento",
    isCitizen
      ? `Deseja ajudar ${request.citizenName} com este pedido?`
      : `Deseja assumir o pedido de ${request.citizenName}?`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            await fulfillMutation.mutateAsync(request.id);

            if (isCitizen) {
              Alert.alert(
                "Ajuda confirmada!",
                "Você aceitou ajudar esta pessoa. Obrigado por fazer parte dessa iniciativa!",
              );

              return;
            }

            // Fluxo já existente para instituições
            router.push({
              pathname: "/OrgScreens/DeliverDonation",
              params: {
                requestId: String(request.id),
                user: request.citizenName,
                category:
                  request.aiSuggestedCategory ??
                  request.items?.[0]?.categoryLabel ??
                  "Não informada",
                institution: request.collectionPointName ?? "",
                donorType: "CITIZEN",
                items: JSON.stringify(
                  (request.items ?? []).map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                  })),
                ),
                description: request.description ?? "",
              },
            } as any);
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Não foi possível aceitar o pedido.";

            Alert.alert("Erro", message);
          }
        },
      },
    ],
  );
}

  // Abrir detalhes
  function openRequest(request: DonationResponse) {
    router.push({
      pathname: "/OrgScreens/ViewRequest",
      params: {
        id: String(request.id),
        user: request.citizenName,
        category: getRequestCategories(request).join(", "),
        institution: request.collectionPointName || "Sem ponto de coleta",
        description: request.description,
        date: formatDate(request.createdAt),
        status: request.status,
        items: JSON.stringify(request.items),
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/OrgScreens/FindRequests");
              }
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#173D2E" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Encontrar pedidos</Text>

            <Text style={styles.subtitle}>
              Encontre pessoas que precisam de ajuda.
            </Text>
          </View>
        </View>

        {/* Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#89958D" />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pedidos ou itens..."
            placeholderTextColor="#9CA9A1"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filtros */}
        <View style={styles.filterHeader}>
          <View style={styles.filterTitleContainer}>
            <Ionicons name="options-outline" size={19} color="#173D2E" />

            <Text style={styles.sectionTitle}>Filtros</Text>
          </View>

          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Limpar filtros</Text>
          </TouchableOpacity>
        </View>

        {/* Categoria */}
        <Text style={styles.filterLabel}>Categoria</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selected && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Proximidade */}
        <Text style={styles.filterLabel}>Proximidade</Text>

        <View style={styles.itemSearchContainer}>
          <Ionicons name="location-outline" size={19} color="#89958D" />

          <Text style={styles.unavailableText}>
            Distância não disponível nos dados do pedido.
          </Text>
        </View>

        {/* Instituição */}
        <Text style={styles.filterLabel}>Instituição vinculada</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {institutionOptions.map((institution) => {
            const selected = selectedInstitution === institution;

            return (
              <TouchableOpacity
                key={institution}
                style={[
                  styles.categoryButton,
                  selected && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedInstitution(institution)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
                  ]}
                >
                  {institution}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tipo de item */}
        <Text style={styles.filterLabel}>Tipo de item</Text>

        <View style={styles.itemSearchContainer}>
          <Ionicons name="cube-outline" size={19} color="#89958D" />

          <TextInput
            style={styles.searchInput}
            placeholder="Ex: arroz, sabonete, camiseta..."
            placeholderTextColor="#9CA9A1"
            value={itemType}
            onChangeText={setItemType}
          />
        </View>

        {/* Resultados */}
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.sectionTitle}>Pedidos disponíveis</Text>

            <Text style={styles.resultsSubtitle}>
              {filteredRequests.length} pedido(s) encontrado(s)
            </Text>
          </View>

          <Ionicons name="list-outline" size={22} color="#16A36A" />
        </View>

        {/* Carregamento */}
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#16A36A" />

            <Text style={styles.emptyText}>
              Carregando pedidos comunitários...
            </Text>
          </View>
        ) : isError ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={38} color="#C75B5B" />

            <Text style={styles.emptyTitle}>
              Não foi possível carregar os pedidos
            </Text>

            <Text style={styles.emptyText}>
              {error instanceof Error
                ? error.message
                : "Verifique sua conexão e tente novamente."}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={38} color="#AAB5AE" />

            <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>

            <Text style={styles.emptyText}>
              Tente alterar os filtros ou volte mais tarde para conferir novos
              pedidos.
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => {
            const requestCategories = getRequestCategories(request);

            return (
              <View key={request.id} style={styles.requestCard}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openRequest(request)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {requestCategories.join(", ") || "Outros"}
                      </Text>
                    </View>

                    <Text style={styles.statusText}>Disponível</Text>
                  </View>

                  <Text style={styles.userName}>{request.citizenName}</Text>

                  <Text style={styles.requestDescription}>
                    {request.title}
                    {"\n"}
                    {request.description}
                  </Text>

                  <View style={styles.cardInfo}>
                    <Ionicons
                      name="business-outline"
                      size={16}
                      color="#718078"
                    />

                    <Text style={styles.cardInfoText}>
                      {request.collectionPointName ||
                        "Sem ponto de coleta vinculado"}
                    </Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#718078"
                    />

                    <Text style={styles.cardInfoText}>
                      {formatDate(request.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Ionicons name="cube-outline" size={16} color="#718078" />

                    <Text style={styles.cardInfoText}>
                      {request.items
                        .map((item) => `${item.name} (${item.quantity})`)
                        .join(", ")}
                    </Text>
                  </View>

                  <View style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>
                      Visualizar pedido
                    </Text>

                    <Ionicons name="arrow-forward" size={18} color="#16A36A" />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        {isRefetching && !isLoading && (
          <ActivityIndicator style={{ marginVertical: 12 }} color="#16A36A" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 14,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF2EC",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#173D2E",
  },

  subtitle: {
    fontSize: 12,
    color: "#89958D",
    marginTop: 4,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5EBE6",
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#173D2E",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  filterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#173D2E",
  },

  clearText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A36A",
  },

  filterLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#53645A",
    marginBottom: 10,
    marginTop: 12,
  },

  categoryList: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 5,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2EAE3",
  },

  categoryButtonSelected: {
    backgroundColor: "#173D2E",
    borderColor: "#173D2E",
  },

  categoryText: {
    color: "#64736A",
    fontSize: 11,
    fontWeight: "600",
  },

  categoryTextSelected: {
    color: "#FFFFFF",
  },

  itemSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#E5EBE6",
    marginBottom: 8,
  },

  unavailableText: {
    flex: 1,
    color: "#89958D",
    fontSize: 11,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
  },

  resultsSubtitle: {
    color: "#89958D",
    fontSize: 11,
    marginTop: 4,
  },

  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E8EEE9",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    gap: 8,
  },

  categoryBadge: {
    backgroundColor: "#E8F5ED",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  categoryBadgeText: {
    color: "#168653",
    fontSize: 10,
    fontWeight: "700",
  },

  statusText: {
    color: "#168653",
    fontSize: 11,
    fontWeight: "700",
  },

  userName: {
    color: "#173D2E",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 7,
  },

  requestDescription: {
    color: "#64736A",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 13,
  },

  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 9,
  },

  cardInfoText: {
    flex: 1,
    color: "#718078",
    fontSize: 11,
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EDF1ED",
  },

  detailsButtonText: {
    color: "#16A36A",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 35,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: "#173D2E",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },

  emptyText: {
    color: "#89958D",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },

  retryButton: {
    backgroundColor: "#16A36A",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 15,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  fulfillButton: {
    backgroundColor: "#16A36A",
    borderRadius: 11,
    paddingVertical: 13,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  fulfillButtonDisabled: {
    opacity: 0.6,
  },

  fulfillButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
