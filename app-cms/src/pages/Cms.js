import React, { useState, useEffect } from "react";
import { db } from "../services/firebase"; // Importa a configuração do Firebase
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

function CMS() {
  const [pages, setPages] = useState([]);
  const [newPage, setNewPage] = useState({ title: "", slug: "", content: "" });

  // Buscar páginas no Firestore
  useEffect(() => {
    const fetchPages = async () => {
      const querySnapshot = await getDocs(collection(db, "app-pages"));
      setPages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPages();
  }, []);

  // Adicionar nova página
  const addPage = async () => {
    await addDoc(collection(db, "app-pages"), newPage);
    setNewPage({ title: "", slug: "", content: "" });
  };

  // Atualizar página
  const updatePage = async (id, updatedContent) => {
    const pageRef = doc(db, "app-pages", id);
    await updateDoc(pageRef, updatedContent);
  };

  // Excluir página
  const deletePage = async (id) => {
    await deleteDoc(doc(db, "app-pages", id));
  };

  return (
    <div>
      <h1>CMS - Gerenciamento de Páginas</h1>
      <input type="text" placeholder="Título" value={newPage.title} onChange={e => setNewPage({ ...newPage, title: e.target.value })} />
      <input type="text" placeholder="Slug" value={newPage.slug} onChange={e => setNewPage({ ...newPage, slug: e.target.value })} />
      <textarea placeholder="Conteúdo" value={newPage.content} onChange={e => setNewPage({ ...newPage, content: e.target.value })}></textarea>
      <button onClick={addPage}>Adicionar Página</button>

      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <h2>{page.title}</h2>
            <p>{page.content}</p>
            <button onClick={() => updatePage(page.id, { content: "Novo Conteúdo" })}>Editar</button>
            <button onClick={() => deletePage(page.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CMS;
