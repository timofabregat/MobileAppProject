import { db, getDocument, newDocRef, auth, setDocData, getCollectionRef, getDocuments, queryDocuments, whereCondition, newDoc} from '../firebase';
import moment from 'moment';
import 'moment-timezone';


const getReservaInfo = async (id) => {
    const reserva = await getDocument(newDocRef(db, 'Reservas', reserva));
    return reserva;
}

const createReserva = async (date, time, peluqueria, userId) => {
    const newReservation = {
        peluqueria: newDocRef(db, 'Peluquerias', peluqueria.id),
        fecha: moment(date).hour(parseInt(time.slice(0, 2), 10))
        .minute(parseInt(time.slice(3, 5), 10))
        .second(0)
        .toDate(),
        lugares: peluqueria.data().sillas - 1,
        users: [newDocRef(db, 'Users', userId)],
    };

    const reservationRef = await newDoc(getCollectionRef(db, 'Reservas'), newReservation);
    console.log('Reservation created successfully!', reservationRef.id);
    return newDocRef(db, 'Reservas', reservationRef.id);
    
}

const updateReserva = async (existingReservation) => {
    const updatedLugaresDisponibles = existingReservation.data().lugares - 1
    reservaUsers = existingReservation.data().users
    console.log(existingReservation.data().users)
    reservaUsers.push(newDocRef(db, 'Users', auth.currentUser.uid));
    reserva = newDocRef(db, 'Reservas', existingReservation.id)
    await setDocData(reserva,{lugares: updatedLugaresDisponibles, users: reservaUsers}, {merge: true})  
    return reserva
}

const getReservaOrNull = async (date, time, peluqueria) => {
    const peluqueriaRef = newDocRef(db, 'Peluquerias', peluqueria.id)
    const q = queryDocuments(getCollectionRef(db, 'Reservas'), 
                whereCondition('peluqueria', '==', peluqueriaRef),
                whereCondition('fecha', '==', moment(date).hour(parseInt(time.slice(0, 2), 10))
                        .minute(parseInt(time.slice(3, 5), 10))
                        .second(0)
                        .toDate()),
                )

    let querySnapshot2 = null
    if(!q.empty){
        const querySnapshot = await getDocuments(q);
        querySnapshot.forEach(doc => {querySnapshot2 = doc})
        querySnapshot.forEach(doc => {console.log(doc.data())})
    }

    return querySnapshot2;
}

const ReservaService = {
    getReservaInfo,
    createReserva,
    updateReserva,
    getReservaOrNull
}

export default ReservaService;