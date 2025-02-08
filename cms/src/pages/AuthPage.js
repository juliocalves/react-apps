// src/pages/AuthPage.js
import React from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
const AuthPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // Inicia o processo de autenticação com o Google
      await signInWithPopup(auth, googleProvider);
      // Redireciona para a página /cms após o login bem-sucedido
      navigate('/cms');
    } catch (error) {
      // console.error('Erro ao autenticar com o Google:', error);
      alert('Erro ao autenticar. Tente novamente.');
    }
  };

  return (
    <div className="auth-page">
      <div className='card'>
        <div className='card-header'>
          <h1>Autenticação</h1>
        </div>
        <div className='card-body'>
          <p>Por favor, faça login com o Google para acessar o CMS.</p>
          <button onClick={handleGoogleSignIn} className="google-sign-in-button">
            <FaGoogle /> Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;