import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, signIn } from '../firebase';
import UserService from '../data/UserService';
import { async } from '@firebase/util';
import AppLoader from './AppLoader';

const LoginScreen = (props) => {
  const { handleLoginSuccess } = props;
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterPress = () => {
    navigation.navigate('RegisterScreen');
  };

  const handleLoginPress = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    } else {
      setIsLoading(true)
      signIn(auth, email, password)
        .then(() => {
          UserService.getUserType(auth.currentUser.uid)
            .then((type) => {
              setIsLoading(false)
              handleLoginSuccess(type);
            })
            .catch((error) => {
              setIsLoading(false)
              console.log(error);
            }
            );
        })
        .catch((error) => {
          setIsLoading(false)
          Alert.alert('Error', error.message);
        });
    }
  };



  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/Logo.png')} style={styles.loginLogo} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          <KeyboardAvoidingView style={styles.buttonContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegisterPress} style={[styles.button, styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
          {isLoading && <AppLoader />}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },

  loginLogo: {
    width: 200,
    height: 200,
  },

  inputContainer: {
    width: '80%',
    marginTop: 30,
  },

  input: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },

  buttonContainer: {
    width: '60%',
    marginTop: 20,
  },

  button: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  buttonOutline: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2,
  },

  buttonOutlineText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 16,
  },
});