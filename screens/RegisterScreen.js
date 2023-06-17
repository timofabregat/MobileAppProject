import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Keyboard, TextInput, TouchableOpacity, Alert, Switch, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, register, db, getCollectionRef, newDoc, newDocRef, setDocData } from '../firebase';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPeluqueria, setIsPeluqueria] = useState(false);

  const navigation = useNavigation();

  const toggleSwitch = () => setIsPeluqueria((previousState) => !previousState);

  const handleRegisterPress = () => {
    Keyboard.dismiss();
    if (name === '' || email === '' || phone === '' || password === '') {
      Alert.alert('Error', 'Por favor complete todos los datos');
      return;
    } 
    else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
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
              navigation.navigate('LoginScreen');
            })
            .catch((error) => {
              Alert.alert('Error', error.message);
            });
        })
        .catch((error) => {
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
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/Logo.png')} style={styles.loginLogo} />
        </View>
        <View style={styles.inputContainer}>
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
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Phone"
            style={styles.input}
            value={phone}
            onChangeText={(text) => setPhone(text)}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Password"
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
              <Text style={styles.switchText}>¿Desea registrarse como peluqueria?</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLogo: {
    maxHeight: 300,
    maxWidth: 300,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: '60%',
    marginTop: '9%',
    marginBottom: 100,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '7%',
    width: '100%',
  },
  switchTextContainer: {
    marginLeft: 10,
  },
  switchText: {
    fontSize: 16,
    textAlign: 'left',
  },
});

export default RegisterScreen;
