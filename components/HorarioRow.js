import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const HorarioRow = (props) => {

    const { horario, index, handleHorarioChange, handleRemoveHorario, handleTimePickerConfirm } = props

    const [showTimePicker, setShowTimePicker] = useState(false)
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedField, setSelectedField] = useState('');

    const toggleTimePicker = (field, horarioString) => {
        setSelectedField(field);

        if (horarioString.includes(":")) {
            const timeParts = horarioString.split(":");
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const newDate = new Date();
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            setSelectedTime(newDate);
        } else {
            setSelectedTime(new Date());
        }

        setShowTimePicker(prev => !prev);
    }

    const openTimePicker = () => {
        setShowTimePicker(true);
    }

    const closeTimePicker = () => {
        setShowTimePicker(false);
    }

    const handleConfirm = () => {
        handleTimePickerConfirm(index, selectedTime, selectedField);
        closeTimePicker();
    }

    const handleTimeChange = (event) => {
        // console.log(event.nativeEvent.timestamp)
        setSelectedTime(new Date(event.nativeEvent.timestamp));
    }

    return (
        <View style={styles.horarioContainer}>
            <View style={styles.horarioRow}>
              <TouchableOpacity
                style={styles.horarioInput}
                onPress={() => toggleTimePicker('inicio', horario.inicio)}
              >
                <Text>{horario.inicio || 'Seleccione inicio'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.horarioInput}
                onPress={() => toggleTimePicker('fin', horario.fin)}
              >
                <Text>{horario.fin || 'Seleccione fin'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveHorario(index)}
              >
                <Text style={styles.deleteButtonText}>-</Text>
              </TouchableOpacity>
            </View>
            { showTimePicker && (
                <View>
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        // onConfirm={closeTimePicker}
                        // onCancel={closeTimePicker}
                        positiveButton={{label: 'Confirmar', color: '#000000'}}
                        onChange={handleTimeChange}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={closeTimePicker}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.confirmButton}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    horarioContainer: {
        marginBottom: 16,
      },
      horarioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      horarioInput: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
        marginRight: 8,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
      },
      horarioText: {
        color: '#777',
      },
      deleteButton: {
        backgroundColor: '#f44336',
        width: 30,
        height: 30,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontStyle: 'bold',
      },
      deleteButtonText: {
        color: 'white',
        fontSize: 18,
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
      },
      button: {
        color: 'rgba(0,0,0,0.75)',
        padding: 5,
      },
      confirmButton: {
        padding: 5,
        fontWeight: 'bold',
      },
      
})

export default HorarioRow