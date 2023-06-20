import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import UserService from '../../data/UserService';
import { auth } from '../../firebase';

const BusinessInfoScreen = () => {
  const navigation = useNavigation();
  const [businessData, setBusinessData] = useState(null);
  const [name, setName] = useState('');
  const [direccion, setDireccion] = useState('');
  const [phone, setPhone] = useState('');
  const [sillas, setSillas] = useState('');
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    // Fetch business data when the component mounts
    const fetchData = async () => {
      try {
        const businessData = (await UserService.getPeluqueriaInfo(auth.currentUser.uid)).data();
        setBusinessData(businessData);
        setName(businessData.name);
        setDireccion(businessData.direccion);
        setPhone(businessData.phone);
        setSillas(businessData.sillas.toString()); // Convert sillas to string
        setHorarios(businessData.horarios || []);
      } catch (error) {
        console.error('Error fetching business data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    // Perform the update logic here, using the updated field values (name, direccion, phone, sillas, horarios)
    try {
      // Assuming UserService.updatePeluqueriaInfo is the method to update the business data
      await UserService.updatePeluqueriaInfo(auth.currentUser.uid, {
        name,
        direccion,
        phone,
        sillas,
        horarios,
      });
      console.log('Business data updated successfully');
      // Optionally, navigate to another screen or perform any other action after successful update
    } catch (error) {
      console.error('Error updating business data:', error);
    }
  };

  const handleAddHorario = () => {
    setHorarios([...horarios, { inicio: '', fin: '' }]);
  };

  const handleDeleteHorario = (index) => {
    const updatedHorarios = [...horarios];
    updatedHorarios.splice(index, 1);
    setHorarios(updatedHorarios);
  };

  
  const handleHorarioChange = (index, field, value) => {
    const updatedHorarios = [...horarios];
    updatedHorarios[index][field] = value;
    setHorarios(updatedHorarios);
  };


  if (!businessData) {
    return null; // Render loading state or fallback UI if business data is not available yet
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>{businessData.name}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Dirección:</Text>
          <TextInput
            style={styles.input}
            value={direccion}
            onChangeText={setDireccion}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Horarios:</Text>
          {horarios && Array.isArray(horarios) ? (
            horarios.map((horario, index) => (
              <View key={index} style={styles.horarioContainer}>
                <TextInput
                  style={styles.horarioInput}
                  value={horario.inicio}
                  onChangeText={(value) => handleHorarioChange(index, 'inicio', value)}
                />
                <TextInput
                  style={styles.horarioInput}
                  value={horario.fin}
                  onChangeText={(value) => handleHorarioChange(index, 'fin', value)}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHorario(index)}
                >
                  <Text style={styles.deleteButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No hay horarios disponibles.</Text>
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddHorario}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Teléfono:</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Cantidad de sillas:</Text>
          <TextInput
            style={styles.input}
            value={sillas}
            onChangeText={setSillas}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
          <Text style={styles.editButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  horarioInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    fontSize: 16,
    color: 'black',
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
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  editButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f08080',
    textAlign: 'center',
  },
});

export default BusinessInfoScreen;

