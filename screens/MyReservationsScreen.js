import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const MyReservationsScreen = () => {
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
      <Text style={styles.heading}>Mis Reservas</Text>
      {reservas.map((reserva) => (
        <View key={reserva.id} style={styles.reservaContainer}>
          <Text style={styles.peluqueria}>{reserva.peluqueria}</Text>
          <Text>Dirección: {reserva.direccion}</Text>
          <Text>Teléfono: {reserva.telefono}</Text>
          <Text>Fecha: {reserva.fecha}</Text>
          <Text>Hora: {reserva.hora}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
  peluqueria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default MyReservationsScreen;
