import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { lojaId } = req.body;

  if (!lojaId) {
    return res.status(400).json({ message: "ID da loja não fornecido" });
  }

  try {
    const viewsRef = collection(db, "lojas", lojaId, "views");
    await addDoc(viewsRef, {
      timestamp: serverTimestamp(),
      userAgent: req.headers["user-agent"] || "desconhecido",
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    res.status(500).json({ message: "Erro interno" });
  }
}
