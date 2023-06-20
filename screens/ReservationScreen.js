import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment-timezone';
import { auth } from '../firebase';
import UserService from '../data/UserService';
import ReservaService from '../data/ReservaService';


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
      const existingReservation = await ReservaService.getReservaOrNull(selectedDate, selectedTime,peluqueria);

      if (existingReservation!=null) {
        console.log(existingReservation.id)
        // Si existe una reserva, verificar si hay lugares disponibles
        if (existingReservation.data().lugares > 0) {
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


  const handleNewReservationConfirmed = async () => {
    console.log('CREANDO NUEVA RESERVA...')
    const myReservation = await ReservaService.createReserva(selectedDate,selectedTime,peluqueria,auth.currentUser.uid)
    await UserService.assignReservationToUser(auth.currentUser.uid, myReservation) 
    navigation.navigate('MyReservationsScreen');
  };

  const handleReservationConfirmed = async (existingReservation) => {
    console.log('MODIFICANDO RESERVA EXISTENTE...')
    const reserva = await ReservaService.updateReserva(existingReservation)
    await UserService.assignReservationToUser(auth.currentUser.uid, reserva)
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
