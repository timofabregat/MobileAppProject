import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const handleRegisterPress = () => {
    navigation.navigate('Register');
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
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid>
      <View style={[styles.logoContainer, isKeyboardOpen && styles.logoContainerKeyboardOpen]}>
        <Image source={require('../assets/Logo.png')} style={[styles.loginLogo, isKeyboardOpen && styles.loginLogoKeyboardOpen]} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={text => setEmail(text)} />
        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={text => setPassword(text)} secureTextEntry />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => { }} style={styles.button}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegisterPress} style={[styles.button, styles.buttonOutline]}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f08080',
    alignItems: 'center',
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  logoContainerKeyboardOpen: {
    flex:0.4,
  },

  loginLogo: {
    maxWidth: 400,
    maxHeight: 400,
  },

  loginLogoKeyboardOpen: {
    maxWidth: 200,
    maxHeight: 200,
  },

  inputContainer: {
    width: '80%',
    marginTop: 10,
  },

  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonContainer: {
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

  buttonOutline: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2,
  },
});