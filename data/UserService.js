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

const getPeluqueriaInfo = async (uid) => {
    const user = await getUserInfo(uid)
    const peluqueriaRef = user.get('peluqueria')
    const peluqueria = await getDoc(peluqueriaRef)
    return peluqueria;
}

const getUserType = async (uid) => {
    const user = await getUserInfo(uid)
    if (user.get('isPeluqueria') === false) {
        return 'user'
    } else {
        if (user.get('peluqueria') === undefined) {
            return 'peluqueriaFirstTime'
        } else {
            return 'peluqueria'
        }
    }
}

const UserService = {
    getUserInfo,
    getReservationsForUser,
    getPeluqueriaInfo,
    getUserType
}

export default UserService;