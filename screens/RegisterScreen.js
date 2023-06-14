import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
//import Modal from 'react-native-modal'

const RegisterScreen = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
//   const [errorModalVisible, setErrorModalVisible] = useState(false)
//   const [errorMessage, setErrorMessage] = useState('')

  const handleRegisterPress = () => {
    if (name === '' || email === '' || phone === '' || password === '') {
      setErrorMessage('Por favor completa todos los campos')
      setErrorModalVisible(true)
      return
    }

    // Resto del código para registrar en la base de datos
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={-200}>
      <Image source={require('../assets/Logo.png')} style={styles.LoginLogo}/>

      <View style={styles.inputContainer}>
        <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={text => setName(text)}/>
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={text => setEmail(text)}/>
        <TextInput placeholder="Phone" style={styles.input} value={phone} onChangeText={text => setPhone(text)}/>
        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={text => setPassword(text)} secureTextEntry/>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

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

  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },

  modalText: {
    fontSize: 18,
    marginBottom: 10
  },

  modalButton: {
    backgroundColor: '#ffe4b5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})