import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutos, createProduto } from "../../services/firestore";
import ProdutoModal from "../../components/produtos/ProdutoModal";
import { toast, ToastContainer } from "react-toastify";
import { uploadImg, deleteFile } from "../../services/appwrite";
import HeaderActions from "../../components/HeaderActions";
const CatalogoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    imagens: [],// Utilizando um único campo para imagem de forma consistente
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      const data = await getProdutos();
      setProdutos(Array.isArray(data) ? data : []);
    };
    fetchProdutos();
  }, []);

  const handleProdutoClick = (produtoId) => {
    navigate(`/produtos/produto-detail/${produtoId}`);
  };

  const handleAbrirModal = () => {
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setNovoProduto({ nome: "", descricao: "", preco: 0, imagemUrl: [] });
  };

  const handleChange = (field, value) => {
    setNovoProduto((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImg(file);

      if (imageUrl) {
        handleChange("imagens", [...novoProduto.imagens, imageUrl]);
        console.log(novoProduto)
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

  const handleDeleteImage = async (imageUrl) => {
    try {
      await deleteFile(imageUrl);
      setNovoProduto((prevProduto) => ({
        ...prevProduto,
        imagens: prevProduto.imagens.filter((img) => img !== imageUrl),
      }));
      toast.info("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      toast.error("Erro ao deletar a imagem. Tente novamente.");
    }
  };

  const handleSalvarProduto = async () => {
    if (
      !novoProduto.nome ||
      !novoProduto.descricao ||
      novoProduto.preco <= 0 ||
      !novoProduto.imagemUrl
    ) {
      toast.error("Preencha todos os campos!");
      return;
    }
    setIsSaving(true);
    try {
      const id = await createProduto(novoProduto);
      if (id) {
        setProdutos([...produtos, { id, ...novoProduto }]);
        toast.success("Produto adicionado com sucesso!");
      }
      handleFecharModal();
    } catch (error) {
      toast.error("Erro ao adicionar produto. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * handleSearchProd agora aceita tanto um objeto de evento quanto uma string.
   */
  const handleSearchProd = (search) => {
    let term = "";
    if (search && typeof search === "object" && search.target) {
      // Se for um objeto de evento, extrai o valor
      term = search.target.value;
    } else if (typeof search === "string") {
      // Se for uma string, utiliza-a diretamente
      term = search;
    }
    setSearchTerm(term.toLowerCase());
  };

  // Filtra os produtos com base no termo de busca
  const displayedProdutos = searchTerm
    ? produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm) ||
          produto.descricao.toLowerCase().includes(searchTerm)
      )
    : produtos;
  // Função placeholder para futuros filtros
  const handleFilter = () => {
   
  };

  return (
    <>
      <HeaderActions
        onNew={handleAbrirModal}
        onSearch={handleSearchProd}
        onFilter={handleFilter}
        showSearch={true}
        showFilter={true}
        showAdd={true}
      />
      <div className="catalogo-container">
        <ToastContainer />
        <div className="catalogo-grid">
          {displayedProdutos.length > 0 ? (
            displayedProdutos.map((produto) => (
              <div
                key={produto.id}
                className="produto-card"
                onClick={() => handleProdutoClick(produto.id)}
              >
               <div className="card-img-top">
                    {produto.imagens && produto.imagens.length > 0 && (
                        <div className="image-content">
                        {produto.imagens.map((img, index) => (
                        <div key={index} className="image-preview">
                            <img src={img} alt={`Imagem ${index + 1}`} />
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                <h2>{produto.nome}</h2>
                <p>{produto.descricao}</p>
                <span className="produto-preco">
                  R$ {produto.preco.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
        <ProdutoModal
          isOpen={modalAberto}
          onClose={handleFecharModal}
          onSave={handleSalvarProduto}
          produto={novoProduto}
          handleChange={handleChange}
          isSaving={isSaving}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          handleDeleteImage={handleDeleteImage}
        />
      </div>
    </>
  );
};

export default CatalogoPage;
