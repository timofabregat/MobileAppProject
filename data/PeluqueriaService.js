import { db } from "../firebase";
import { getDoc, doc, getDocs, collection, setDoc, where, query } from 'firebase/firestore';
import UserService from "./UserService";

export const createPeluqueria = async (uid, data) => {
    const peluqueriasRef = collection(db, 'Peluquerias')
    console.log('Peluquerias ref:', peluqueriasRef)
    const peluqueriaRef = doc(peluqueriasRef)
    console.log('Peluqueria ref:', peluqueriaRef)
    await setDoc(peluqueriaRef, data)
    const userRef = doc(db, 'Users', uid)
    console.log('User ref:', userRef)
    // update user document with new peluqueria
    await setDoc(userRef, { peluqueria: peluqueriaRef }, { merge: true })
    return peluqueriaRef
}

const getReservationsForPeluqueria = async (uid) => {
    const peluqueria = await UserService.getPeluqueriaInfo(uid)
    const reservasRef = collection(db, 'Reservas')
    const reservasQuery = query(reservasRef, where('peluqueria', '==', peluqueria.ref))
    const reservasDocs = (await getDocs(reservasQuery)).docs
    return reservasDocs
}

const getPeluqueriaInfo = async (ref) => {
    const peluqueria = await getDoc(ref)
    return peluqueria
}

const updatePeluqueriaInfo = async (ref, data) => {
    await setDoc(ref, data, { merge: true })
}

PeluqueriaService = {
    createPeluqueria,
    getReservationsForPeluqueria,
    getPeluqueriaInfo,
    updatePeluqueriaInfo
}

export default PeluqueriaService;
