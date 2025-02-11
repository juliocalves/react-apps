import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProdutoById, updateProduto, deleteProduto } from "../../services/firestore";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowLeft, FaTrash, FaSave } from "react-icons/fa";
import ImageWithModal from "../../components/ImageModal";
import { uploadImg, deleteFile } from "../../services/appwrite";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
const ProdutoDetailPage = () => {
  const { produtoId } = useParams();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [produto, setProduto] =  useState({
      nome: "",
      descricao: "",
      preco: 0,
      imagens: [],
    });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProduto, setEditedProduto] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    imagens: [],
  });

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
        handleChange("imagens", [...editedProduto.imagens, imageUrl]);
        toast.success("Imagem carregada com sucesso!");
      } else {
        throw new Error("URL da imagem não gerada");
      }
    } catch (error) {
      toast.error( `Erro ao fazer upload da imagem. Tente novamente. \n ${error}`);
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

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!produto) {
    return <p>Produto não encontrado.</p>;
  }
  const handleCancel = () => {
    setEditing(false);
    setEditedProduto(produto);
  };


  return (
    <div className="container card">
      <ToastContainer />
      <div className="card-header">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/produtos/catalogo")}>
            <FaArrowLeft /> Voltar
        </button>
      </div>
      <div className="card-img-top">
            {editedProduto.imagens && editedProduto.imagens.length > 0 && (
                <div className="image-content">
                {editedProduto.imagens.map((img, index) => (
                <div key={index} className="image-preview">
                    <ImageWithModal imageUrl={img} altText={`Imagem ${index + 1}`} />
                    <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDeleteImage(img)}
                    >
                    <FaTrash />
                    </button>
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
                    value={editedProduto.nome}
                    onChange={handleChange}
                    disabled={!editing}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="produtoDescricao">Descrição</label>
                <textarea
                    name="descricao"
                    value={editedProduto.descricao}
                    onChange={handleChange}
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
                        value={editedProduto.preco.toFixed(2)}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form-control"
                    />
                </div>
            </div>
            {editing &&
                <div className="form-group">
                    <label htmlFor="produtoImagem">Imagem</label>
                    <input
                    type="file"
                    id="produtoImagem"
                    className="form-control"
                    onChange={handleImageUpload}
                    
                    />
                </div>
            }
        </div>

        <div className="card-footer  d-flex justify-content-between">
          {editing ? (
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isUploading}>
              <FaSave /> Salvar
            </button>
            ) : (
                <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                <MdEdit/> Editar
                </button>
            )}
            {editing ? (
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isUploading }>
                <MdOutlineCancel /> Cancelar
            </button>
            ):(

            <button type="button" className="btn btn-danger" onClick={handleDelete}>
                <FaTrash /> Excluir
            </button>
            )}
        </div>
      </div>
  );
};

export default ProdutoDetailPage;
