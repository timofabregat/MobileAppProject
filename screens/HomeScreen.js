import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db, getCollectionRef, getDocuments } from '../firebase';
import AppLoader from './AppLoader';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const fetchSalons = async () => {
      const querySnapshot = await getDocuments(getCollectionRef(db, 'Peluquerias'));
      const salonData = querySnapshot.docs.map((doc) => doc);
      setSalons(salonData);
    };

    fetchSalons();
  }, []);

  const handleReservaPress = (peluqueria) => {
    navigation.navigate('ReservationScreen', {peluqueria});
  };

  return (
    <>
      <View style={styles.container}>
        {/* Contenido principal */}
        <View style={styles.content}>
          <FlatList
            data={salons}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.salonContainer}>
                <View style={styles.salonItem}>
                  <Text style={styles.salonName}>{item.data().name}</Text>
                  <Text style={styles.salonInfo}>{item.data().direccion}</Text>
                  <Text style={styles.salonInfo}>{item.data().phone}</Text>
                  <TouchableOpacity onPress={() => handleReservaPress(item)} style={styles.reserveButton}>
                    <Text style={styles.reserveButtonText}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
        {/* Barra inferior fija */}
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
  salonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  salonItem: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#020202',
  },
  salonName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  salonInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  reserveButton: {
    backgroundColor: '#999999',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingVertical: '4.5%',
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

export default HomeScreen;
