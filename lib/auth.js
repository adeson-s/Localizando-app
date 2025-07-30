// lib/auth.js
export async function signInWithEmail(email, password, isLojista = false) {
  // Trocar por requisição ao backend / Firebase.
  await wait();
  if (!email || !password) throw new Error("Credenciais inválidas");
  return {
    uid: "123",
    email,
    role: isLojista ? "lojista" : "user",
    name: isLojista ? "Lojista" : "Usuário",
  };
}

export async function registerWithEmail({ name, email, password }) {
  await wait();
  if (!name || !email || !password) throw new Error("Dados inválidos");
  return { uid: "456", email, role: "user", name };
}

export async function signInWithGoogle() {
  await wait();
  return {
    uid: "789",
    email: "google@example.com",
    role: "user",
    name: "Google User",
  };
}

export async function registerStore(payload) {
  await wait();
  if (!payload?.storeName) throw new Error("Informe o nome da loja");
  return { id: "store_1", ...payload };
}

export async function signInAsGuest() {
  await wait(400);
  return { uid: "guest", role: "guest", name: "Convidado" };
}

function wait(ms = 700) {
  return new Promise((r) => setTimeout(r, ms));
}
