import React from "react";
import { FaTrash } from "react-icons/fa";
import ImageWithModal from "../ImageModal";

/**
 * ProdutoModal component renders a modal for adding or editing a product.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {Function} props.onClose - Function to call when closing the modal.
 * @param {Function} props.onSave - Function to call when saving the product.
 * @param {Object} props.produto - The product object containing its details.
 * @param {Function} props.handleChange - Function to handle changes in the product fields.
 * @param {boolean} props.isSaving - Indicates if the product is currently being saved.
 * @param {boolean} props.isUploading - Indicates if an image is currently being uploaded.
 * @param {Function} props.handleImageUpload - Function to handle image upload.
 * @param {Function} props.handleDeleteImage - Function to handle image deletion.
 * @returns {JSX.Element|null} The rendered modal component or null if not open.
 */
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
    <div className="modal fade show d-block" tabIndex="-1">
      
    <div className="modal-dialog">
      <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{produto.nome!== "" ? "Editar Produto" : "Adicionar Produto"}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
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
             <div className="modal-footer modal-buttons">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutoModal;
