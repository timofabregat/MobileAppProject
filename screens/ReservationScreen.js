import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const ReservationScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDateText, setSelectedDateText] = useState('Seleccionar fecha');
  const [selectedTimeText, setSelectedTimeText] = useState('Seleccionar hora');
  
  const navigation = useNavigation();

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

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    setSelectedTimeText(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    hideTimePicker();
  };

  const handleReservation = () => {
    if (selectedDate && selectedTime) {
      showConfirmationAlert();
    }
  };

  const showConfirmationAlert = () => {
    Alert.alert(
      'Confirmar reserva',
      `¿Desea reservar para el día ${selectedDate.toDateString()} a las ${selectedTime.toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      )}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Aceptar', onPress: handleReservationConfirmed,
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  const handleReservationConfirmed = () => {
    navigation.navigate('MyReservationsScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>{selectedDateText}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showTimePicker}>
        <Text style={styles.buttonText}>{selectedTimeText}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: 'pink' }]} onPress={handleReservation}>
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
  },
  button: {
    backgroundColor: '#4B0082',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationScreen;
