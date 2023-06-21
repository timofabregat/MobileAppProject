import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import UserService from '../../data/UserService';
import { auth } from '../../firebase';
import EditBussinessProfile from './EditBussinessProfile';

const BusinessInfoScreen = () => {
    const navigation = useNavigation();
    const [businessData, setBusinessData] = useState(null);
    const [edit, setEdit] = useState(false);
    const [businesses, setBusinesses] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const businesses = (await UserService.getPeluqueriaInfo(auth.currentUser.uid));
                setBusinesses(businesses);
                const businessData = businesses.data();
                setBusinessData(businessData);
            } catch (error) {
                console.error('Error fetching business data:', error);
            }
        };

        fetchData();
    }, []);

    if (!businessData) {
        return null;
    }

    const handleEditProfile = () => {
        setEdit(true);
    };

    if (edit === true) {
        return <EditBussinessProfile setEdit={setEdit} peluqueria={businesses} />;
    } else {
        return (
          <SafeAreaView style={styles.container}>
                <Text style={styles.heading}>{businessData.name}</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Dirección</Text>
                    <Text style={styles.text}>{businessData.direccion}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Horarios</Text>
                    {businessData.horarios && Array.isArray(businessData.horarios) ? (
                        businessData.horarios.map((horario, index) => (
                            <View key={index} style={styles.horarioContainer}>
                                <Text style={styles.horarioText}>{`Inicio ${horario.inicio}`}</Text>
                                <Text style={styles.horarioText}>{`Fin ${horario.fin}`}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.text}>No hay horarios disponibles.</Text>
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Teléfono:</Text>
                    <Text style={styles.text}>{businessData.phone}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Cantidad de sillas:</Text>
                    <Text style={styles.text}>{businessData.sillas}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f08080',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 20,
        color: 'white',
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    text: {
        fontSize: 16,
        color: 'white',
    },
    horarioContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    horarioText: {
        fontSize: 16,
        color: 'black',
        borderEndColor: 'black',
    },
    editButton: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 20,
        // alignSelf: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f08080',
        textAlign: 'center',
    },
});

export default BusinessInfoScreen;
