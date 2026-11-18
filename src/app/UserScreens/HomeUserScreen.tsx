import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import { clearSession } from "../../api/api";
import { useCollectionPoints } from "../../hooks/useCollectionPoints";
import { useCommunityDonations } from "../../hooks/useDonation";

const initialRegion: Region = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

type InstitutionMarker = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type HelpRequestMarker = {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
};

export default function HomeScreen() {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  const [institutionMarkers, setInstitutionMarkers] = useState<
    InstitutionMarker[]
  >([]);

  const [helpRequestMarkers, setHelpRequestMarkers] = useState<
    HelpRequestMarker[]
  >([]);

  const [searchMarker, setSearchMarker] = useState<{
    latitude: number;
    longitude: number;
    title: string;
  } | null>(null);

  // Busca os pontos de coleta cadastrados no backend
  const {
    data: collectionPoints,
    isLoading: loadingPoints,
    isError: errorPoints,
  } = useCollectionPoints();

  // Busca os pedidos de ajuda da comunidade
  const {
    data: donations,
    isLoading: loadingDonations,
    isError: errorDonations,
  } = useCommunityDonations();

  // Obtém a localização atual do usuário
  useEffect(() => {
    getUserLocation();
  }, []);

  // Converte os endereços das instituições em coordenadas
  useEffect(() => {
    let cancelled = false;

    async function loadInstitutionMarkers() {
      if (!collectionPoints?.content) {
        setInstitutionMarkers([]);
        return;
      }

      const markers: InstitutionMarker[] = [];

      for (const point of collectionPoints.content) {
        if (point.active !== true || !point.address?.trim()) {
          continue;
        }

        const address = [point.address, point.neighborhood, "Brasil"]
          .filter(Boolean)
          .join(", ");

        try {
          const results = await Location.geocodeAsync(address);

          if (results.length > 0) {
            markers.push({
              id: point.id,
              name: point.name,
              address,
              latitude: results[0].latitude,
              longitude: results[0].longitude,
            });
          }
        } catch (error) {
          console.log(
            `Não foi possível localizar a instituição ${point.name}:`,
            error,
          );
        }
      }

      if (!cancelled) {
        setInstitutionMarkers(markers);
      }
    }

    loadInstitutionMarkers();

    return () => {
      cancelled = true;
    };
  }, [collectionPoints]);

  // Converte os endereços dos pedidos em coordenadas
  useEffect(() => {
    let cancelled = false;

    async function loadHelpRequestMarkers() {
      console.log("========== PEDIDOS DO MAPA ==========");

      console.log(
        "Quantidade de pedidos recebidos:",
        donations?.content?.length ?? 0,
      );

      if (!donations?.content) {
        setHelpRequestMarkers([]);
        return;
      }

      const markers: HelpRequestMarker[] = [];

      for (const donation of donations.content) {
        console.log("Pedido:", donation.id);
        console.log("Título:", donation.title);
        console.log("Endereço recebido:", donation.citizenAddress);

        const address = donation.citizenAddress?.trim();

        if (!address) {
          console.log("Pedido ignorado: endereço vazio.");
          continue;
        }

        try {
          const results = await Location.geocodeAsync(`${address}, Brasil`);

          console.log("Resultado da geocodificação:", results);

          if (results.length > 0) {
            markers.push({
              id: donation.id,
              title: donation.title,
              description: donation.description,
              latitude: results[0].latitude,
              longitude: results[0].longitude,
            });

            console.log("Marcador criado para o pedido:", donation.id);
          } else {
            console.log("Endereço não localizado:", address);
          }
        } catch (error) {
          console.log(`Erro ao localizar pedido ${donation.id}:`, error);
        }
      }

      if (!cancelled) {
        console.log("Total de marcadores criados:", markers.length);
        setHelpRequestMarkers(markers);
      }
    }

    loadHelpRequestMarkers();

    return () => {
      cancelled = true;
    };
  }, [donations]);

  async function handleSearch() {
    const value = searchText.trim();

    if (!value) {
      Alert.alert("Pesquisa", "Digite um endereço, CEP ou coordenadas.");
      return;
    }

    setSearching(true);

    try {
      let latitude: number;
      let longitude: number;
      let markerTitle = value;

      // Pesquisa por latitude e longitude
      const coordinatesMatch = value.match(
        /^\s*(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)\s*$/,
      );

      if (coordinatesMatch) {
        latitude = Number(coordinatesMatch[1]);
        longitude = Number(coordinatesMatch[2]);

        if (
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          throw new Error("Coordenadas inválidas.");
        }

        markerTitle = "Localização pesquisada";
      } else {
        let address = value;

        // Pesquisa por CEP
        const cep = value.replace(/\D/g, "");

        if (/^\d{8}$/.test(cep)) {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

          if (!response.ok) {
            throw new Error("Não foi possível consultar o CEP.");
          }

          const data = await response.json();

          if (data.erro) {
            throw new Error("CEP não encontrado.");
          }

          address = [
            data.logradouro,
            data.bairro,
            data.localidade,
            data.uf,
            "Brasil",
          ]
            .filter(Boolean)
            .join(", ");

          markerTitle = address || `CEP ${cep}`;
        }

        // Converte endereço em coordenadas
        const results = await Location.geocodeAsync(address);

        if (results.length === 0) {
          throw new Error("Não encontramos esse endereço.");
        }

        latitude = results[0].latitude;
        longitude = results[0].longitude;
      }

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      });

      setSearchMarker({
        latitude,
        longitude,
        title: markerTitle,
      });
    } catch (error) {
      Alert.alert(
        "Não foi possível localizar",
        error instanceof Error
          ? error.message
          : "Ocorreu um erro durante a pesquisa.",
      );
    } finally {
      setSearching(false);
    }
  }

  async function getUserLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasLocationPermission(false);
        return;
      }

      setHasLocationPermission(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      });
    } catch (error) {
      Alert.alert(
        "Localização",
        "Não foi possível obter sua localização. O mapa continuará exibindo a região inicial.",
      );
    } finally {
      setLoadingLocation(false);
    }
  }

  function handleDonate() {
    router.push("/OrgScreens/FindRequests");
  }

  function handleRequestHelp() {
    router.push("/UserScreens/RequestHelpScreen");
  }

  async function handleLogout() {
    try {
      await clearSession();
      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  const loadingMapData = loadingPoints || loadingDonations;

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá!</Text>
          <Text style={styles.subtitle}>Como podemos ajudar hoje?</Text>
        </View>

        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={25} color="#16A36A" />
        </View>
      </View>

      {/* Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={21} color="#718078" />

        <TextInput
          style={styles.searchInput}
          placeholder="Endereço, CEP ou latitude, longitude"
          placeholderTextColor="#9CA9A1"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={searching}
        >
          {searching ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={hasLocationPermission}
          showsMyLocationButton={hasLocationPermission}
          showsCompass
          loadingEnabled
        >
          {/* Instituições */}
          {institutionMarkers.map((institution) => (
            <Marker
              key={`institution-${institution.id}`}
              coordinate={{
                latitude: institution.latitude,
                longitude: institution.longitude,
              }}
              title={institution.name}
              description={institution.address}
              pinColor="#16A36A"
            />
          ))}

          {/* Pedidos de ajuda */}
          {helpRequestMarkers.map((request) => (
            <Marker
              key={`request-${request.id}`}
              coordinate={{
                latitude: request.latitude,
                longitude: request.longitude,
              }}
              title={request.title}
              description={request.description}
              pinColor="#F59E0B"
            />
          ))}

          {/* Local pesquisado */}
          {searchMarker && (
            <Marker
              coordinate={{
                latitude: searchMarker.latitude,
                longitude: searchMarker.longitude,
              }}
              title={searchMarker.title}
              description="Local encontrado na pesquisa"
              pinColor="#2563EB"
            />
          )}
        </MapView>

        {/* Carregamento */}
        {(loadingLocation || loadingMapData) && (
          <View style={styles.locationLoading}>
            <ActivityIndicator size="small" color="#16A36A" />
            <Text style={styles.loadingText}>
              {loadingLocation
                ? "Localizando você..."
                : "Carregando dados do mapa..."}
            </Text>
          </View>
        )}

        {/* Legenda */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.institutionDot]} />
            <Text style={styles.legendText}>Instituições</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.requestDot]} />
            <Text style={styles.legendText}>Pedidos de ajuda</Text>
          </View>
        </View>
      </View>

      {/* Avisos de carregamento e erro */}
      {errorPoints && (
        <Text style={styles.errorText}>
          Não foi possível carregar as instituições.
        </Text>
      )}

      {errorDonations && (
        <Text style={styles.errorText}>
          Não foi possível carregar os pedidos de ajuda.
        </Text>
      )}

      {/* Ações principais */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>
          Faça parte dessa corrente do bem
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.donateButton}
            onPress={handleDonate}
            activeOpacity={0.8}
          >
            <Ionicons name="gift-outline" size={25} color="#FFFFFF" />
            <Text style={styles.buttonText}>Fazer doação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleRequestHelp}
            activeOpacity={0.8}
          >
            <Ionicons name="hand-left-outline" size={25} color="#16A36A" />
            <Text style={styles.helpButtonText}>Solicitar ajuda</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => router.push("/UserScreens/UserRequests")}
        >
          <Ionicons name="clipboard-outline" size={21} color="#16A36A" />

          <Text style={styles.trackButtonText}>Acompanhar meus pedidos</Text>

          <Ionicons name="chevron-forward" size={19} color="#16A36A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Ionicons name="log-out-outline" size={21} color="#DC2626" />
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 25,
    fontWeight: "800",
    color: "#173D2E",
  },
  subtitle: {
    fontSize: 14,
    color: "#718078",
    marginTop: 4,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E5F5EC",
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: "hidden",
    minHeight: 250,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationLoading: {
    position: "absolute",
    top: 15,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    elevation: 3,
  },
  loadingText: {
    fontSize: 12,
    color: "#52645A",
  },
  legend: {
    position: "absolute",
    bottom: 14,
    left: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    gap: 9,
    elevation: 3,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  institutionDot: {
    backgroundColor: "#16A36A",
  },
  requestDot: {
    backgroundColor: "#F59E0B",
  },
  legendText: {
    color: "#52645A",
    fontSize: 11,
    fontWeight: "600",
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#173D2E",
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  donateButton: {
    flex: 1,
    backgroundColor: "#16A36A",
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  helpButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#16A36A",
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  helpButtonText: {
    color: "#16A36A",
    fontSize: 13,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 14,
    paddingLeft: 15,
    paddingRight: 6,
    height: 54,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5EDE8",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#173D2E",
    height: "100%",
  },
  searchButton: {
    width: 42,
    height: 42,
    backgroundColor: "#16A36A",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#E5F5EC",
    borderRadius: 15,
    padding: 16,
    marginTop: 12,
  },
  trackButtonText: {
    color: "#16A36A",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FEE2E2",
    padding: 15,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});
