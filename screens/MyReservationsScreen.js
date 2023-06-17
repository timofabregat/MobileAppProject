import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, NavigationContainer } from '@react-navigation/native';



const MyReservationsScreen = () => {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    // Aquí acceder a la base de datos para obtener las reservas
    // y luego actualizar el estado "reservas" con los datos obtenidos

    // Ejemplo de datos de reserva
    const datosReservas = [
      {
        id: 1,
        peluqueria: 'Peluquería ABC',
        direccion: 'Calle Principal 123',
        telefono: '123-456-7890',
        fecha: '2023-06-15',
        hora: '10:00 AM',
      },
      {
        id: 2,
        peluqueria: 'Peluquería XYZ',
        direccion: 'Avenida Central 456',
        telefono: '987-654-3210',
        fecha: '2023-06-16',
        hora: '02:30 PM',
      },
    ];

    setReservas(datosReservas);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Mis Reservas</Text>
        {reservas.map((reserva) => (
          <View key={reserva.id} style={styles.reservaContainer}>
            <Text style={styles.peluqueria}>{reserva.peluqueria}</Text>
            <Text style={styles.infoText}>Dirección: {reserva.direccion}</Text>
            <Text style={styles.infoText}>Teléfono: {reserva.telefono}</Text>
            <Text style={styles.infoText}>Fecha: {reserva.fecha}</Text>
            <Text style={styles.infoText}>Hora: {reserva.hora}</Text>
          </View>
        ))}
      </View>
      {/* Barra inferior fija */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} 
        onPress={() => navigation.navigate('HomeScreen')}>
          <FontAwesome name="scissors" size={24} color="black" />
          <Text style={styles.bottomBarText}>Peluquerías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} 
        onPress={() => navigation.navigate('MyReservationsScreen')}>
          <FontAwesome name="calendar" size={24} color="black" />
          <Text style={styles.bottomBarText}>Mis Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton}
        onPress={() => navigation.navigate('ProfileScreen')}>
          <FontAwesome name="user" size={24} color="black" />
          <Text style={styles.bottomBarText}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f08080',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reservaContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    backgroundColor: '#020202',
  },
  peluqueria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white'
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white'
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingVertical: 10,
  },
  bottomBarButton: {
    alignItems: 'center',
  },
  bottomBarText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default MyReservationsScreen;
