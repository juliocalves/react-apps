// src/pages/ContactPage.js
import React, { useState } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { createContact } from '../services/firestore'; // Importe a função de criação de contato

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
        <h1>Contato</h1>
        <p>Entre em contato conosco para dúvidas, sugestões ou agendamentos.</p>

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