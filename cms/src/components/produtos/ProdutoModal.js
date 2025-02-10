import React from "react";
import { FaTrash } from "react-icons/fa";
import ImageWithModal from "../ImageModal";

const ProdutoModal = ({
  isOpen,
  onClose,
  onSave,
  produto,
  handleChange,
  isSaving,
  isUploading,
  handleImageUpload,
  handleDeleteImage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="produto-modal-overlay">
      <div className="produto-modal">
        <h2>Adicionar Produto</h2>
        <form>
          <div className="form-group">
            <label htmlFor="produtoNome">Nome</label>
            <input
              type="text"
              id="produtoNome"
              name="nome"
              className="form-control"
              value={produto.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="produtoDescricao">Descrição</label>
            <textarea
              id="produtoDescricao"
              name="descricao"
              className="form-control"
              value={produto.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="produtoPreco">Preço</label>
            <input
              type="number"
              id="produtoPreco"
              name="preco"
              className="form-control"
              value={produto.preco}
              onChange={(e) => handleChange("preco", parseFloat(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="produtoImagem">Imagem</label>
            <input
              type="file"
              id="produtoImagem"
              className="form-control"
              onChange={handleImageUpload}
              disabled={isUploading || isSaving}
            />
           {produto.imagens && produto.imagens.length > 0 && (
                <div className="image-content">
                    {produto.imagens.map((img, index) => (
                    <div key={index} className="image-preview">
                        <ImageWithModal imageUrl={img} altText={`Imagem ${index + 1}`} />
                        <button
                            type="button"
                            className="btn btn-danger btn-sm mt-2"
                            onClick={() => handleDeleteImage(img)}
                            disabled={isUploading || isSaving}
                        >
                        <FaTrash />
                        </button>
                    </div>
                    ))}
                </div>
                )}

          </div>
          <div className="modal-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoModal;
