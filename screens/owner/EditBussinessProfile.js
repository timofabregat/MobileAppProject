import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import PeluqueriaService from '../../data/PeluqueriaService';

const FirstLoginScreen = (props) => {
  const { setEdit, peluqueria } = props;
  const navigation = useNavigation();
  const [direccion, setDireccion] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sillas, setSillas] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHorarioIndex, setSelectedHorarioIndex] = useState(null);
  const [selectedField, setSelectedField] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showSillas, setShowSillas] = useState(false);

  useEffect(() => {
    data = peluqueria.data();
    if (data) {
      setDireccion(data.direccion);
      setHorarios(data.horarios);
      setName(data.name);
      setPhone(data.phone);
      setSillas(data.sillas.toString());
    }
  }, []);

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
    if (event.type === 'set') {
      const time = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const updatedHorarios = [...horarios];
      updatedHorarios[selectedHorarioIndex][selectedField] = time;
      setHorarios(updatedHorarios);
      setSelectedTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const handleCreateDocument = () => {
    for (let i = 0; i < horarios.length; i++) {
      if (!horarios[i].inicio || !horarios[i].fin) {
        Alert.alert('Por favor, complete todos los campos');
        return;
      }
    }
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
    PeluqueriaService.updatePeluqueriaInfo(peluqueria.ref, data)
      .then(() => {
        setEdit('bussiness');
      })
      .catch((error) => {
        Alert.alert('Error:', error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            value={selectedTime}
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
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

        <Text style={styles.label}>Cantidad de sillas</Text>
        
        <TouchableOpacity
          style={styles.sillas}
          onPress={() => setShowSillas(!showSillas)}
        >
          <Text>{sillas}</Text>
        </TouchableOpacity>

        <View style={styles.pickerContainer}>
          {showSillas && (
            <Picker
              selectedValue={sillas}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSillas(itemValue)}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
              <Picker.Item label="6" value={6} />
              <Picker.Item label="7" value={7} />
              <Picker.Item label="8" value={8} />
              <Picker.Item label="9" value={9} />
              <Picker.Item label="10" value={10} />
            </Picker>
          )}
        </View>
      </View>
      {/* <View style={styles.updateDocumentButton}>
        <Button title="Actualizar perfil" onPress={handleCreateDocument} titleStyle={styles.updateButtonText}/>
      </View> */}
      <TouchableOpacity style={styles.updateDocumentButton} onPress={handleCreateDocument}>
        <Text style={styles.updateButtonText}>Actualizar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f08080',
  },
  content: {
    padding: 30,
    marginTop: '10%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  pickerContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    textAlign: 'center',
    alignItems: 'center',
  },
  sillas: {
    height: 40,
    backgroundColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  updateDocumentButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f08080',
    textAlign: 'center',
  },
  picker: {
    height: 40,
    backgroundColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
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
    borderRadius: 8,
  },
  horarioText: {
    color: '#777',
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
});

export default FirstLoginScreen;
