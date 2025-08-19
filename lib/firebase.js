import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB84TgY0T0g8pmVuqSY24kEH0x9wIws7t0",
  authDomain: "localizando-e708c.firebaseapp.com",
  projectId: "localizando-e708c",
  storageBucket: "localizando-e708c.appspot.com", // corrigi aqui
  messagingSenderId: "116503674969",
  appId: "1:116503674969:web:2722971d15a488a52c7148",
  measurementId: "G-44M1GMVLCC"
};

// Inicializa o app só uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

async function uploadLogoFile(file) {
  const fileRef = ref(storage, `logos/${file.name}-${Date.now()}`);

  await uploadBytes(fileRef, file);

  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
}

export const registerWithEmail = async ({ name, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await user.updateProfile({ displayName: name });
  return user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user; // retorna só o usuário
};


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

export { auth, googleProvider, db, getDoc, uploadLogoFile, collection, addDoc, doc };
