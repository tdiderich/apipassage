import { firebaseConfig } from '../secrets/firebase';
import firebase from 'firebase/compat/app';

export const app = firebase.initializeApp(firebaseConfig);
