import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { auth } from './firebase';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReservationScreen from './screens/ReservationScreen';
import MyReservationsScreen from './screens/MyReservationsScreen';
import ProfileScreen from './screens/ProfileScreen.js';
import FirstLoginScreen from './screens/owner/FirstLoginScreen';
import BussinessInfoScreen from './screens/owner/BussinessInfoScreen';
import OwnerReservationsScreen from './screens/owner/OwnerRerservationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = ({ handleLoginSuccess }) => (
  <Stack.Navigator>
    <Stack.Screen
      options={{ headerShown: false }}
      name="LoginScreen"
    >
      {(props) => <LoginScreen {...props} handleLoginSuccess={handleLoginSuccess} />}
    </Stack.Screen>

    <Stack.Screen
      options={{ headerShown: false }}
      name="RegisterScreen"
      component={RegisterScreen}
    />
  </Stack.Navigator>
);

const PeluqueriaTabs = () => (
  <Tab.Navigator>
    <Tab.Screen options={{ headerShown: false }} name="BussinessInfoScreen" component={BussinessInfoScreen} />
    <Tab.Screen options={{ headerShown: false }} name="OwnerReservationsScreen" component={OwnerReservationsScreen} />
  </Tab.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Reservations" component={ReservationScreen} />
    <Tab.Screen name="My Reservations" component={MyReservationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [userType, setUserType] = useState(null); // "Peluqueria", "User" or null

  const handleLoginSuccess = (type) => {
    console.log(type);
    setUserType(type); // set userType to "Peluqueria" or "User"
  };

  return (
    <NavigationContainer>
      {userType === null && <AuthStack handleLoginSuccess={handleLoginSuccess} />}
      {userType === "peluqueria" && <PeluqueriaTabs/>}
      {userType === "peluqeriaFirstTime" && <FirstLoginScreen />}
      {userType === "user" && <UserTabs />}
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
