import { StyleSheet, Text, View, Image,Keyboard ,KeyboardAvoidingView, TextInput,TouchableWithoutFeedback ,TouchableOpacity, Alert,Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {auth, register} from '../firebase'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const navigation = useNavigation()
  
  const handleClickScroll = () => {
    
  }
  
  const handleOutsidePress = () => {
    Keyboard.dismiss();
  }

  const handleRegisterPress = () => {
    Keyboard.dismiss();
    if (name === '' || email === '' || phone === '' || password === ''){
      Alert.alert('Error', 'Por favor complete todos los datos');
      return
    }
    else{
      register(auth, email, password)
      .then(() => {
        Alert.alert('Success', 'Registration Successful');
        navigation.navigate('Login')
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      })
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid extraHeight={150}>
      <View style={[styles.logoContainer, isKeyboardOpen && styles.logoContainerKeyboardOpen]}>
        <Image source={require('../assets/Logo.png')} style={styles.loginLogo} />
      </View>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f08080',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 2,
    marginTop: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainerKeyboardOpen: {
    flex:1,
    justifyContent: 'center',
  },
  loginLogo: {
    maxHeight:300,
    maxWidth:300,
  },
  inputContainer: {
    flex: 1,
    width: '80%',
    marginTop: 10,
  },
  input: {
    width:'80%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    width: '60%',
    marginTop: 10,
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
