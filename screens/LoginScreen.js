import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' >
      <Image source={require('../assets/Logo.png')} style={styles.LoginLogo}/>

      <View style={styles.inputContainer}>
        <TextInput placeholder="email" style={styles.input} value={email} onChangeText={text => setEmail(text)}/>
        <TextInput placeholder="password" style={styles.input} value={password} onChangeText={text => setPassword(text)} secureTextEntry/>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={[styles.button, styles.buttonOutline]}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f08080',
    alignItems: 'center'
  },

  LoginLogo: {
    top: '-20%',
    
  },

  inputContainer: {
    width: '80%',
    top: '-35%',
  },

  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 5
  },

  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -250
  },

  button: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10
  },

  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'blue',
    borderWidth: 2
  }

})