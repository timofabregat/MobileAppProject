import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

const getUserInfo = (uid) => {
    const user = getDoc(doc(db, 'Users', uid));
    return user;
}

const getReservationsForUser = (uid) => {
    const user = getDoc(doc(db, 'Users', uid));
    return user;
}

const UserService = {
    getUserInfo
}

export default UserService;