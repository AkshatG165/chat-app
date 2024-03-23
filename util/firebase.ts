import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD95wEk7tUdXNgi4yiU4GVGIaM9o-Cyfmg',
  authDomain: 'chat-app-e3910.firebaseapp.com',
  projectId: 'chat-app-e3910',
  storageBucket: 'chat-app-e3910.appspot.com',
  messagingSenderId: '676875878460',
  appId: '1:676875878460:web:cbcc2959e7f97cb7274339',
  measurementId: 'G-CTS8BRN79J',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);
