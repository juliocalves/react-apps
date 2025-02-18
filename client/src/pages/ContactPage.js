import React, { useState,useEffect } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { createContact } from '../services/firestore'; // Importe a função de criação de contato
import { getPageContent } from "../services/firestore";
/**
 * ContactPage component renders a contact form and handles form submission.
 * 
 * @component
 * @example
 * return (
 *   <ContactPage />
 * )
 * 
 * @returns {JSX.Element} The rendered ContactPage component.
 * 
 * @description
 * This component fetches content for the contact page, displays a form for users to fill out their name, email, and message, and handles form submission by saving the data to Firestore.
 * 
 * @function
 * @name ContactPage
 * 
 * @property {Object} formData - The state object containing form data.
 * @property {string} formData.name - The name entered by the user.
 * @property {string} formData.email - The email entered by the user.
 * @property {string} formData.message - The message entered by the user.
 * 
 * @property {Object} content - The state object containing page content.
 * @property {string} content.title - The title of the contact page.
 * @property {string} content.description - The description of the contact page.
 * 
 * @function handleChange
 * @description Handles changes to the form inputs and updates the formData state.
 * @param {Object} e - The event object.
 * 
 * @function handleSubmit
 * @description Handles form submission, saves data to Firestore, and displays success or error messages.
 * @param {Object} e - The event object.
 * 
 * @function fetchContent
 * @description Fetches content for the contact page from the server.
 * 
 * @requires useState
 * @requires useEffect
 * @requires getPageContent
 * @requires createContact
 * @requires PublicLayout
 */
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [content, setContent] = useState({
      title: "",
      description: "",
    });
  ///para usar mardkdown
  //const description = content.description;
  
  useEffect(() => {
    const fetchContent = async () => {
      const aboutContent = await getPageContent("contact");
      if (aboutContent) setContent(aboutContent);
    };

    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Salva os dados no Firestore usando a função createContact
      await createContact(formData);

      // Exibe uma mensagem de sucesso
      alert('Mensagem enviada com sucesso!');

      // Limpa o formulário
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
    }
  };

  return (
    <PublicLayout>
      <div className="contact-page">
        <h1>{content.title || "Contato"}</h1>
        <p>{content.description || "Entre em contato conosco para dúvidas, sugestões ou agendamentos."}</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder='Nome'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              id="message"
              name="message"
              placeholder='Mensagem'
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Enviar Mensagem
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;