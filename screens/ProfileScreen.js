import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import UserService from '../data/UserService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await UserService.getUserInfo(auth.currentUser.uid);
        setUserData(user.data());
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleLogoutPress = () => {
    // Agregar lógica para cerrar sesión de usuario

    // Después de cerrar sesión, navegar a la pantalla de inicio de sesión
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <FontAwesome name="user-circle" size={100} color="black" />
        {userData && (
          <>
            <Text style={styles.username} id='username'>{userData.name}</Text>
            <Text style={styles.email} id='email'>{userData.email}</Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleEditProfilePress} style={styles.button}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogoutPress} style={[styles.button, styles.buttonOutline]}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  email: {
    fontSize: 16,
    color: 'white',
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
