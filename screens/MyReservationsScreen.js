import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import UserService from '../data/UserService';
import { auth } from '../firebase';
import AppLoader from './AppLoader';
import ReservaService from '../data/ReservaService';

const MyReservationsScreen = () => {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState([]);
  const [isLoading, setLoading] = useState(false)

  const handleCancelPress = async (reserva) => {
    showConfirmationAlert(auth.currentUser.uid, reserva)
  }

  const showConfirmationAlert = (uid, reserva) => {
    Alert.alert(
      'Confirmación de cancelación',
      '¿Estás seguro que quieres cancelar la reserva?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Si', onPress: () => handleCancelConfirmed(uid, reserva) },
      ]
    );
  };

  const handleCancelConfirmed = async (uid, reserva) => {
    setLoading(true)
    UserService.cancelUserReservation(auth.currentUser.uid, reserva)
    console.log('volvi')
    ReservaService.cancelReservation(auth.currentUser.uid, reserva)
    setLoading(false)
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchReservations = async () => {
        try {
          // Fetch reservations data from the database
          setLoading(true)
          const reservationsData = await UserService.getReservationsForUser(auth.currentUser.uid);
          setReservas(reservationsData);
          setLoading(false)
        } catch (error) {
          console.log('Error fetching reservations:', error);
          setLoading(false)
        }
      };
  
      fetchReservations();
    }, [])
  )

  return (
    <>
      {isLoading ? <AppLoader/> : null}
      <View style={styles.container}>

        <View style={styles.content}>
          <FlatList
            data={reservas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => 
              <View key={item.id} style={styles.reservaContainer}>
                <Text style={styles.peluqueria}>{item.peluqueria.name}</Text>
                <Text style={styles.infoText}>Dirección: {item.peluqueria.direccion}</Text>
                <Text style={styles.infoText}>Teléfono: {item.phone}</Text>
                <Text style={styles.infoText}>Fecha: {item.fecha}</Text>
                <Text style={styles.infoText}>Hora: {item.hora}</Text>
                <TouchableOpacity onPress={() => handleCancelPress(item)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                </TouchableOpacity>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reservaContainer: {
    marginVertical: 16,
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
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white'
  }
});


export default MyReservationsScreen;
