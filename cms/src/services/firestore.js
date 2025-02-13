import {auth, db,firebaseConfig} from "./firebase";
import {  
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where,
  getDoc, 
  setDoc
} from "firebase/firestore";
import { createUserWithEmailAndPassword ,getAuth,signOut} from "firebase/auth";

import { initializeApp } from "firebase/app";

// Crie uma instância secundária do Firebase App
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);
/**
 * Cria um colaborador vinculando a autenticação do Firebase e o Firestore.
 *
 * @param {Object} colaborador - Os dados do colaborador (ex: nome, email, cargo, etc.).
 * @param {string} senhaPadrao - A senha padrão para o novo usuário.
 * @returns {Promise<Object>} - Objeto contendo o status, mensagem e o uid do colaborador criado.
 */
export const createColaboradorWithAuth = async (colaborador, senhaPadrao) => {
  try {
    // Crie o usuário no Firebase Authentication usando a instância secundária
    const { user } = await createUserWithEmailAndPassword(secondaryAuth, colaborador.email, senhaPadrao);

    // Utilize o uid do usuário para criar o documento no Firestore
    await setDoc(doc(db, "employes", user.uid), {
      ...colaborador,
      createdAt: new Date(),
      ativo: colaborador.ativo !== undefined ? colaborador.ativo : true,
      permissoes: Array.isArray(colaborador.permissoes) ? colaborador.permissoes : []
    });

    // Após criar o usuário, deslogue da instância secundária para não afetar a sessão principal
    await signOut(secondaryAuth);

    return { success: true, message: "Colaborador criado com sucesso!", id: user.uid };
  } catch (error) {
    return { success: false, message: `Erro ao criar colaborador: ${error.message}` };
  }
};


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

// 📌 Listar reservas de um usuário específico
export const getReservations = async (userId) => {
  try {
    const q = query(reservationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao listar reservas: ", error);
    return [];
  }
};

// 📌 Atualizar uma reserva
export const updateReservation = async (reservationId, updatedData) => {
  try {
    const reservationRef = doc(db, "reservations", reservationId);
    await updateDoc(reservationRef, updatedData);
    console.log("Reserva atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar reserva: ", error);
  }
};

// 📌 Excluir uma reserva
export const deleteReservation = async (reservationId) => {
  try {
    await deleteDoc(doc(db, "reservations", reservationId));
    console.log("Reserva excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir reserva: ", error);
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

// Atualizar conteúdo de uma página
export const updatePageContent = async (page, content) => {
  try {
    const docRef = doc(db, "pages", page); // Referência ao documento
    await setDoc(docRef, content, { merge: true }); // Atualiza ou mescla com dados existentes
    console.log(`Página "${page}" atualizada com sucesso!`);
  } catch (error) {
    console.error("Erro ao atualizar a página:", error);
  }
};

const messagesRef = collection(db, "messages");

export const getAllMessages = async () => {
  try {
    const querySnapshot = await getDocs(query(messagesRef));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao listar reservas: ", error);
    return [];
  }
};

export const getMessages = async (userId) => {
  try {
    const q = query(messagesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao listar reservas: ", error);
    return [];
  }
};

export const updateMessages = async (messageId, updatedData) => {
  try {
    const reservationRef = doc(db, "messages", messageId);
    await updateDoc(reservationRef, updatedData);
    console.log("Reserva atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar reserva: ", error);
  }
};

export const deleteMessages = async (messageId) => {
  try {
    await deleteDoc(doc(db, "messages", messageId));
    console.log("Reserva excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir reserva: ", error);
  }
};

// Definimos uma referência fixa para o documento de identidade.
const identityDocRef = doc(db, "identity", "config");

export const createIdentity = async (identityData) => {
  try {
    // Cria ou sobrescreve o documento de identidade com os dados passados.
    await setDoc(identityDocRef, identityData);
    console.log("Identidade criada com sucesso!");
    return identityDocRef.id; // Retorna "config"
  } catch (error) {
    console.error("Erro ao criar identidade:", error);
    throw error;
  }
};

export const getIdentity = async () => {
  try {
    const docSnap = await getDoc(identityDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Erro ao buscar identidade:", error);
    return null;
  }
};

export const updateIdentity = async (updatedData) => {
  try {
    console.log(updatedData)
    await updateDoc(identityDocRef, updatedData);
    console.log("Identidade atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar identidade:", error);
    throw error;
  }
};

export const deleteIdentity = async () => {
  try {
    await deleteDoc(identityDocRef);
    console.log("Identidade excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir identidade:", error);
    throw error;
  }
};

export const getLogo = async () => {
  try {
    const data = await getDoc(identityDocRef);
    return data.data().logoUrl;
  } catch (error) {
    console.error("Erro ao buscar logo:", error);
    return null;
  }
};
// 📌 Criar um novo produto no Firestore
export const createProduto = async (produto) => {
  try {
    const docRef = await addDoc(collection(db, "products"), produto);
    return { success: true, message: "Produto criado com sucesso!", id: docRef.id };
  } catch (error) {
    return { success: false, message: `Erro ao adicionar produto: ${error.message}` };
  }
};

// 📌 Buscar todos os produtos
export const getProdutos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      return []; // Retorna um array vazio se não houver produtos
    }
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};


// 📌 Atualizar um produto
export const updateProduto = async (produtoId, updatedProduto) => {
  try {
    await updateDoc(doc(db, "products", produtoId), updatedProduto);
    return { success: true, message: "Produto atualizado com sucesso!" };
  } catch (error) {
    return { success: false, message: `Erro ao atualizar produto: ${error.message}` };
  }
};

// 📌 Excluir um produto
export const deleteProduto = async (produtoId) => {
  try {
    await deleteDoc(doc(db, "products", produtoId));
    return { success: true, message: "Produto excluído com sucesso!" };
  } catch (error) {
    return { success: false, message: `Erro ao excluir produto: ${error.message}` };
  }
};

export const adicionarProduto = async (produto) => {
  try {
    const docRef = await addDoc(collection(db, "products"), produto);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
};

// Buscar detalhes do produto por ID
export const getProdutoById = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};


const colaboradoresRef = collection(db, "employes");

export const createColaborador = async (colaborador) => {
  try {
    const docRef = await addDoc(colaboradoresRef, colaborador);
    return { success: true, message: "Colaborador criado com sucesso!", id: docRef.id };
  }catch(error){
    return { success: false, message: `Erro ao adicionar colaborador: ${error.message}` };
  }
};

export const updateColaborador = async (colaboradorId, updatedColaborador) => {
  try {
    await updateDoc(doc(colaboradoresRef, colaboradorId), updatedColaborador);
    return { success: true, message: "Colaborador atualizado com sucesso!" };
  } catch (error) {
    console.log(error)
    return { success: false, message: `Erro ao atualizar colaborador: ${error.message}` };
  }
};

export const getColaboradores = async () => {
  try {
    const querySnapshot = await getDocs(colaboradoresRef);
    if (querySnapshot.empty) {
      return []; 
    }
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return []; 
  }
};

///revisar para deixar oculto e criptografar dados sensíveis 
export const deleteColaborador = async (colaboradorId) => {
  try {
    await deleteDoc(doc(db, "employes", colaboradorId));
    return { success: true, message: "Colaborador excluído com sucesso!" };
  } catch (error) {
    return { success: false, message: `Erro ao excluir colaborador: ${error.message}` };
  }
};

export const getColaboradorById = async (id) => {
  const docRef = doc(db, "employes", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const getAcessos = async () => {
  try {
    const querySnapshot = await getDocs(colaboradoresRef);
    const acessosList = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((acesso) => Array.isArray(acesso.permissoes) && acesso.permissoes.length > 0);

    return acessosList;
  } catch (error) {
    console.error("Erro ao buscar acessos:", error);
    return [];
  }
};
