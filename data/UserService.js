import { db } from '../firebase';
import { getDoc, doc, getDocs, collection, Timestamp } from 'firebase/firestore';

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
            fecha : Timestamp.fromMillis(reservaInfo.get('fecha').seconds * 1000 + reservaInfo.get('fecha').nanoseconds / 1000000).toDate().toLocaleDateString(),
            hora : Timestamp.fromMillis(reservaInfo.get('fecha').seconds * 1000 + reservaInfo.get('fecha').nanoseconds / 1000000).toDate().toLocaleTimeString(),
            phone : user.get('phone'),
            peluqueria: (await getDoc(doc(db, 'Peluquerias', reservaInfo.get('peluqueria').id))).data()
        }
        reservas.push(reserva)
    }
    return reservas;
}

const UserService = {
    getUserInfo,
    getReservationsForUser
}

export default UserService;