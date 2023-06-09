import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth } from '../firebase';
import UserService from '../data/UserService';
import AppLoader from './AppLoader';

const ProfileScreen = (props) => {
  const { setUserType } = props;
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          setIsLoading(true)
          const user = await UserService.getUserInfo(auth.currentUser.uid);
          setUserData(user.data());
          setPhoneNumber(user.data().phone || '');
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
          console.log('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    },[])
  )

  const handleLogoutPress = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => setUserType(null) },
      ],
      { cancelable: true }
    );
  };

  const handlePhoneNumberChange = (newPhoneNumber) => {
    setPhoneNumber(newPhoneNumber);
  };

  const handlePhoneNumberUpdate = async () => {
    try {
      UserService.updatePhone(auth.currentUser.uid, phoneNumber).then(
        Alert.alert("Se ha cambiado el número de teléfono")
      )
      console.log('Phone number updated successfully!');
    } catch (error) {
      Alert.alert(error)
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <FontAwesome name="user-circle" size={100} color="black" />
          {userData && (
            <>
              <Text style={styles.username}>{userData.name}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{userData.email}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  onBlur={dismissKeyboard} // Cerrar el teclado cuando se pierde el foco del campo de entrada
                />
              </View>
              <TouchableOpacity onPress={handlePhoneNumberUpdate} style={styles.button}>
                <Text>Update</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogoutPress} style={[styles.button, styles.buttonOutline]}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        {isLoading && <AppLoader />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  info: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    // flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: 150
  },
  buttonContainer: {
    width: '60%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2,
  },
});
