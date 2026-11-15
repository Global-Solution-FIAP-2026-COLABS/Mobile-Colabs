import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";

import MapView, { Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

// Coordenadas fictícias da instituição
const institutionLocation = {
  latitude: -23.5505,
  longitude: -46.6333,
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type DonationItem = {
  name: string;
  quantity: number;
};

type Delivery = {
  id: number;
  requester: string;
  category: string;
  address: string;
  phone: string;
  description: string;
  destination: Coordinates;
  items: DonationItem[];
};

// Calcula o tempo estimado pela distância em linha reta
function calculateEstimatedTime(
  origin: Coordinates,
  destination: Coordinates,
): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const earthRadius = 6371;

  const latitudeDifference = toRadians(destination.latitude - origin.latitude);

  const longitudeDifference = toRadians(
    destination.longitude - origin.longitude,
  );

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(origin.latitude)) *
      Math.cos(toRadians(destination.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const distance = earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Estimativa considerando desvios das ruas
  const estimatedRoadDistance = distance * 1.3;

  // Velocidade média urbana hipotética
  const averageSpeed = 25;

  return Math.max(1, Math.ceil((estimatedRoadDistance / averageSpeed) * 60));
}

export default function DeliverDonation() {
  const params = useLocalSearchParams<{
    requestId: string;
    user: string;
    category: string;
    institution: string;
    donorType: string;
    items: string;
    description: string;
  }>();

  const [selectedDelivery] = useState<Delivery | null>(() => {
    try {
      const donationItems: DonationItem[] = JSON.parse(params.items || "[]");

      return {
        id: Number(params.requestId),
        requester: params.user || "Solicitante",
        category: params.category || "Não informada",
        address: "Endereço do solicitante não informado",
        phone: "Telefone não informado",
        description: params.description || "",
        destination: {
          latitude: -23.558,
          longitude: -46.64,
        },
        items: donationItems.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity),
        })),
      };
    } catch {
      return null;
    }
  });

  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: institutionLocation.latitude,
    longitude: institutionLocation.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/OrgScreens/HomeInstitutuion" as any);
    }
  }

  function openGoogleMaps() {
    if (!selectedDelivery) return;

    const { latitude, longitude } = selectedDelivery.destination;

    const url =
      "https://www.google.com/maps/dir/?api=1" +
      `&origin=${institutionLocation.latitude},${institutionLocation.longitude}` +
      `&destination=${latitude},${longitude}` +
      "&travelmode=driving";

    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o aplicativo de navegação.");
    });
  }

  // Verifica se os dados da doação foram recebidos
  if (!selectedDelivery) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#E58A35" />

          <Text style={styles.headerTitle}>
            Não foi possível carregar os dados da doação.
          </Text>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleBack}
          >
            <Text style={styles.navigationButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const estimatedTime = calculateEstimatedTime(
    institutionLocation,
    selectedDelivery.destination,
  );

  function handleCompleteDelivery() {
    if (!selectedDelivery) return;

    router.replace({
      pathname: "/OrgScreens/DonationHistory",
      params: {
        requestId: String(selectedDelivery.id),
        user: selectedDelivery.requester,
        category: selectedDelivery.category,
        address: selectedDelivery.address,
        phone: selectedDelivery.phone,
        description: selectedDelivery.description,
        items: JSON.stringify(selectedDelivery.items),
        status: "Concluída",
        completedAt: new Date().toISOString(),
      },
    } as any);
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={23} color="#173D2E" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Entregar doação</Text>

          <Text style={styles.headerSubtitle}>Informações da entrega</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dados do solicitante */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={23} color="#16A36A" />

            <Text style={styles.sectionTitle}>Dados do solicitante</Text>
          </View>

          <Text style={styles.requesterName}>{selectedDelivery.requester}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#718078" />

            <Text style={styles.detailText}>{selectedDelivery.address}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={18} color="#718078" />

            <Text style={styles.detailText}>{selectedDelivery.phone}</Text>
          </View>
        </View>

        {/* Itens da doação */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="gift-outline" size={23} color="#16A36A" />

            <Text style={styles.sectionTitle}>Itens para entrega</Text>
          </View>

          {selectedDelivery.items.length > 0 ? (
            selectedDelivery.items.map((item, index) => (
              <View key={`${item.name}-${index}`} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>

                <Text style={styles.itemQuantity}>
                  {item.quantity} unidade(s)
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.detailText}>Nenhum item informado.</Text>
          )}

          {!!selectedDelivery.description && (
            <Text style={styles.description}>
              {selectedDelivery.description}
            </Text>
          )}
        </View>

        {/* Mapa */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="map-outline" size={23} color="#16A36A" />

            <Text style={styles.sectionTitle}>Localização da entrega</Text>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={initialRegion}
            >
              <Marker
                coordinate={institutionLocation}
                title="Instituição"
                description="Local de saída"
                pinColor="#16A36A"
              />

              <Marker
                coordinate={selectedDelivery.destination}
                title={selectedDelivery.requester}
                description="Endereço de entrega"
                pinColor="#E58A35"
              />
            </MapView>
          </View>

          {/* Legenda */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.originDot} />

              <Text style={styles.legendText}>Instituição</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.destinationDot} />

              <Text style={styles.legendText}>Solicitante</Text>
            </View>
          </View>

          {/* Tempo estimado */}
          <View style={styles.timeCard}>
            <Ionicons name="time-outline" size={29} color="#16A36A" />

            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>
                Tempo estimado de deslocamento
              </Text>

              <Text style={styles.timeValue}>
                Aproximadamente {estimatedTime} minutos
              </Text>
            </View>
          </View>

          <Text style={styles.estimateDisclaimer}>
            Estimativa baseada na distância geográfica. Não considera trânsito
            ou condições das vias.
          </Text>
        </View>

        {/* Navegação */}
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={openGoogleMaps}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate" size={21} color="#FFFFFF" />

          <Text style={styles.navigationButtonText}>Iniciar navegação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handleCompleteDelivery}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={21} color="#FFFFFF" />

          <Text style={styles.navigationButtonText}>Concluir entrega</Text>
        </TouchableOpacity>

        <Text style={styles.navigationHint}>
          O trajeto será aberto no Google Maps.
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    gap: 18,
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
    fontSize: 21,
    fontWeight: "700",
    color: "#173D2E",
    textAlign: "center",
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173D2E",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5EDE8",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 15,
  },
  requesterName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 9,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    color: "#52635A",
    lineHeight: 19,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1EE",
  },
  itemName: {
    fontSize: 14,
    color: "#52635A",
  },
  itemQuantity: {
    fontSize: 13,
    color: "#173D2E",
    fontWeight: "600",
  },
  description: {
    color: "#718078",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
  },
  mapContainer: {
    height: 260,
    borderRadius: 13,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  legend: {
    flexDirection: "row",
    gap: 20,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  legendText: {
    fontSize: 12,
    color: "#718078",
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A36A",
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E58A35",
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5F5EC",
    borderRadius: 12,
    padding: 14,
    marginTop: 17,
    gap: 12,
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    color: "#315D46",
    fontSize: 11,
  },
  timeValue: {
    color: "#173D2E",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  estimateDisclaimer: {
    color: "#718078",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
  navigationButton: {
    backgroundColor: "#16A36A",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10
  },
  navigationButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  navigationHint: {
    textAlign: "center",
    fontSize: 11,
    color: "#718078",
    marginTop: 10,
  },
});
