import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; // ajuste o caminho conforme seu projeto

export async function registerStoreReal(formData) {
  const loja = {
    ...formData,
    createdAt: serverTimestamp(),
    status: "pendente", // status da loja para análise
  };

  const docRef = await addDoc(collection(db, "lojas"), loja);
  return docRef.id;
}
