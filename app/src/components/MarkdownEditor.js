import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const MarkdownEditor = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Insere Markdown no cursor
  const insertMarkdown = (markdown) => {
    const textarea = document.getElementById("markdown-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText =
      text.substring(0, start) + markdown + text.substring(end, text.length);

    onChange(newText);
  };

  // Lê um arquivo de texto/Markdown
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="markdown-editor">
      {/* Toolbar */}
      <div className="d-flex gap-2 mb-2">
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("# ")}>
          H1
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("## ")}>
          H2
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("### ")}>
          H3
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("**texto**")}>
          <b>B</b>
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("_texto_")}>
          <i>I</i>
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("- ")}>
          Lista
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => insertMarkdown("> ")}>
          Citação
        </button>
        <input
          type="file"
          accept=".md,.txt"
          className="form-control form-control-sm"
          onChange={handleFileUpload}
        />
        <button className="btn btn-primary btn-sm" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Editar" : "Prévia"}
        </button>
      </div>

      {/* Área de Edição ou Pré-Visualização */}
      {!showPreview ? (
        <textarea
          id="markdown-textarea"
          className="form-control"
          placeholder="Digite em Markdown..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onDoubleClick={() => setShowModal(true)}
        />
      ) : (
        <div className="border p-3 bg-light">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      )}

      {/* Modal para Exibir o Markdown em Tela Cheia */}
      <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Visualizar Markdown</h5>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay do Modal */}
      {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
    </div>
  );
};

export default MarkdownEditor;
