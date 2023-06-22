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
import { Ionicons } from '@expo/vector-icons';

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
  <Tab.Screen
    name="Mi Peluquería"
    component={BussinessInfoScreen}
    options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="business-outline" color={color} size={size} />
      ),
      headerShown: false
    }}
  />
  <Tab.Screen
    name="Reservas"
    component={OwnerReservationsScreen}
    options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="calendar-outline" color={color} size={size} />
      ),
      headerShown: false
    }}
  />
</Tab.Navigator>
);

const UserTabs = ({ setUserType }) => (
  <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarButton: (props) => {
      if (route.name === "ReservationScreen") {
        return null;
      }
      return <TouchableOpacity {...props} />;
    },
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === "Peluquerías") {
        iconName = "home-outline";
      } else if (route.name === "Mis Reservas") {
        iconName = "calendar-outline";
      } else if (route.name === "Perfil") {
        iconName = "person-outline";
      }

      return <Ionicons name={iconName} color={color} size={size} />;
    }
  })}
>
  <Tab.Screen
    name="Peluquerías"
    component={HomeScreen}
    options={{ headerShown: true }}
  />
  <Tab.Screen
    name="Mis Reservas"
    component={MyReservationsScreen}
    options={{ headerShown: true }}
  />
  <Tab.Screen
    name="Perfil"
    options={{ headerShown: true }}
  >
    {(props) => <ProfileScreen {...props} setUserType={setUserType} />}
  </Tab.Screen>
  <Tab.Screen
    name="ReservationScreen"
    component={ReservationScreen}
    options={{ tabBarVisible: false }}
  />
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
