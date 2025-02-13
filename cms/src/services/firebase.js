import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Auth
const auth = getAuth(app);

// Inicialize o Firestore
const db = getFirestore(app);

// Configura o provedor de autenticação do Google
const googleProvider = new GoogleAuthProvider();

// Configura a persistência de autenticação
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // console.log("Persistência de autenticação configurada com sucesso.");
  })
  .catch((error) => {
    // console.error("Erro ao configurar persistência de autenticação:", error);
  });

// Exporte os módulos necessários
export { auth, googleProvider, db,firebaseConfig };