import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Platform, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setDoc } from '@firebase/firestore';
import PeluqueriaService from '../../data/PeluqueriaService';
import { auth } from '../../firebase';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

const FirstLoginScreen = (props) => {
  const { setUserType } = props;
  const navigation = useNavigation();
  const [direccion, setDireccion] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sillas, setSillas] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHorarioIndex, setSelectedHorarioIndex] = useState(null);
  const [selectedField, setSelectedField] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleAddHorario = () => {
    setHorarios([...horarios, { inicio: '', fin: '' }]);
  };

  const handleRemoveHorario = (index) => {
    const updatedHorarios = [...horarios];
    updatedHorarios.splice(index, 1);
    setHorarios(updatedHorarios);
  };

  const handleHorarioChange = (index, field) => {
    setSelectedHorarioIndex(index);
    setSelectedField(field);
    setShowTimePicker(true);
  };

  const handleTimePickerConfirm = (event, selectedTime) => {
    if (event.type === 'set') { // check if the type is 'set', indicating that a time has been selected
      const time = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedHorarios = [...horarios];
      updatedHorarios[selectedHorarioIndex][selectedField] = time;
      setHorarios(updatedHorarios);
      setSelectedTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const handleCreateDocument = () => {
    // check if all objects in horarios array have inicio and fin attributes
    for (let i = 0; i < horarios.length; i++) {
      if (!horarios[i].inicio || !horarios[i].fin) {
        Alert.alert('Por favor, complete todos los campos');
        return;
      }
    }
    // check if all fields are filled
    if (!direccion || horarios.length === 0 || !name || !phone || !sillas) {
      Alert.alert('Por favor, complete todos los campos');
      return;
    }
    const data = {
      direccion: direccion,
      horarios: horarios,
      name: name,
      phone: phone,
      sillas: parseInt(sillas),
    };
    console.log('Document data:', data);
    // create document in "Peluqerias" collection and set peluqueria attribute in current user to the document id
    // then navigate to BussinessInfoScreen
    PeluqueriaService.createPeluqueria(auth.currentUser.uid, data).then(
      () => {
        setUserType('peluqueria');
      }
    ).catch((error) => {
      Alert.alert('Error:', error.message);
    }
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={direccion}
            onChangeText={setDireccion}
          />

          <Text style={styles.label}>Horarios</Text>
          {horarios.map((horario, index) => (
            <View key={index} style={styles.horarioContainer}>
              <View style={styles.horarioRow}>
                <TouchableOpacity
                  style={styles.horarioInput}
                  onPress={() => handleHorarioChange(index, 'inicio')}
                >
                  <Text>{horario.inicio || 'Seleccione inicio'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.horarioInput}
                  onPress={() => handleHorarioChange(index, 'fin')}
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
            </View>
          ))}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime} // Use selectedTime from state instead of always initializing with new Date()
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimePickerConfirm}
            />
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddHorario}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Cantidad de sillas</Text>
          <TextInput
            style={styles.input}
            value={sillas}
            onChangeText={setSillas}
            keyboardType="numeric"
          />

          <Button title="Crear Documento" onPress={handleCreateDocument} />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
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
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#008000',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
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

export default FirstLoginScreen;
