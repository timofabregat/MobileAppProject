import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import PeluqueriaService from '../../data/PeluqeriaService';
import { auth } from '../../firebase';

const OwnerReservationsScreen = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const reservationsDocs = await PeluqueriaService.getReservationsForPeluqueria(auth.currentUser.uid);
                const reservationsWithPeluqueria = await Promise.all(reservationsDocs.map(async (reservation) => {
                    const peluqueriaInfo = await PeluqueriaService.getPeluqueriaInfo(reservation.data().peluqueria);
                    return {
                        ...reservation.data(),
                        peluqueria: peluqueriaInfo.data()
                    };
                }));
                setReservations(reservationsWithPeluqueria);
            } catch (error) {
                console.log(error);
            }
        };

        fetchReservations();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>OwnerReservationsScreen</Text>
            {reservations.map((reservation, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.date}>
                        Hora: {new Date(reservation.fecha.seconds * 1000).toLocaleTimeString('en-CA').slice(0, 5)}
                    </Text>
                    <Text style={styles.date}>
                        Fecha: {new Date(reservation.fecha.seconds * 1000).toLocaleDateString('en-CA')}
                    </Text>
                    <Text style={styles.info}>Lugares: {reservation.lugares}</Text>
                    <Text style={styles.info}>Peluqueria: {reservation.peluqueria.name}</Text>
                </View>
            ))}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android StatusBar
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 0, // Adjust for iOS StatusBar
    },
    card: {
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        padding: 20,
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    date: {
        fontSize: 18,
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
    },
});

export default OwnerReservationsScreen;
