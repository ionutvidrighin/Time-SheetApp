import { createUserWithEmailAndPassword } from 'firebase/auth'

const createNewAccount = async (auth, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    console.log(response)
  } catch(error) {
    console.log(error)
  }
}

export { createNewAccount }