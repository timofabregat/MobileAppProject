import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import UserService from '../data/UserService';
import { auth } from '../firebase';
import AppLoader from './AppLoader';

const MyReservationsScreen = () => {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState([]);
  const [isLoading, setLoading] = useState(false)

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
