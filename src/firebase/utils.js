import { auth } from './index'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


async function makeRequest(method, auth, email, pass) {
  const response = await method(auth, email, pass)
  return response
}

export default {
  createNewAccount: (email, pass) => makeRequest(createUserWithEmailAndPassword, auth, email, pass),
  loginUser: (email, pass) => makeRequest(signInWithEmailAndPassword, auth, email, pass)
}