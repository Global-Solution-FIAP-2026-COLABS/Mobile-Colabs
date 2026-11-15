import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type RequestItem = {
  name: string;
  quantity: number;
};

type HelpRequest = {
  id: number;
  user: string;
  category: string;
  institution: string;
  distance: number;
  description: string;
  date: string;
  status: string;
  items: RequestItem[];
};

const categories = [
  "Todas",
  "Alimentos",
  "Roupas",
  "Higiene",
  "Medicamentos",
  "Móveis",
  "Outros",
];

// Dados temporários para desenvolvimento da interface
const mockRequests: HelpRequest[] = [
  {
    id: 1,
    user: "Maria Oliveira",
    category: "Alimentos",
    institution: "Instituição Esperança",
    distance: 1.2,
    description: "Preciso de alimentos básicos para minha família.",
    date: "14/11/2026",
    status: "Disponível",
    items: [
      { name: "Arroz", quantity: 2 },
      { name: "Feijão", quantity: 2 },
      { name: "Óleo", quantity: 1 },
    ],
  },
  {
    id: 2,
    user: "João Santos",
    category: "Higiene",
    institution: "Centro Solidário",
    distance: 3.5,
    description: "Necessito de produtos de higiene pessoal.",
    date: "13/11/2026",
    status: "Disponível",
    items: [
      { name: "Sabonete", quantity: 4 },
      { name: "Creme dental", quantity: 2 },
      { name: "Shampoo", quantity: 1 },
    ],
  },
  {
    id: 3,
    user: "Ana Costa",
    category: "Roupas",
    institution: "Instituto Vida Nova",
    distance: 7.8,
    description: "Estou precisando de roupas para meus filhos.",
    date: "12/11/2026",
    status: "Disponível",
    items: [
      { name: "Camiseta", quantity: 3 },
      { name: "Calça", quantity: 2 },
    ],
  },
  {
    id: 4,
    user: "Pedro Lima",
    category: "Alimentos",
    institution: "Instituição Esperança",
    distance: 2.0,
    description: "Pedido de uma cesta básica.",
    date: "11/11/2026",
    status: "Disponível",
    items: [
      { name: "Arroz", quantity: 1 },
      { name: "Feijão", quantity: 1 },
      { name: "Macarrão", quantity: 3 },
    ],
  },
];

export default function FindRequestsScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [maxDistance, setMaxDistance] = useState(10);
  const [selectedInstitution, setSelectedInstitution] = useState("Todas");
  const [itemType, setItemType] = useState("");
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  const institutionOptions = [
    "Todas",
    ...Array.from(new Set(mockRequests.map((request) => request.institution))),
  ];

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((request) => {
      const matchesSearch =
        request.user.toLowerCase().includes(searchText.toLowerCase()) ||
        request.description.toLowerCase().includes(searchText.toLowerCase()) ||
        request.items.some((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "Todas" || request.category === selectedCategory;

      const matchesDistance = request.distance <= maxDistance;

      const matchesInstitution =
        selectedInstitution === "Todas" ||
        request.institution === selectedInstitution;

      const matchesItem =
        !itemType.trim() ||
        request.items.some((item) =>
          item.name.toLowerCase().includes(itemType.toLowerCase().trim()),
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDistance &&
        matchesInstitution &&
        matchesItem
      );
    });
  }, [
    searchText,
    selectedCategory,
    maxDistance,
    selectedInstitution,
    itemType,
  ]);

  function toggleDetails(requestId: number) {
    setExpandedRequest((current) => (current === requestId ? null : requestId));
  }

  function clearFilters() {
    setSearchText("");
    setSelectedCategory("Todas");
    setMaxDistance(10);
    setSelectedInstitution("Todas");
    setItemType("");
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

        <View style={styles.distanceContainer}>
          {[2, 5, 10].map((distance) => {
            const selected = maxDistance === distance;

            return (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.distanceButton,
                  selected && styles.distanceButtonSelected,
                ]}
                onPress={() => setMaxDistance(distance)}
              >
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={selected ? "#FFFFFF" : "#16A36A"}
                />
                <Text
                  style={[
                    styles.distanceText,
                    selected && styles.distanceTextSelected,
                  ]}
                >
                  Até {distance} km
                </Text>
              </TouchableOpacity>
            );
          })}
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

        {filteredRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={38} color="#AAB5AE" />
            <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
            <Text style={styles.emptyText}>
              Tente alterar os filtros para encontrar outros pedidos.
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => (
            <TouchableOpacity
              key={request.id}
              style={styles.requestCard}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/OrgScreens/ViewRequest",
                  params: {
                    id: String(request.id),
                    user: request.user,
                    category: request.category,
                    institution: request.institution,
                    distance: String(request.distance),
                    description: request.description,
                    date: request.date,
                    status: request.status,
                    items: JSON.stringify(request.items),
                  },
                } as any)
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {request.category}
                  </Text>
                </View>

                <Text style={styles.distanceBadge}>
                  <Ionicons name="location-outline" size={13} color="#16A36A" />{" "}
                  {request.distance.toFixed(1)} km
                </Text>
              </View>

              <Text style={styles.userName}>{request.user}</Text>

              <Text style={styles.requestDescription}>
                {request.description}
              </Text>

              <View style={styles.cardInfo}>
                <Ionicons name="business-outline" size={16} color="#718078" />
                <Text style={styles.cardInfoText}>{request.institution}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Ionicons name="calendar-outline" size={16} color="#718078" />
                <Text style={styles.cardInfoText}>{request.date}</Text>
              </View>

              <View style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Visualizar pedido</Text>

                <Ionicons name="arrow-forward" size={18} color="#16A36A" />
              </View>
            </TouchableOpacity>
          ))
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
  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#173D2E",
  },
  subtitle: {
    fontSize: 12,
    color: "#718078",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    color: "#173D2E",
    fontSize: 13,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  filterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: "#173D2E",
    fontSize: 16,
    fontWeight: "700",
  },
  clearText: {
    color: "#16A36A",
    fontSize: 12,
    fontWeight: "600",
  },
  filterLabel: {
    color: "#52645A",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 12,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 5,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DFE8E2",
    backgroundColor: "#FFFFFF",
  },
  categoryButtonSelected: {
    backgroundColor: "#16A36A",
    borderColor: "#16A36A",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#718078",
  },
  categoryTextSelected: {
    color: "#FFFFFF",
  },
  distanceContainer: {
    flexDirection: "row",
    gap: 8,
  },
  distanceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
  },
  distanceButtonSelected: {
    backgroundColor: "#16A36A",
    borderColor: "#16A36A",
  },
  distanceText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52645A",
  },
  distanceTextSelected: {
    color: "#FFFFFF",
  },
  itemSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 48,
    gap: 9,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  categoryBadge: {
    backgroundColor: "#E5F5EC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    color: "#16A36A",
    fontSize: 10,
    fontWeight: "700",
  },
  distanceBadge: {
    color: "#16A36A",
    fontSize: 11,
    fontWeight: "600",
  },
  userName: {
    color: "#173D2E",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 7,
  },
  requestDescription: {
    color: "#718078",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 13,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },
  cardInfoText: {
    color: "#718078",
    fontSize: 11,
    flex: 1,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EDF1EE",
    marginTop: 7,
    paddingTop: 13,
  },
  detailsButtonText: {
    color: "#16A36A",
    fontSize: 12,
    fontWeight: "700",
  },
  detailsContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 13,
    marginTop: 12,
  },
  detailsTitle: {
    color: "#173D2E",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E5EDE8",
  },
  itemName: {
    color: "#52645A",
    fontSize: 12,
  },
  itemQuantity: {
    color: "#718078",
    fontSize: 11,
  },
  statusText: {
    color: "#16A36A",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    marginTop: 5,
  },
  emptyTitle: {
    color: "#173D2E",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },
  emptyText: {
    color: "#89958D",
    fontSize: 12,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 18,
  },
});
