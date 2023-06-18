import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import UserService from '../data/UserService';
import { auth } from '../firebase';

const MyReservationsScreen = () => {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Fetch reservations data from the database
        const reservationsData = await UserService.getReservationsForUser(auth.currentUser.uid);
        setReservas(reservationsData);
      } catch (error) {
        console.log('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {reservas.map((reserva) => (
          <View key={reserva.id} style={styles.reservaContainer}>
            <Text style={styles.peluqueria}>{reserva.peluqueria.name}</Text>
            <Text style={styles.infoText}>Dirección: {reserva.peluqueria.direccion}</Text>
            <Text style={styles.infoText}>Teléfono: {reserva.phone}</Text>
            <Text style={styles.infoText}>Fecha: {reserva.fecha}</Text>
            <Text style={styles.infoText}>Hora: {reserva.hora}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('HomeScreen')}>
          <FontAwesome name="scissors" size={24} color="black" />
          <Text style={styles.bottomBarText}>Peluquerías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('MyReservationsScreen')}>
          <FontAwesome name="calendar" size={24} color="black" />
          <Text style={styles.bottomBarText}>Mis Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('ProfileScreen')}>
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
    backgroundColor: '#f08080',
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: '10%',
    justifyContent: 'top-center',
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
    paddingVertical: "4.5%",
  },
  bottomBarButton: {
    alignItems: 'center',
    flex: 1, 
  },
  bottomBarText: {
    fontSize: 12,
    marginTop: 5,
  },
});


export default MyReservationsScreen;
