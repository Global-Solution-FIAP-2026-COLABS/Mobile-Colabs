import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

type RequestItem = {
  id?: number;
  name: string;
  quantity: number;
};

type DonationItem = {
  id: number;
  name: string;
  requestedQuantity: number;
  donationQuantity: string;
  selected: boolean;
};

const institutions = [
  "Instituição Esperança",
  "Centro Solidário",
  "Instituto Vida Nova",
];

export default function RegisterDonation() {
  const params = useLocalSearchParams<{
    requestId: string;
    user: string;
    category: string;
    institution: string;
    items: string;
  }>();

  const [donorType, setDonorType] = useState<"institution" | "independent">(
    "institution",
  );

  const [selectedInstitution, setSelectedInstitution] = useState(
    params.institution || "",
  );

  const [description, setDescription] = useState("");

  const [items, setItems] = useState<DonationItem[]>(() => {
    try {
      const rawItems = Array.isArray(params.items)
        ? params.items[0]
        : params.items;

      const parsedItems: RequestItem[] = JSON.parse(rawItems || "[]");

      return parsedItems.map((item, index) => ({
        id: item.id ?? index + 1,
        name: item.name,
        requestedQuantity: item.quantity,
        donationQuantity: "",
        selected: false,
      }));
    } catch {
      return [];
    }
  });

  function handleToggleItem(itemId: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              selected: !item.selected,
              donationQuantity: "",
            }
          : item,
      ),
    );
  }

  function handleQuantityChange(itemId: number, value: string) {
    const numericValue = value.replace(/[^0-9]/g, "");

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, donationQuantity: numericValue } : item,
      ),
    );
  }

  function handleSubmit() {
    if (!params.requestId || !Number.isInteger(Number(params.requestId))) {
      Alert.alert("Pedido inválido", "Não foi possível identificar o pedido.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Atenção", "Este pedido não possui itens cadastrados.");
      return;
    }

    if (donorType === "institution" && !selectedInstitution.trim()) {
      Alert.alert(
        "Atenção",
        "Selecione a instituição responsável pela doação.",
      );
      return;
    }

    const selectedItems = items.filter(
      (item) => item.selected && Number(item.donationQuantity) > 0,
    );

    if (selectedItems.length === 0) {
      Alert.alert(
        "Atenção",
        "Selecione pelo menos um item para doar e informe a quantidade.",
      );
      return;
    }

    const invalidQuantity = selectedItems.some(
      (item) =>
        !Number.isInteger(Number(item.donationQuantity)) ||
        Number(item.donationQuantity) > item.requestedQuantity,
    );

    if (invalidQuantity) {
      Alert.alert(
        "Quantidade inválida",
        "A quantidade da doação deve ser um número inteiro positivo e não pode ultrapassar a quantidade solicitada.",
      );
      return;
    }

    const donationData = {
      requestId: Number(params.requestId),
      donorType,
      institution: donorType === "institution" ? selectedInstitution : null,
      items: selectedItems.map((item) => ({
        itemId: item.id,
        name: item.name,
        quantity: Number(item.donationQuantity),
      })),
      description: description.trim(),
    };

    console.log("Dados da doação:", donationData);

    // Navega para a tela de entrega
    router.replace({
      pathname: "/OrgScreens/DeliverDonation",
      params: {
        requestId: String(donationData.requestId),
        user: params.user,
        category: params.category,
        institution: donationData.institution ?? "",
        donorType: donationData.donorType,
        items: JSON.stringify(donationData.items),
        description: donationData.description,
      },
    } as any);

    console.log("Dados da doação:", donationData);

  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/InstitutionScreens/HomeInstitution" as any);
            }
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={23} color="#173D2E" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Registrar doação</Text>
          <Text style={styles.subtitle}>
            Ajude a atender um pedido da comunidade.
          </Text>
        </View>
      </View>

      {/* Resumo do pedido */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedido selecionado</Text>

        <View style={styles.requestCard}>
          <View style={styles.requestIcon}>
            <Ionicons name="hand-left-outline" size={22} color="#16A36A" />
          </View>

          <View style={styles.requestInfo}>
            <Text style={styles.requestUser}>Pedido #{params.requestId}</Text>

            <Text style={styles.requestCategory}>
              Solicitante: {params.user}
            </Text>

            <Text style={styles.requestInstitution}>
              Categoria: {params.category}
            </Text>

            <Text style={styles.requestInstitution}>
              Instituição: {params.institution}
            </Text>
          </View>
        </View>
      </View>

      {/* Responsável pela doação */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Responsável pela doação</Text>

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              donorType === "institution" && styles.selectedType,
            ]}
            onPress={() => setDonorType("institution")}
          >
            <Ionicons
              name="business-outline"
              size={20}
              color={donorType === "institution" ? "#16A36A" : "#718078"}
            />

            <Text
              style={[
                styles.typeText,
                donorType === "institution" && styles.selectedTypeText,
              ]}
            >
              Instituição
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              donorType === "independent" && styles.selectedType,
            ]}
            onPress={() => setDonorType("independent")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={donorType === "independent" ? "#16A36A" : "#718078"}
            />

            <Text
              style={[
                styles.typeText,
                donorType === "independent" && styles.selectedTypeText,
              ]}
            >
              Independente
            </Text>
          </TouchableOpacity>
        </View>

        {donorType === "institution" && (
          <View style={styles.institutionContainer}>
            <Text style={styles.inputLabel}>Instituição responsável</Text>

            {institutions.map((institution) => (
              <TouchableOpacity
                key={institution}
                style={[
                  styles.institutionOption,
                  selectedInstitution === institution && styles.selectedCard,
                ]}
                onPress={() => setSelectedInstitution(institution)}
              >
                <Text style={styles.institutionText}>{institution}</Text>

                <Ionicons
                  name={
                    selectedInstitution === institution
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={21}
                  color={
                    selectedInstitution === institution ? "#16A36A" : "#AAB8AF"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {donorType === "independent" && (
          <View style={styles.independentInfo}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#16A36A"
            />

            <Text style={styles.independentInfoText}>
              A doação será registrada em nome de um doador independente.
            </Text>
          </View>
        )}
      </View>

      {/* Itens */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Itens da doação</Text>

        <Text style={styles.sectionDescription}>
          Selecione os itens e informe as quantidades que irá doar.
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyItems}>
            <Ionicons name="cube-outline" size={30} color="#AAB8AF" />

            <Text style={styles.emptyText}>
              Este pedido não possui itens cadastrados.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <TouchableOpacity
                  style={styles.itemSelection}
                  onPress={() => handleToggleItem(item.id)}
                >
                  <Ionicons
                    name={item.selected ? "checkbox" : "square-outline"}
                    size={23}
                    color={item.selected ? "#16A36A" : "#AAB8AF"}
                  />

                  <Text style={styles.itemName}>{item.name}</Text>
                </TouchableOpacity>

                <Text style={styles.requestedQuantity}>
                  Solicitado: {item.requestedQuantity}
                </Text>
              </View>

              {item.selected && (
                <View style={styles.quantityContainer}>
                  <Text style={styles.inputLabel}>Quantidade que irá doar</Text>

                  <TextInput
                    style={styles.quantityInput}
                    placeholder="Ex.: 2"
                    keyboardType="numeric"
                    value={item.donationQuantity}
                    onChangeText={(value) =>
                      handleQuantityChange(item.id, value)
                    }
                  />
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Descrição */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Descrição (opcional)</Text>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Adicione informações sobre sua doação..."
          placeholderTextColor="#AAB8AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
          maxLength={500}
        />

        <Text style={styles.characterCount}>{description.length}/500</Text>
      </View>

      {/* Botão */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.85}
      >
        <Ionicons name="heart-outline" size={20} color="#FFFFFF" />

        <Text style={styles.submitButtonText}>Registrar doação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#173D2E",
  },
  subtitle: {
    fontSize: 13,
    color: "#718078",
    marginTop: 4,
  },
  section: {
    marginBottom: 27,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 7,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#718078",
    marginBottom: 13,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EDE8",
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  selectedCard: {
    borderColor: "#16A36A",
    backgroundColor: "#F0FAF4",
  },
  requestIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestUser: {
    fontSize: 15,
    fontWeight: "700",
    color: "#173D2E",
  },
  requestCategory: {
    fontSize: 13,
    color: "#16A36A",
    marginTop: 3,
  },
  requestInstitution: {
    fontSize: 12,
    color: "#718078",
    marginTop: 3,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EDE8",
    borderRadius: 12,
    padding: 14,
  },
  selectedType: {
    backgroundColor: "#E5F5EC",
    borderColor: "#16A36A",
  },
  typeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#718078",
  },
  selectedTypeText: {
    color: "#16A36A",
  },
  institutionContainer: {
    marginTop: 17,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#173D2E",
    marginBottom: 8,
  },
  institutionOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EDE8",
    borderRadius: 11,
    marginBottom: 8,
  },
  institutionText: {
    fontSize: 14,
    color: "#173D2E",
  },
  independentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#E5F5EC",
    borderRadius: 12,
    padding: 13,
    marginTop: 13,
  },
  independentInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#173D2E",
    lineHeight: 18,
  },
  emptyItems: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5EDE8",
    padding: 25,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: "#718078",
    textAlign: "center",
    lineHeight: 19,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EDE8",
    borderRadius: 13,
    padding: 14,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  itemSelection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#173D2E",
  },
  requestedQuantity: {
    fontSize: 11,
    color: "#718078",
  },
  quantityContainer: {
    marginTop: 15,
  },
  quantityInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#173D2E",
  },
  descriptionInput: {
    minHeight: 110,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    color: "#173D2E",
  },
  characterCount: {
    fontSize: 11,
    color: "#AAB8AF",
    textAlign: "right",
    marginTop: 5,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#16A36A",
    borderRadius: 13,
    padding: 16,
    marginTop: 5,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
