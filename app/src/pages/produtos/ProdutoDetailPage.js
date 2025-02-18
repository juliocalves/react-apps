import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProdutoById, updateProduto, deleteProduto } from "../../services/firestore";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowLeft, FaTrash, FaSave } from "react-icons/fa";
import ImageWithModal from "../../components/ImageModal";
import { uploadImg, deleteFile } from "../../services/appwrite";
import { MdEdit, MdOutlineCancel } from "react-icons/md";

/**
 * ProdutoDetailPage component renders the detailed view of a product,
 * allowing users to view, edit, delete, and upload images for the product.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <ProdutoDetailPage />
 * 
 * @description
 * This component fetches the product details using the product ID from the URL parameters.
 * It provides functionalities to edit product details, delete the product, and upload images.
 * 
 * @function
 * @name ProdutoDetailPage
 * 
 * @requires useParams
 * @requires useNavigate
 * @requires useState
 * @requires useEffect
 * @requires getProdutoById
 * @requires deleteProduto
 * @requires deleteFile
 * @requires uploadImg
 * @requires updateProduto
 * @requires toast
 * @requires ToastContainer
 * @requires FaArrowLeft
 * @requires FaTrash
 * @requires FaSave
 * @requires MdOutlineCancel
 * @requires MdEdit
 * @requires ImageWithModal
 * 
 * @returns {JSX.Element} The rendered component.
 */
/**
 * ProdutoDetailPage component renders the details of a specific product and allows editing, deleting, and image uploading functionalities.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return <ProdutoDetailPage />
 *
 * @description
 * This component fetches the product details based on the product ID from the URL parameters. It provides functionalities to edit the product details, delete the product, upload images, and delete images. It also handles form input changes and manages the component's state.
 *
 * @function
 * @name ProdutoDetailPage
 *
 * @requires useParams
 * @requires useNavigate
 * @requires useState
 * @requires useEffect
 * @requires toast
 * @requires ToastContainer
 * @requires FaArrowLeft
 * @requires FaTrash
 * @requires FaSave
 * @requires MdOutlineCancel
 * @requires MdEdit
 * @requires getProdutoById
 * @requires deleteProduto
 * @requires deleteFile
 * @requires uploadImg
 * @requires updateProduto
 * @requires ImageWithModal
 */
const ProdutoDetailPage = () => {
  const { produtoId } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [editedProduto, setEditedProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await getProdutoById(produtoId);
        if (data) {
          setProduto(data);
          setEditedProduto(data);
        } else {
          toast.error("Produto não encontrado!");
          navigate("/produtos/catalogo");
        }
      } catch (error) {
        toast.error("Erro ao carregar o produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [produtoId, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduto(produtoId);
        toast.success("Produto excluído com sucesso!");
        navigate("/produtos/catalogo");
      } catch (error) {
        toast.error("Erro ao excluir o produto.");
      }
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      await deleteFile(imageUrl);
      setEditedProduto((prev) => ({
        ...prev,
        imagens: prev.imagens.filter((img) => img !== imageUrl),
      }));
      toast.info("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      toast.error("Erro ao deletar a imagem. Tente novamente.");
    }
  };

  const handleChange = (field, value) => {
    setEditedProduto((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImg(file);
      if (imageUrl) {
        handleChange("imagens", [...(editedProduto.imagens || []), imageUrl]);
        toast.success("Imagem carregada com sucesso!");
      } else {
        throw new Error("URL da imagem não gerada");
      }
    } catch (error) {
      toast.error(`Erro ao fazer upload da imagem. Tente novamente. \n ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProduto.nome || !editedProduto.descricao || !editedProduto.preco) {
      toast.error("Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      await updateProduto(produtoId, editedProduto);
      setProduto(editedProduto);
      setEditing(false);
      toast.success("Produto atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar o produto.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedProduto(produto);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <div className="container card">
      <ToastContainer />
      <div className="card-header">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/produtos/catalogo")}>
          <FaArrowLeft /> Voltar
        </button>
      </div>

      <div className="card-img-top">
        {editedProduto && editedProduto.imagens && editedProduto.imagens.length > 0 && (
          <div className="image-content">
            {editedProduto.imagens.map((img, index) => (
              <div key={index} className="image-preview">
                <ImageWithModal imageUrl={img} altText={`Imagem ${index + 1}`} />
                {editing && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDeleteImage(img)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="form-group">
          <label htmlFor="produtoNome">Nome</label>
          <input
            type="text"
            name="nome"
            value={editedProduto ? editedProduto.nome : ""}
            onChange={(e) => handleChange("nome", e.target.value)}
            disabled={!editing}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="produtoDescricao">Descrição</label>
          <textarea
            name="descricao"
            value={editedProduto ? editedProduto.descricao : ""}
            onChange={(e) => handleChange("descricao", e.target.value)}
            disabled={!editing}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="produtoPreco">Preço</label>
          <div className="input-group mb-3">
            <span className="input-group-text">R$</span>
            <input
              type="number"
              name="preco"
              value={
                editing
                  ? editedProduto.preco
                  : Number(editedProduto.preco).toFixed(2)
              }
              onChange={(e) => handleChange("preco", parseFloat(e.target.value) || 0)}
              disabled={!editing}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="produtoPreco">Preço Promocional</label>
          <div className="input-group mb-3">
            <span className="input-group-text">R$</span>
            <input
              type="number"
              name="precoPromocional"
              value={
                editing
                  ? editedProduto.precoPromocional
                  : Number(editedProduto.precoPromocional).toFixed(2)
              }
              onChange={(e) => handleChange("precoPromocional", parseFloat(e.target.value) || 0)}
              disabled={!editing}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-text">
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  aria-label="Checkbox for following text input"
                  checked={editedProduto.usaEstoque}
                  disabled={!editing}
                  onChange={(e) => handleChange("usaEstoque", e.target.checked)}
                />
              </div>
              <input
                type="text"
                className="form-control"
                readOnly
                aria-label="Text input with checkbox"
                placeholder="Aplica estoque"
              />
            </div>
        </div>

        <div className="form-group">
              <label htmlFor="produtoestoque">Quantidade Estoque</label>
              <input
                type="number"
                id="produtoestoque"
                name="qtdEstoque"
                className="form-control"
                value={
                  editing 
                  ? editedProduto.quantidadeEstoque
                  : Number(editedProduto.quantidadeEstoque)
                }
                disabled={!editing}
                onChange={(e) => handleChange("quantidadeEstoque", parseFloat(e.target.value))}
              />
          </div>
        <div className="form-group">
              <label htmlFor="produtoCategoria">Categoria</label>
              <select id="produtoCategoria" name="categoria" className="form-select"
                value={
                  editing ? editedProduto.categoria 
                  : editedProduto.categoria
                } 
                onChange={(e) => handleChange("categoria", e.target.value)}
                disabled={!editing}>
                <option value="">Selecione uma categoria</option>
                <option value="bebidas">Bebidas</option>
                <option value="lanches">Lanches</option>
                <option value="pratos">Pratos</option>
                <option value="sobremesas">Sobremesas</option>
                </select>
            </div>
        {editing && (
          <div className="form-group">
            <label htmlFor="produtoImagem">Imagem</label>
            <input
              type="file"
              id="produtoImagem"
              accept="image/*"
              
              className="form-control"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </div>
        )}
      </div>

      <div className="card-footer d-flex justify-content-between">
        {editing ? (
          <>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isUploading}>
              <FaSave /> Salvar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isUploading}>
              <MdOutlineCancel /> Cancelar
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
              <MdEdit /> Editar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              <FaTrash /> Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProdutoDetailPage;
