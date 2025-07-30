
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyB84TgY0T0g8pmVuqSY24kEH0x9wIws7t0",

  authDomain: "localizando-e708c.firebaseapp.com",

  projectId: "localizando-e708c",

  storageBucket: "localizando-e708c.firebasestorage.app",

  messagingSenderId: "116503674969",

  appId: "1:116503674969:web:2722971d15a488a52c7148",

  measurementId: "G-44M1GMVLCC"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// Função para registrar com Email
export const registerWithEmail = async ({ name, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Se necessário, podemos atualizar o nome do usuário aqui
  await user.updateProfile({ displayName: name });
  return user;
};

// Função para login com Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Função de tradução de erro do Firebase
export const translateFirebaseError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este e-mail já está em uso.";
    case "auth/invalid-email":
      return "O e-mail fornecido é inválido.";
    case "auth/operation-not-allowed":
      return "Operação não permitida.";
    case "auth/weak-password":
      return "A senha precisa ter no mínimo 6 caracteres.";
    default:
      return "Erro desconhecido, por favor tente novamente.";
  }
};

export { auth, googleProvider };
