import { db } from "./firebase";
import {  
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  serverTimestamp, 
  query, 
  where,
  getDoc, 
} from "firebase/firestore";

const reservationsRef = collection(db, "reservations");

// 📌 Criar uma nova reserva garantindo que todos os campos obrigatórios estão preenchidos
export const createReservation = async (reservationData) => {
  try {
    // 📌 Validação dos campos obrigatórios
    if (!reservationData.name || !reservationData.email || !reservationData.phone) {
      throw new Error("Nome, e-mail e telefone são obrigatórios.");
    }
    if (!reservationData.startDate || !reservationData.endDate) {
      throw new Error("Datas de início e fim são obrigatórias.");
    }

    // 📌 Salvar os timestamps corretamente
    const docRef = await addDoc(reservationsRef, {
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      startDate: reservationData.startDate, // Deve ser um timestamp válido
      endDate: reservationData.endDate, // Deve ser um timestamp válido
      confirmed: false, // Começa como não confirmada
      createdAt: serverTimestamp(),
    });

    console.log("Reserva criada com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar reserva:", error);
    throw error; // Relançar erro para capturar na interface
  }
};

// 📌 Listar todas as reservas
export const getAllReservations = async () => {
  try {
    const querySnapshot = await getDocs(query(reservationsRef));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao listar reservas: ", error);
    return [];
  }
};

// 📌 Buscar todas as reservas confirmadas e gerar lista de datas bloqueadas
export const getConfirmedReservations = async () => {
  try {
    const q = query(reservationsRef, where("confirmed", "==", true));
    const querySnapshot = await getDocs(q);

    let blockedDates = [];
    
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.startDate && data.endDate) {
        const start = data.startDate.toDate();
        const end = data.endDate.toDate();
        
        // 📌 Gerar todas as datas entre startDate e endDate
        let currentDate = new Date(start);
        while (currentDate <= end) {
          blockedDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1); // Incrementa um dia
        }
      }
    });

    return blockedDates;
  } catch (error) {
    console.error("Erro ao buscar reservas confirmadas:", error);
    return [];
  }
};
// Buscar conteúdo de uma página
export const getPageContent = async (page) => {
  try {
    const docRef = doc(db, "pages", page); // Referência ao documento
    const docSnap = await getDoc(docRef); // Obtém o documento

    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Erro ao buscar conteúdo da página:", error);
    return null;
  }
};

const contactsRef = collection(db, "messages"); // Coleção para contatos

// 📌 Criar um novo contato
export const createContact = async (contactData) => {
  try {
    // 📌 Validação dos campos obrigatórios
    if (!contactData.name || !contactData.email || !contactData.message) {
      throw new Error("Nome, e-mail e mensagem são obrigatórios.");
    }

    // 📌 Salvar os dados no Firestore
    const docRef = await addDoc(contactsRef, {
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
      createdAt: serverTimestamp(), // Adiciona a data/hora do envio
    });

    console.log("Contato salvo com ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar contato:", error);
    throw error; // Relançar erro para capturar na interface
  }
};