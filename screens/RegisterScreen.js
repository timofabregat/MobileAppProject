import { StyleSheet, Text, View, Image,Keyboard, TextInput,TouchableOpacity, Alert, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {auth, register, db, getCollectionRef, newDoc, newDocRef, setDocData} from '../firebase'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPeluqueria, setIsPeluqueria] = useState(false)

  const navigation = useNavigation()

  const toggleSwitch = () => setIsPeluqueria(previousState => !previousState);
  
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
      .then((userCredential) => {
        const userId = userCredential.user.uid
        const usersCollection = getCollectionRef(db, "Users");
        const userDocRef = newDocRef(usersCollection, userId)
        setDocData(userDocRef, {
          name,
          email,
          phone,
          isPeluqueria
        })
          .then(() => {
            Alert.alert('Success', 'Registration Successful');
            navigation.navigate('LoginScreen')
          })
          .catch((error) => {
            Alert.alert('Error', error.message);
          });
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

        <View style={styles.containerSwitch}>
          <Switch
            trackColor={{false: '#black', true: '#ffe4b5'}}
            thumbColor={isPeluqueria ? '#black' : '#black'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isPeluqueria}
          />
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchText}>¿Desea registrarse como peluqueria?</Text>
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
    marginTop: '9%',
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  containerSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '7%',
    width: '80%',
  },
  switchTextContainer: {
    marginLeft: 10,
  },
  switchText: {
    fontSize: 16,
  },
  
});
