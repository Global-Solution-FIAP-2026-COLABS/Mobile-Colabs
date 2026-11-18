
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useCreateDonation } from "../../hooks/useDonation";
import { getCitizenId, ApiError } from "../../api/api";

import type { DonationCategory } from "../../types/donationTypes";

type HelpItem = {
  id: number;
  name: string;
  quantity: string;
  category: DonationCategory | "";
};

type FormData = {
  title: string;
  description: string;
};

const categories: {
  label: string;
  value: DonationCategory;
}[] = [
  { label: "Alimentos", value: "FOOD" },
  { label: "Roupas", value: "CLOTHING" },
  { label: "Higiene", value: "HYGIENE" },
  { label: "Medicamentos", value: "MEDICINE" },
  { label: "Móveis", value: "FURNITURE" },
  { label: "Outros", value: "OTHER" },
];

export default function RequestHelpScreen() {
  const createDonation = useCreateDonation();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });

  const [items, setItems] = useState<HelpItem[]>([
    { id: 1, name: "", quantity: "1", category: "" },
  ]);

  function updateFormData(field: keyof FormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateItem(
    id: number,
    field: keyof Omit<HelpItem, "id">,
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        quantity: "1",
        category: "",
      },
    ]);
  }

  function removeItem(id: number) {
    if (items.length === 1) {
      Alert.alert("Atenção", "O pedido precisa ter pelo menos um item.");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSubmit() {
    if (formData.title.trim().length < 3) {
      Alert.alert("Atenção", "O título deve ter pelo menos 3 caracteres.");
      return;
    }

    if (
      formData.description.trim().length < 10 ||
      formData.description.trim().length > 500
    ) {
      Alert.alert(
        "Atenção",
        "A descrição deve ter entre 10 e 500 caracteres.",
      );
      return;
    }

    const invalidItem = items.some(
      (item) =>
        item.name.trim().length < 2 ||
        item.name.trim().length > 120 ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !item.category,
    );

    if (invalidItem) {
      Alert.alert(
        "Atenção",
        "Preencha todos os itens com nome, quantidade e categoria válidos.",
      );
      return;
    }

    try {
      const citizenId = await getCitizenId();

      if (citizenId === null || !Number.isInteger(citizenId)) {
        Alert.alert(
          "Sessão inválida",
          "Não foi possível identificar seu cadastro. Entre novamente.",
        );
        return;
      }

      const requestData = {
        type: "HELP_REQUEST" as const,
        title: formData.title.trim(),
        description: formData.description.trim(),
        citizenId,
        collectionPointId: null,
        items: items.map((item) => ({
          name: item.name.trim(),
          quantity: Number(item.quantity),
          category: item.category as DonationCategory,
        })),
      };

      console.log("Enviando pedido de ajuda:", requestData);

      const response = await createDonation.mutateAsync(requestData);

      Alert.alert(
        "Pedido enviado!",
        `Seu pedido "${response.title}" foi cadastrado com sucesso.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao cadastrar pedido:", error);

      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível enviar seu pedido. Tente novamente.";

      Alert.alert("Erro ao enviar pedido", message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Solicitar ajuda</Text>
            <Text style={styles.headerSubtitle}>
              Conte o que você está precisando
            </Text>
          </View>
        </View>

        {/* Informações iniciais */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="heart-outline" size={24} color="#16A36A" />
          </View>

          <Text style={styles.infoText}>
            Preencha as informações abaixo para que as instituições possam
            conhecer sua necessidade e oferecer ajuda.
          </Text>
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Título do pedido <Text style={styles.required}>*</Text>
          </Text>

          <Text style={styles.helperText}>
            Resuma o que você está precisando.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Apoio alimentar para minha família"
            placeholderTextColor="#9CA9A1"
            value={formData.title}
            onChangeText={(value) => updateFormData("title", value)}
            maxLength={120}
          />

          <Text style={styles.characterCount}>
            {formData.title.length}/120
          </Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Descrição da necessidade <Text style={styles.required}>*</Text>
          </Text>

          <Text style={styles.helperText}>
            Explique um pouco mais sobre sua situação.
          </Text>

          <TextInput
            style={styles.descriptionInput}
            placeholder="Descreva por que você precisa dessa ajuda..."
            placeholderTextColor="#9CA9A1"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(value) => updateFormData("description", value)}
            maxLength={500}
          />

          <Text style={styles.characterCount}>
            {formData.description.length}/500
          </Text>
        </View>

        {/* Itens necessários */}
        <View style={styles.section}>
          <View style={styles.itemHeader}>
            <View style={styles.itemHeaderText}>
              <Text style={styles.sectionTitle}>
                Itens necessários <Text style={styles.required}>*</Text>
              </Text>

              <Text style={styles.helperText}>
                Informe o nome, a quantidade e a categoria de cada item.
              </Text>
            </View>

            <View style={styles.itemCount}>
              <Text style={styles.itemCountText}>{items.length}</Text>
            </View>
          </View>

          {items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemCardHeader}>
                <Text style={styles.itemNumber}>ITEM {index + 1}</Text>

                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC5555" />
                  <Text style={styles.removeText}>Remover</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Nome do item *</Text>

              <TextInput
                style={styles.input}
                placeholder="Ex: Arroz 5kg"
                placeholderTextColor="#9CA9A1"
                value={item.name}
                onChangeText={(value) =>
                  updateItem(item.id, "name", value)
                }
                maxLength={120}
              />

              <Text style={styles.inputLabel}>Quantidade *</Text>

              <TextInput
                style={styles.input}
                placeholder="Ex: 2"
                placeholderTextColor="#9CA9A1"
                keyboardType="number-pad"
                value={item.quantity}
                onChangeText={(value) =>
                  updateItem(
                    item.id,
                    "quantity",
                    value.replace(/\D/g, ""),
                  )
                }
              />

              <Text style={styles.inputLabel}>Categoria do item *</Text>

              <View style={styles.categoryContainer}>
                {categories.map((category) => {
                  const selected = item.category === category.value;

                  return (
                    <TouchableOpacity
                      key={category.value}
                      style={[
                        styles.categoryButton,
                        selected && styles.categorySelected,
                      ]}
                      onPress={() =>
                        updateItem(item.id, "category", category.value)
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selected && styles.categoryTextSelected,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addItemButton}
            onPress={addItem}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={21} color="#16A36A" />
            <Text style={styles.addItemText}>Adicionar outro item</Text>
          </TouchableOpacity>
        </View>

        {/* Envio */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            createDonation.isPending && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          disabled={createDonation.isPending}
          activeOpacity={0.85}
        >
          {createDonation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="send-outline" size={19} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                Enviar pedido de ajuda
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Os campos marcados com * são obrigatórios.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 22,
    gap: 14,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E5F5EC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
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
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5F5EC",
    padding: 15,
    borderRadius: 16,
    marginBottom: 27,
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    color: "#426653",
    fontSize: 12,
    lineHeight: 19,
  },
  section: {
    marginBottom: 27,
  },
  sectionTitle: {
    color: "#173D2E",
    fontSize: 16,
    fontWeight: "700",
  },
  required: {
    color: "#DC5555",
  },
  helperText: {
    fontSize: 12,
    color: "#89958D",
    marginTop: 5,
    marginBottom: 14,
    lineHeight: 18,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFE8E2",
    backgroundColor: "#FFFFFF",
  },
  categorySelected: {
    backgroundColor: "#E5F5EC",
    borderColor: "#16A36A",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#718078",
  },
  categoryTextSelected: {
    color: "#16A36A",
  },
  descriptionInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 14,
    padding: 15,
    height: 125,
    fontSize: 13,
    color: "#173D2E",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 11,
    color: "#9CA9A1",
    marginTop: 6,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemHeaderText: {
    flex: 1,
  },
  itemCount: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  itemCountText: {
    color: "#16A36A",
    fontWeight: "700",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  itemCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  itemNumber: {
    color: "#16A36A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  removeText: {
    color: "#DC5555",
    fontSize: 11,
    fontWeight: "600",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#52645A",
    marginBottom: 7,
    marginTop: 5,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 13,
    color: "#173D2E",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  addItemButton: {
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#16A36A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addItemText: {
    color: "#16A36A",
    fontSize: 13,
    fontWeight: "700",
  },
  submitButton: {
    height: 55,
    backgroundColor: "#16A36A",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  footerText: {
    color: "#9CA9A1",
    fontSize: 11,
    textAlign: "center",
    marginTop: 15,
  },
});
