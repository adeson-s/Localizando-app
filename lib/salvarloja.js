import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function salvarLoja(form) {
  if (!form.logoFile && !form.logoUrl) {
    throw new Error("Por favor, envie a logo da loja antes de salvar.");
  }

  let logoUrl = form.logoUrl || "";
  if (form.logoFile) {
    const storage = getStorage();
    const fileRef = ref(storage, `logos/${form.storeSlug}/${form.logoFile.name}-${Date.now()}`);
    await uploadBytes(fileRef, form.logoFile);
    logoUrl = await getDownloadURL(fileRef);
  }

  // Cria referência nova de documento na coleção lojas
  const storeRef = doc(collection(db, "lojas"));
  const storeId = storeRef.id;

  const { logoFile, logoPreview, ...dadosParaSalvar } = form;

  // Dados da loja para salvar no Firestore
  const lojaData = {
    storeId,
    name: dadosParaSalvar.name,
    storeName: dadosParaSalvar.storeName,
    desc: dadosParaSalvar.desc,
    category: dadosParaSalvar.category,
    tags: dadosParaSalvar.tags || [],
    whatsapp: dadosParaSalvar.whatsapp,
    instagram: dadosParaSalvar.instagram || "",
    facebook: dadosParaSalvar.facebook || "",
    website: dadosParaSalvar.website || "",
    phone: dadosParaSalvar.phone || "",
    logoUrl,
    address: dadosParaSalvar.address,
    neighborhood: dadosParaSalvar.neighborhood,
    city: dadosParaSalvar.city,
    state: dadosParaSalvar.state,
    zipCode: dadosParaSalvar.zipCode,
    lat: dadosParaSalvar.lat,
    lng: dadosParaSalvar.lng,
    schedule: dadosParaSalvar.schedule,
    cnpj: dadosParaSalvar.cnpj || "",
    businessLicense: dadosParaSalvar.businessLicense || "",
    createdAt: new Date(),
  };

  // Salva a loja
  await setDoc(storeRef, lojaData);

  // Atualiza o usuário: seta storeId e isLojista true
  if (form.uid) {
    await setDoc(
      doc(db, "users", form.uid),
      { storeId, isLojista: true, name, },
      { merge: true }
    );
  }

  return true;
}
