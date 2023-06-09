import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { db, getCollectionRef, getDocuments } from '../firebase';
import AppLoader from './AppLoader';
import ReservationScreen from './ReservationScreen';
import { set } from 'date-fns';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [salons, setSalons] = useState([]);
  const [reservar, setReservar] = useState(false);
  const [peluqueria, setPeluqueria] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const fetchSalons = async () => {
        setIsLoading(true)
        const querySnapshot = await getDocuments(getCollectionRef(db, 'Peluquerias'));
        setIsLoading(false)
        const salonData = querySnapshot.docs.map((doc) => doc);
        setSalons(salonData);
      };
  
      fetchSalons();
    }, [])
  )

  const handleReservaPress = (peluqueria) => {
    console.log(peluqueria);
    setPeluqueria(peluqueria);
    setReservar(true);
  };

  const screen = (
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
        {isLoading && <AppLoader />}
      </View>
    </>
  );

  let loadedScreen

  if (reservar === false) {
    loadedScreen = screen
  } else {
    loadedScreen = <ReservationScreen setReservar={setReservar} peluqueria={peluqueria} />
  }
  
  return loadedScreen
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
