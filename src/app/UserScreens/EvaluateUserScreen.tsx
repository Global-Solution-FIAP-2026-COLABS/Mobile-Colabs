
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function EvaluateScreen() {
  const { requestId, institution, category } =
    useLocalSearchParams<{
      requestId: string;
      institution: string;
      category: string;
    }>();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function handleSubmit() {
    if (rating === 0) {
      Alert.alert("Avaliação", "Selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    const evaluationData = {
      requestId,
      rating,
      comment: comment.trim(),
    };

    // Temporário: futuramente enviar para a API.
    console.log("Avaliação:", evaluationData);

    Alert.alert(
      "Avaliação registrada!",
      "Obrigado por compartilhar sua experiência. Sua opinião é importante para melhorar os atendimentos.",
      [
        {
          text: "Voltar aos meus pedidos",
          onPress: () => router.back(),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/UserScreens/RequestHelpScreen");
              }
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#173D2E" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Avaliar atendimento</Text>
            <Text style={styles.headerSubtitle}>
              Compartilhe sua experiência
            </Text>
          </View>
        </View>

        {/* Ícone de avaliação */}
        <View style={styles.mainIconContainer}>
          <View style={styles.mainIcon}>
            <Ionicons
              name="heart-circle-outline"
              size={55}
              color="#16A36A"
            />
          </View>

          <Text style={styles.mainTitle}>
            Como foi seu atendimento?
          </Text>

          <Text style={styles.mainDescription}>
            Sua avaliação ajuda outras pessoas e contribui para
            melhorar os serviços das instituições.
          </Text>
        </View>

        {/* Informações do pedido */}
        <View style={styles.requestCard}>
          <View style={styles.requestRow}>
            <Ionicons
              name="clipboard-outline"
              size={20}
              color="#16A36A"
            />

            <View style={styles.requestInfo}>
              <Text style={styles.label}>Pedido</Text>
              <Text style={styles.value}>#{requestId || "Não informado"}</Text>
            </View>
          </View>

          <View style={styles.requestDivider} />

          <View style={styles.requestRow}>
            <Ionicons
              name="business-outline"
              size={20}
              color="#16A36A"
            />

            <View style={styles.requestInfo}>
              <Text style={styles.label}>Instituição</Text>
              <Text style={styles.value}>
                {institution || "Instituição não informada"}
              </Text>
            </View>
          </View>

          <View style={styles.requestDivider} />

          <View style={styles.requestRow}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color="#16A36A"
            />

            <View style={styles.requestInfo}>
              <Text style={styles.label}>Categoria</Text>
              <Text style={styles.value}>
                {category || "Não informada"}
              </Text>
            </View>
          </View>
        </View>

        {/* Nota */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Qual nota você daria?
          </Text>

          <Text style={styles.helperText}>
            Selecione de 1 a 5 estrelas.
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={rating >= star ? "star" : "star-outline"}
                  size={39}
                  color={rating >= star ? "#F5B942" : "#C9D2CC"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingText}>
            {rating === 0
              ? "Nenhuma nota selecionada"
              : `${rating} de 5 estrelas`}
          </Text>
        </View>

        {/* Comentário */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Conte como foi sua experiência
          </Text>

          <Text style={styles.helperText}>
            Deixe um comentário sobre o atendimento recebido.
          </Text>

          <TextInput
            style={styles.commentInput}
            placeholder="Escreva seu comentário aqui..."
            placeholderTextColor="#9CA9A1"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
            maxLength={500}
          />

          <Text style={styles.characterCount}>
            {comment.length}/500
          </Text>
        </View>

        {/* Enviar avaliação */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Ionicons name="star-outline" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            Enviar avaliação
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Sua opinião é importante para a comunidade Conecta+.
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
    marginBottom: 28,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#E5F5EC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#173D2E",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#718078",
    marginTop: 3,
  },
  mainIconContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  mainIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },
  mainTitle: {
    color: "#173D2E",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  mainDescription: {
    color: "#718078",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5EDE8",
    marginBottom: 27,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7,
  },
  requestInfo: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: "#89958D",
    marginBottom: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#173D2E",
  },
  requestDivider: {
    height: 1,
    backgroundColor: "#EDF1EE",
    marginVertical: 8,
  },
  section: {
    marginBottom: 27,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#173D2E",
  },
  helperText: {
    fontSize: 12,
    color: "#89958D",
    marginTop: 6,
    marginBottom: 15,
    lineHeight: 18,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 13,
    marginTop: 8,
  },
  ratingText: {
    textAlign: "center",
    color: "#B7791F",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 12,
  },
  commentInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE8E2",
    borderRadius: 14,
    padding: 15,
    height: 135,
    fontSize: 13,
    color: "#173D2E",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 11,
    color: "#9CA9A1",
    marginTop: 6,
  },
  submitButton: {
    height: 55,
    backgroundColor: "#16A36A",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
