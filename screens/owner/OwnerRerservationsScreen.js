import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PeluqueriaService from '../../data/PeluqueriaService';
import { auth } from '../../firebase';

const OwnerReservationsScreen = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const reservationsDocs = await PeluqueriaService.getReservationsForPeluqueria(auth.currentUser.uid);
                const reservations = reservationsDocs.map((reservation) => {
                    return {
                        ...reservation.data(),
                        id: reservation.id,
                    };
                });
                setReservations(reservations);
            } catch (error) {
                console.log(error);
            }
        };

        fetchReservations();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Reservas</Text>
            <ScrollView>
                {reservations.map((reservation, index) => (
                    <View style={styles.card} key={index}>
                        <View style={styles.textContainer}>
                            <View style={styles.dateContainer}>
                                <Icon name="calendar" size={20} color="#333" style={styles.icon} />
                                <Text style={styles.date}>{new Date(reservation.fecha.seconds * 1000).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</Text>
                            </View>
                            <View style={styles.timeContainer}>
                                <Icon name="clock-o" size={20} color="#333" style={styles.icon} />
                                <Text style={styles.time}>Hora: {new Date(reservation.fecha.seconds * 1000).toLocaleTimeString('en-CA', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</Text>
                            </View>
                        </View>
                        <View style={styles.lugaresContainer}>
                            <Text style={styles.lugaresLabel}>Lugares</Text>
                            <Text style={styles.lugaresNumber}>{reservation.lugares}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android StatusBar
        backgroundColor: '#f08080',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width - 40,
        alignSelf: 'center',
    },
    textContainer: {
        justifyContent: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 5,
    },
    time: {
        fontSize: 18,
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
    lugaresContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    lugaresLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    lugaresNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4caf50',
    },
});

export default OwnerReservationsScreen;
