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

const cancelUserReservation = async (uid, reserva) => {
    const reservaRef =  await getDoc(doc(db, 'Reservas', reserva.id))
    user = doc(db, 'Users', uid)
    const userSnapshot = await getDoc(user)
    const userReservas = userSnapshot.get('reservas')
    let i
    userReservas.forEach((userReserva, index) => {
        console.log(userReserva.path + ' ' + index);
        if(userReserva.id == reservaRef.id){
            i = index
            console.log(i)
        }
    })
    userReservas.splice(i,1)
    await setDoc(user,{reservas: userReservas}, {merge: true})
    console.log('Reserva Eliminada del Usuario ', uid)
}

const assignReservationToUser = async (uid, reservaRef) => {
    const user = doc(db, 'Users', uid)
    const userSnapshot = await getDoc(user)
    const userReservas = userSnapshot.data().reservas || [];
    userReservas.push(reservaRef);
    await setDoc(user,{reservas: userReservas}, {merge: true})
    console.log('Reserva Asignada al Usuario ', uid)
}

const updatePhone = async (uid, newPhone) => {
    const userRef = doc(db, 'Users', uid);
    const userSnapshot = await getDoc(userRef);
    const currentPhone = userSnapshot.get('phone');
  
    if (currentPhone === newPhone) {
      // No changes needed if the new phone is the same as the current phone
      return
    }
  
    console.log('Phone number updated successfully.');
    // Update the phone number in the user document
    return await setDoc(userRef, { phone: newPhone }, { merge: true });
  
  };

const UserService = {
    getUserInfo,
    getReservationsForUser,
    getPeluqueriaInfo,
    getUserType,
    cancelUserReservation,
    assignReservationToUser,
    updatePhone
}

export default UserService;