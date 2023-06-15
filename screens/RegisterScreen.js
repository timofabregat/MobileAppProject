import { StyleSheet, Text, View, Image, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [logoContainerHeight, setLogoContainerHeight] = useState('50%');

  const handleRegisterPress = () => {
    // Rest of the code to register in the database
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setLogoContainerHeight('40%');
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setLogoContainerHeight('50%');
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      behavior="padding"
    >
      <View style={[styles.logoContainer, { height: logoContainerHeight }]}>
        <Image source={require('../assets/Logo.png')} style={styles.loginLogo} />
      </View>

      <KeyboardAwareScrollView
        style={styles.inputContainer}
        extraScrollHeight={-40}
        enableResetScrollToCoords={false}
      >
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
      </KeyboardAwareScrollView>

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
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLogo: {
    maxWidth: 200,
    maxHeight: 200,
    width: '100%',
    height: '100%',
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
});
