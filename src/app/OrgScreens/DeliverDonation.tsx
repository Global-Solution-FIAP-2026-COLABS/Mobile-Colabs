import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";

import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { getRole } from "../../api/api";

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
  institutionAddress: string;
  description: string;
  items: DonationItem[];
};

export default function DeliverDonation() {
  const params = useLocalSearchParams<{
    requestId: string;
    user: string;
    category: string;
    institution: string;
    donorType: string;
    items: string;
    description: string;
    citizenAddress: string;
    institutionAddress: string;
  }>();

  const [selectedDelivery] = useState<Delivery | null>(() => {
    try {
      const donationItems: DonationItem[] = JSON.parse(params.items || "[]");

      return {
        id: Number(params.requestId),
        requester: params.user || "Solicitante",
        category: params.category || "Não informada",
        address: params.citizenAddress || "",
        institutionAddress: params.institutionAddress || "",
        description: params.description || "",
        items: donationItems.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity),
        })),
      };
    } catch (error) {
      console.log("Erro ao interpretar os dados da doação:", error);
      return null;
    }
  });

  const mapRef = useRef<MapView>(null);

  const [citizenLocation, setCitizenLocation] = useState<Coordinates | null>(
    null,
  );

  const [institutionLocation, setInstitutionLocation] =
    useState<Coordinates | null>(null);

  const [loadingMap, setLoadingMap] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Localiza os endereços recebidos do backend.
  useEffect(() => {
    let cancelled = false;

    async function geocodeAddress(
      address: string,
    ): Promise<Coordinates | null> {
      if (!address.trim()) {
        return null;
      }

      try {
        const results = await Location.geocodeAsync(address);

        if (results.length === 0) {
          return null;
        }

        return {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
        };
      } catch (error) {
        console.log(`Erro ao localizar endereço "${address}":`, error);
        return null;
      }
    }

    async function loadLocations() {
      setLoadingMap(true);
      setCitizenLocation(null);
      setInstitutionLocation(null);

      if (!selectedDelivery) {
        setLoadingMap(false);
        return;
      }

      const [citizenCoordinates, institutionCoordinates] = await Promise.all([
        geocodeAddress(selectedDelivery.address),
        geocodeAddress(selectedDelivery.institutionAddress),
      ]);

      if (cancelled) return;

      setCitizenLocation(citizenCoordinates);
      setInstitutionLocation(institutionCoordinates);
      setLoadingMap(false);
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, [selectedDelivery]);

  // Ajusta o mapa para exibir os locais encontrados.
  const adjustMap = useCallback(() => {
    if (!mapReady) return;

    const coordinates = [institutionLocation, citizenLocation].filter(
      (location): location is Coordinates => location !== null,
    );

    if (coordinates.length === 2) {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 55,
          right: 55,
          bottom: 55,
          left: 55,
        },
        animated: true,
      });
    } else if (coordinates.length === 1) {
      mapRef.current?.animateToRegion(
        {
          ...coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800,
      );
    }
  }, [mapReady, institutionLocation, citizenLocation]);

  useEffect(() => {
    adjustMap();
  }, [adjustMap]);

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/OrgScreens/HomeInstitutuion" as any);
    }
  }

async function handleTrackDonations() {
  try {
    const role = await getRole();

    console.log("PERFIL LIDO DO STORAGE:", role);

    if (role === "ROLE_CITIZEN") {
      router.replace("/UserScreens/MyDonationsScreen");
      return;
    }

    if (role === "ROLE_POINT_MANAGER") {
      router.replace("/OrgScreens/DonationHistory");
      return;
    }

    if (role === "ROLE_ADMIN") {
      Alert.alert("Atenção", "O histórico do administrador ainda não está disponível.");
      return;
    }

    Alert.alert("Erro", "Não foi possível identificar seu perfil.");
  } catch (error) {
    console.log("ERRO AO BUSCAR PERFIL:", error);
    Alert.alert("Erro", "Não foi possível acessar seu histórico.");
  }
}

  // Abre o Google Maps com os endereços reais.
  function openGoogleMaps() {
    if (!selectedDelivery) return;

    if (!selectedDelivery.institutionAddress || !selectedDelivery.address) {
      Alert.alert(
        "Endereço não disponível",
        "Não foi possível encontrar o endereço da instituição ou do solicitante.",
      );
      return;
    }

    const origin = encodeURIComponent(selectedDelivery.institutionAddress);

    const destination = encodeURIComponent(selectedDelivery.address);

    const url =
      "https://www.google.com/maps/dir/?api=1" +
      `&origin=${origin}` +
      `&destination=${destination}` +
      "&travelmode=driving";

    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o aplicativo de navegação.");
    });
  }

  // Verifica se os dados da doação foram recebidos.
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

  const mapCenter = institutionLocation || citizenLocation;

  const initialRegion: Region | undefined = mapCenter
    ? {
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : undefined;

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

            <Text style={styles.detailText}>
              {selectedDelivery.address || "Endereço não informado"}
            </Text>
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
            {loadingMap ? (
              <View style={styles.mapMessage}>
                <ActivityIndicator size="large" color="#16A36A" />

                <Text style={styles.detailText}>
                  Localizando os endereços...
                </Text>
              </View>
            ) : mapCenter && initialRegion ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                onMapReady={() => setMapReady(true)}
              >
                {institutionLocation && (
                  <Marker
                    coordinate={institutionLocation}
                    title="Instituição"
                    description={selectedDelivery.institutionAddress}
                    pinColor="#16A36A"
                  />
                )}

                {citizenLocation && (
                  <Marker
                    coordinate={citizenLocation}
                    title={selectedDelivery.requester}
                    description={selectedDelivery.address}
                    pinColor="#E58A35"
                  />
                )}
              </MapView>
            ) : (
              <View style={styles.mapMessage}>
                <Ionicons name="location-outline" size={38} color="#718078" />

                <Text style={styles.mapMessageText}>
                  Não foi possível localizar os endereços. Confira se os
                  endereços estão completos no cadastro.
                </Text>
              </View>
            )}
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

          {!loadingMap &&
            (!institutionLocation || !citizenLocation) &&
            (institutionLocation || citizenLocation) && (
              <Text style={styles.mapMessageText}>
                Não foi possível localizar um dos endereços. Confira os dados do
                cadastro.
              </Text>
            )}
        </View>

        {/* Navegação */}
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handleTrackDonations}
          activeOpacity={0.85}
        >
          <Text style={styles.navigationButtonText}>
            Acompanhar minhas doações
          </Text>
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

  mapMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 20,
    backgroundColor: "#F0F5F1",
  },

  mapMessageText: {
    color: "#718078",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 12,
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

  navigationButton: {
    backgroundColor: "#16A36A",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
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
