import React, { useEffect, useState } from "react";
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { getIdentity } from "../services/firestore";

const AuthPage = () => {
  const navigate = useNavigate();
  const [identityConfig, setIdentityConfig] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/cms');
    } catch (error) {
      setError('Erro ao autenticar com o Google. Tente novamente.');
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/cms');
    } catch (error) {
      setError('Erro ao autenticar. Verifique seu email e senha.');
    }
  };

  useEffect(() => {
    const fetchIdentity = async () => {
      const data = await getIdentity();
      if (data) {
        setIdentityConfig(data);
      }
    };
    fetchIdentity();
  }, []);

  const logo = identityConfig?.logoUrl;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <img src={logo} alt="logo" />
          <h1>{identityConfig?.brandName.toUpperCase() || "SUA EMPRESA"}</h1>
          <p>{identityConfig?.brandSlogan}</p>
        </div>

        {/* Formulário de Login com Email e Senha */}
        <form onSubmit={handleEmailSignIn} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="email-sign-in-button">
            Entrar com Email
          </button>
        </form>

        {/* Divisor ou Texto "OU" */}
        <div className="divider">
          <span>OU</span>
        </div>

        {/* Botão de Login com Google */}
        <button onClick={handleGoogleSignIn} className="google-sign-in-button">
          <FaGoogle /> Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;