import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Keyboard, TextInput, TouchableOpacity, Alert, Switch, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, register, db, getCollectionRef, newDoc, newDocRef, setDocData } from '../firebase';
import AppLoader from './AppLoader';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPeluqueria, setIsPeluqueria] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation();

  const toggleSwitch = () => setIsPeluqueria((previousState) => !previousState);

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen');
  };

  const handleRegisterPress = () => {
    Keyboard.dismiss();
    if (name === '' || email === '' || phone === '' || password === '') {
      Alert.alert('Error', 'Por favor complete todos los datos');
      return;
    } 
    else {
      setIsLoading(true)
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        setIsLoading(false)
        Alert.alert('Error', 'Por favor ingrese un email válido');
        return;
      }

      register(auth, email, password)
        .then((userCredential) => {
          const userId = userCredential.user.uid;
          const usersCollection = getCollectionRef(db, 'Users');
          const userDocRef = newDocRef(usersCollection, userId);
          setDocData(userDocRef, {
            name,
            email,
            phone,
            isPeluqueria,
          })
            .then(() => {
              Alert.alert('Success', 'Registration Successful');
              setIsLoading(false)
              navigation.navigate('LoginScreen');
            })
            .catch((error) => {
              setIsLoading(false)
              Alert.alert('Error', error.message);
            });
        })
        .catch((error) => {
          setIsLoading(false)
          Alert.alert('Error', error.message);
        });
    }
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      // Handle keyboard show event
    });

    Keyboard.addListener('keyboardDidHide', () => {
      // Handle keyboard hide event
    });

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      {isLoading ? <AppLoader/> : null}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/Logo.png')} style={styles.loginLogo} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              placeholder="Correo electrónico"
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Celular"
              style={styles.input}
              value={phone}
              onChangeText={(text) => setPhone(text)}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />

            <View style={styles.containerSwitch}>
              <Switch
                trackColor={{ false: '#ffe4b5', true: '#ffe4b5' }}
                thumbColor={isPeluqueria ? '#f08080' : '#ffe4b5'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isPeluqueria}
              />
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchText}>¿Desea registrarse como peluquería?</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
              <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messageContainer}>
                <Text>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={handleLoginPress}>
                    <Text style={styles.linkText}>Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f08080',
  },
  logoContainer: {
    height: 200,
    width: 200,
  },
  loginLogo: {
    height: '100%',
    width: '100%',
  },
  inputContainer: {
    width: '80%',
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 10,
    // marginTop: 20,
    // marginBottom: 100,
  },
  button: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
  },
  switchTextContainer: {
    marginLeft: 10,
  },
  switchText: {
    fontSize: 14,
    textAlign: 'left',
  },


  linkText: {
    color: 'blue',
    fontWeight: 'bold',
  },

  messageContainer: {
    marginTop: 10,
    justifyContent: 'center',
    gap: 5,
    flexDirection: 'row',
  },
});

export default RegisterScreen;
