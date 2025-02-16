import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaSave } from "react-icons/fa";

const NovaSenhaModal = ({ onSave, isSaving }) => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    // Validação dos campos
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setError("Preencha todos os campos!");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setError("A nova senha e a confirmação devem ser iguais!");
      return;
    }
    setError("");
    // Chama a função de salvar passando os dados necessários
    onSave({ senhaAtual, novaSenha });
  };

  return (
  
      <div >
        <div >
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group mb-2">
            <label htmlFor="senhaAtual">Senha Atual</label>
            <input
              type="password"
              id="senhaAtual"
              className="form-control"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="novaSenha">Nova Senha</label>
            <input
              type="password"
              id="novaSenha"
              className="form-control"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              className="form-control"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : <><FaSave /> Salvar</>}
          </button>
      </div>
    </div>
  );
};

export default NovaSenhaModal;
