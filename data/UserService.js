import { db } from '../firebase';
import { getDoc, doc, getDocs, collection, Timestamp, setDoc, addDoc } from 'firebase/firestore';

const getUserInfo = async (uid) => {
    const user = await getDoc(doc(db, 'Users', uid));
    return user;
}

const getReservationsForUser = async (uid) => {
    const user = await getUserInfo(uid)
    // get the reservas array from user document
    const reservas_raw = user.get('reservas')
    const reservas = []
    for (let reserva of reservas_raw) {
        const reservaInfo = await getDoc(doc(db, 'Reservas', reserva.id))
        reserva = {
            id : reservaInfo.id,
            fecha : Timestamp.fromMillis(reservaInfo.get('fecha').seconds * 1000 + reservaInfo.get('fecha').nanoseconds / 1000000).toDate().toLocaleDateString(),
            hora : Timestamp.fromMillis(reservaInfo.get('fecha').seconds * 1000 + reservaInfo.get('fecha').nanoseconds / 1000000).toDate().toLocaleTimeString(),
            phone : user.get('phone'),
            peluqueria: (await getDoc(doc(db, 'Peluquerias', reservaInfo.get('peluqueria').id))).data()
        }
        reservas.push(reserva)
    }
    return reservas;
}

const assignReservationToUser = async (uid, reservaRef) => {
    const user = doc(db, 'Users', uid)
    console.log(user)
    console.log(user.reservas)
    if (user.reservas){
        await addDoc(user,{reservas: reservaRef}, {merge: true})
    }else{
        await setDoc(user,{reservas: reservaRef}, {merge: true})
    }
    
}

const UserService = {
    getUserInfo,
    getReservationsForUser,
    assignReservationToUser
}

export default UserService;