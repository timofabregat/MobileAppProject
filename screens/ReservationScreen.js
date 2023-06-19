import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment-timezone';
import { getCollectionRef, newDoc, setDocData, db, getDocuments, queryDocuments, whereCondition } from '../firebase';
import UserService from '../data/UserService';


const ReservationScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDateText, setSelectedDateText] = useState('Seleccionar fecha');
  const [horarios, setHorarios] = useState([]);

  const navigation = useNavigation();

  const route = useRoute();
  const { peluqueria } = route.params;

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setSelectedDateText(date.toDateString());
    hideDatePicker();
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    hideTimePicker();
  };

  const handleReservation = () => {
    console.log("Dia", selectedDate);
    console.log("Hora", selectedTime);

    if (selectedDate && selectedTime) {
      const selectedDateTime = moment(selectedDate)
        .hour(parseInt(selectedTime.slice(0, 2), 10))
        .minute(parseInt(selectedTime.slice(3, 5), 10))
        .tz('America/Montevideo');

      const currentDateTime = moment().tz('America/Montevideo');

      if (selectedDateTime.isAfter(currentDateTime)) {
        checkAvailability();
      } else {
        Alert.alert(
          'Fecha inválida',
          'La fecha seleccionada debe ser posterior a la fecha y hora actual.',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert(
        'Campos incompletos',
        'Debes seleccionar una fecha y hora para realizar la reserva.',
        [{ text: 'OK' }]
      );
    }
  };

  const checkAvailability = async () => {
    try {
      // Verificar si ya existe una reserva para la fecha y hora seleccionadas
      const existingReservation = await getExistingReservation(selectedDate, selectedTime);

      if (existingReservation) {
        // Si existe una reserva, verificar si hay lugares disponibles
        if (existingReservation.lugaresDisponibles > 0) {
          // Mostrar confirmación y restar un lugar disponible
          showConfirmationAlert(existingReservation);
        } else {
          // No hay lugares disponibles
          Alert.alert('Sin lugares disponibles', 'Lo sentimos, no hay lugares disponibles para esa fecha y hora.');
        }
      } else {
        // No existe una reserva, crear una nueva
        showConfirmationNewReservationAlert();
      }
    } catch (error) {
      console.log('Error al almacenar la reserva:', error);
    }
  };

  const showConfirmationNewReservationAlert = () => {
    Alert.alert(
      'Confirmación de reserva',
      '¿Deseas confirmar la reserva?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: handleNewReservationConfirmed },
      ]
    );
  };

  const showConfirmationAlert = (existingReservation) => {
    Alert.alert(
      'Confirmación de reserva',
      '¿Deseas confirmar la reserva?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => handleReservationConfirmed(existingReservation) },
      ]
    );
  };

  const createReservation = async (reservationData) => {
    try {
      console.log(reservationData)
      const reservationRef = await newDoc(getCollectionRef(db, 'Reservas'), reservationData);
      UserService.assignReservationToUser(auth.currentUser.uid, reservationRef)
      console.log('Reservation created successfully!');
      return reservationRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw new Error('Failed to create reservation');
    }
  };

  const handleNewReservationConfirmed = async () => {
    console.log('id',peluqueria.id)
    console.log('fecha',moment(selectedDate).hour(parseInt(selectedTime.slice(0, 2), 10))
    .minute(parseInt(selectedTime.slice(3, 5), 10))
    .second(0)
    .toDate())
    console.log('lugares',peluqueria.data().sillas - 1)

    const newReservation = {
      peluqueria: peluqueria.id,
      fecha: moment(selectedDate).hour(parseInt(selectedTime.slice(0, 2), 10))
      .minute(parseInt(selectedTime.slice(3, 5), 10))
      .second(0)
      .toDate(),
      lugares: peluqueria.data().sillas - 1,
    };
    await createReservation(newReservation);
    navigation.navigate('MyReservationsScreen');
  };

  const handleReservationConfirmed = async (existingReservation) => {
    const updatedLugaresDisponibles = existingReservation.lugares - 1;
    await updateLugaresDisponibles(existingReservation.id, updatedLugaresDisponibles);
    navigation.navigate('MyReservationsScreen');
  };

  const addMinutes = (timeString, minutes) => {
    const [hours, minutesStr] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutesStr, 10));

    date.setMinutes(date.getMinutes() + minutes);

    const updatedHours = String(date.getHours()).padStart(2, '0');
    const updatedMinutes = String(date.getMinutes()).padStart(2, '0');

    return `${updatedHours}:${updatedMinutes}`;
  };


  const getExistingReservation = async (date, time) => {
    console.log('AAAAAAAA', peluqueria.id)
    const querySnapshot = await getDocuments(
      queryDocuments(
        getCollectionRef(db, 'reservas'),
        whereCondition('peluqueria', '==', peluqueria.id),
        whereCondition('fecha', '==', moment(date).hour(parseInt(time.slice(0, 2), 10))
          .minute(parseInt(time.slice(3, 5), 10))
          .second(0)
          .toDate()),
      )
    );

    if (!querySnapshot.empty) {
      const reservation = querySnapshot.docs[0].data();
      reservation.id = querySnapshot.docs[0].id;
      return reservation;
    }

    return null;
  };

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        if (peluqueria && peluqueria.data().horarios) {
          const horariosArray = peluqueria.data().horarios.flatMap((horario) => {
            const startTime = horario.inicio;
            const endTime = horario.fin;

            const timeSlots = [];
            let currentTime = startTime;

            while (currentTime < endTime) {
              timeSlots.push(currentTime);
              currentTime = addMinutes(currentTime, 30);
            }

            return timeSlots;
          });
          setHorarios(horariosArray);
        } else {
          console.log('Horarios not available');
        }
      } catch (error) {
        console.log('Error al obtener los horarios:', error);
      }
    };

    fetchHorarios();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.data}>
        <Text style={styles.dataItem}>{peluqueria.data().name}</Text>
        <Text style={styles.dataItem}>{peluqueria.data().direccion}</Text>
        <Text style={styles.dataItem}>{peluqueria.data().phone}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>{selectedDateText}</Text>
      </TouchableOpacity>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
        >
          {horarios.map((horario) => (
            <Picker.Item key={horario} label={horario} value={horario} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'pink' }]}
        onPress={handleReservation}
      >
        <Text style={styles.buttonText}>Reservar</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f08080',
  },
  data: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#020202',
  },
  dataItem: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f08080',
    elevation: 2,
  },
  button: {
    width: '100%',
    backgroundColor: '#4B0082',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationScreen;
