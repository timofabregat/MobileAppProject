import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
import EditBussinessProfile from './screens/owner/EditBussinessProfile';

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

const PeluqueriaTabs = ({ setEdit }) => (
  <Tab.Navigator>
    <Tab.Screen options={{ headerShown: false }} name="BussinessInfoScreen" component={BussinessInfoScreen} />
    <Tab.Screen options={{ headerShown: false }} name="OwnerReservationsScreen" component={OwnerReservationsScreen} />
  </Tab.Navigator>
);

const UserTabs = ({ setUserType }) => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarButton: (props) => {
        if(route.name == "ReservationScreen") {
          return null
        }
        return <TouchableOpacity {...props} />
      }
    })}
  >
    <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
    <Tab.Screen options={{ headerShown: false }} name="My Reservations" component={MyReservationsScreen} />
    <Tab.Screen name="Profile">
      {(props) => <ProfileScreen {...props} setUserType={setUserType} />}
    </Tab.Screen>
    <Tab.Screen isVisible={false} name="ReservationScreen" component={ReservationScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [userType, setUserType] = useState(null); // "Peluqueria", "User" or null

  const handleLoginSuccess = (type) => {
    setUserType(type); // set userType to "Peluqueria" or "User"
  };

  let initialScreen;
  if (userType === null) {
    initialScreen = (
      <AuthStack handleLoginSuccess={handleLoginSuccess} />
    );
  } else if (userType === "peluqueria") {
    initialScreen = <PeluqueriaTabs/>;
  } else if (userType === "peluqueriaFirstTime") {
    initialScreen = <FirstLoginScreen setUserType={setUserType} />;
  } else if (userType === "user") {
    initialScreen = <UserTabs setUserType={setUserType} />;
  }

  return (
    <NavigationContainer>
      {initialScreen}
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
