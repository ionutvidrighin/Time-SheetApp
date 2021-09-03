import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAnrIENxkP9ZcXUIKJop9NyD1zUijdxQsM",
  authDomain: "pontaj-1d47f.firebaseapp.com",
  projectId: "pontaj-1d47f",
  storageBucket: "pontaj-1d47f.appspot.com",
  messagingSenderId: "346948874249",
  appId: "1:346948874249:web:d2b197a6e2a6f34cd8c8d8",
  measurementId: "G-3WDKPR0BLK"
};

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const dataBase = getFirestore(firebaseApp)

export { auth, dataBase }
