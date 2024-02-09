import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import useLocation from './hooks/useLocation';
import { obtenerDatosUbicacion } from './geoubicacion';

export default function App() {
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const { location, errorMsg } = useLocation();
  const [pais, setPais] = useState('');
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [calle, setCalle] = useState('');

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Loading...</Text>;
  }

  if (location && !markerCoordinates) {
    setMarkerCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  if (!markerCoordinates) {
    return <Text>Cargando...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0092,
          longitudeDelta: 0.0001,
        }}
      >
        <Marker
          draggable
          onDragEnd={(e) => {
            setMarkerCoordinates(e.nativeEvent.coordinate);
          }}
          coordinate={markerCoordinates}
          title="Evento de prueba"
          description="este evento es para..."
        />
      </MapView>
      <View style={styles.contenedorLatitudLongitud}>
        <Text>Latitud: {markerCoordinates.latitude}</Text>
        <Text>Longitud: {markerCoordinates.longitude} </Text>
      </View>
      <TouchableOpacity
        onPress={async () => {
          const datos = await obtenerDatosUbicacion(
            markerCoordinates.latitude,
            markerCoordinates.longitude
          );

          const datosRelevantes = datos.features[0].properties;
          console.log(datosRelevantes);
          setPais(datosRelevantes.country);
          setEstado(datosRelevantes.state);
          setCiudad(datosRelevantes.city);
          setCalle(datosRelevantes.address_line1);
        }}
        style={styles.boton}
      >
        <Text style={styles.botonTexto}>Obtener datos de ubicacion</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.textoNegritas}>Pais: {pais}</Text>
        <Text style={styles.textoNegritas}>Estado: {estado}</Text>
        <Text style={styles.textoNegritas}>Ciudad: {ciudad}</Text>
        <Text style={styles.textoNegritas}>Calle: {calle}</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  contenedorLatitudLongitud: {
    padding: 18,
  },
  boton: {
    backgroundColor: '#22d3ee',
    padding: 16,
    borderRadius: 8,
  },
  botonTexto: {
    textAlign: 'center',
  },
  textoNegritas: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
