import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  auth,
  register,
  db,
  getCollectionRef,
  newDoc,
  newDocRef,
  setDocData,
} from '../firebase';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPeluqueria, setIsPeluqueria] = useState(false);

  const navigation = useNavigation();

  const toggleSwitch = () => setIsPeluqueria((previousState) => !previousState);

  const handleOutsidePress = () => {
    Keyboard.dismiss();
  };

  const handleRegisterPress = () => {
    Keyboard.dismiss();
    if (name === '' || email === '' || phone === '' || password === '') {
      Alert.alert('Error', 'Por favor complete todos los datos');
      return;
    } else {
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
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      behavior="padding"
    >
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

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{ false: '#000000', true: '#ffe4b5' }}
            thumbColor={isPeluqueria ? '#000000' : '#000000'}
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
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    width: '80%',
  },
  button: {
    flex: 1,
    backgroundColor: '#ffe4b5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  switchTextContainer: {
    marginLeft: 10,
    flex: 1,
    alignItems: 'flex-start',
  },
  switchText: {
    fontSize: 16,
    textAlign: 'left',
  },
});

export default RegisterScreen;
