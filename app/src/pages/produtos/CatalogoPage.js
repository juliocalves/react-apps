import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutos, createProduto, deleteProduto, updateProduto } from "../../services/firestore";
import ProdutoModal from "../../components/produtos/ProdutoModal";
import { toast, ToastContainer } from "react-toastify";
import { uploadImg, deleteFile } from "../../services/appwrite";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

/**
 * CatalogoPage component renders a catalog of products with functionalities to search, filter, add, edit, and delete products.
 * It also allows switching between table and grid views.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return <CatalogoPage />
 *
 * @typedef {Object} Produto
 * @property {string} id - The unique identifier of the product.
 * @property {string} nome - The name of the product.
 * @property {string} descricao - The description of the product.
 * @property {number} preco - The price of the product.
 * @property {string[]} imagens - The array of image URLs of the product.
 *
 * @typedef {Object} Filters
 * @property {string} nome - The name filter.
 * @property {string} descricao - The description filter.
 * @property {string} precoMin - The minimum price filter.
 * @property {string} precoMax - The maximum price filter.
 *
 * @typedef {Object} ProdutoEditando
 * @property {string} nome - The name of the product being edited.
 * @property {string} descricao - The description of the product being edited.
 * @property {number} preco - The price of the product being edited.
 * @property {string[]} imagens - The array of image URLs of the product being edited.
 *
 * @typedef {Object} HeaderActionsProps
 * @property {function} onNew - Function to handle opening the modal for creating a new product.
 * @property {function} onSearch - Function to handle searching products.
 * @property {function} onFilter - Function to handle toggling the filter section.
 * @property {function} onChangeView - Function to handle changing the view mode.
 * @property {boolean} showSearch - Flag to show or hide the search input.
 * @property {boolean} showFilter - Flag to show or hide the filter button.
 * @property {boolean} showAdd - Flag to show or hide the add button.
 * @property {boolean} showChangeView - Flag to show or hide the change view button.
 * @property {boolean} isTableView - Flag to indicate if the current view mode is table view.
 *
 * @typedef {Object} ProdutoModalProps
 * @property {boolean} isOpen - Flag to indicate if the modal is open.
 * @property {function} onClose - Function to handle closing the modal.
 * @property {function} onSave - Function to handle saving the product.
 * @property {ProdutoEditando} produto - The product being edited or created.
 * @property {function} handleChange - Function to handle changes in the product fields.
 * @property {boolean} isSaving - Flag to indicate if the product is being saved.
 * @property {boolean} isUploading - Flag to indicate if an image is being uploaded.
 * @property {function} handleImageUpload - Function to handle image upload.
 * @property {function} handleDeleteImage - Function to handle deleting an image.
 */
const CatalogoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
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

  // Abre o modal para criação de um novo produto
  const handleAbrirModal = () => {
    setProdutoEditando({ nome: "", descricao: "", preco: 0, precoPromocional:0, imagens: [] });
    setModalAberto(true);
  };

  // Fecha o modal e reseta o estado do produto em edição
  const handleFecharModal = () => {
    setModalAberto(false);
    setProdutoEditando(null);
  };

  // Atualiza os campos do produto que está sendo editado ou criado
  const handleChange = (field, value) => {
    setProdutoEditando((prev) => ({ ...prev, [field]: value }));
    console.log(produtoEditando);
  };

  const handleImageUpload = async (event) => {
    if (!produtoEditando) return;
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImg(file);
      if (imageUrl) {
        handleChange("imagens", [...(produtoEditando.imagens || []), imageUrl]);
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

  const handleDeleteImage = async (imageUrl) => {
    try {
      await deleteFile(imageUrl);
      setProdutoEditando((prevProduto) => ({
        ...prevProduto,
        imagens: prevProduto.imagens.filter((img) => img !== imageUrl),
      }));
      toast.info("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      toast.error("Erro ao deletar a imagem. Tente novamente.");
    }
  };

  // Salva o produto: se houver um ID, atualiza; caso contrário, cria um novo
  const handleSalvarProduto = async () => {
    if (!produtoEditando.nome || !produtoEditando.descricao || produtoEditando.preco <= 0) {
      toast.error("Preencha todos os campos!");
      return;
    }
    setIsSaving(true);
    try {
      if (produtoEditando.id) {
        // Atualiza produto existente
        await updateProduto(produtoEditando.id, produtoEditando);
        setProdutos(produtos.map((p) => (p.id === produtoEditando.id ? produtoEditando : p)));
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Cria novo produto
        const id = await createProduto(produtoEditando);
        if (id) {
          produtoEditando.id = id;
          setProdutos([...produtos, produtoEditando]);
          toast.success("Produto adicionado com sucesso!");
        }
      }
      handleFecharModal();
    } catch (error) {
      toast.error("Erro ao salvar produto Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchProd = (search) => {
    let term = "";
    if (search && typeof search === "object" && search.target) {
      term = search.target.value;
    } else if (typeof search === "string") {
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

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    nome: "",
    descricao: "",
    precoMin: "",
    precoMax: "",
  });

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const onFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleApplyFilter = () => {
    const filteredProdutos = produtos.filter((produto) => {
      const nomeMatch = produto.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const descricaoMatch = produto.descricao.toLowerCase().includes(filters.descricao.toLowerCase());
      const precoMatch =
        (filters.precoMin === "" || produto.preco >= parseFloat(filters.precoMin)) &&
        (filters.precoMax === "" || produto.preco <= parseFloat(filters.precoMax));
      return nomeMatch && descricaoMatch && precoMatch;
    });
    setProdutos(filteredProdutos);
  };

  const handleClearFilter = () => {
    setFilters({
      nome: "",
      descricao: "",
      precoMin: "",
      precoMax: "",
    });
    const fetchProdutos = async () => {
      const data = await getProdutos();
      setProdutos(Array.isArray(data) ? data : []);
    };
    fetchProdutos();
  };

  const [isTableView, setIsTableView] = useState(
    () => JSON.parse(localStorage.getItem("viewMode")) || false
  );

  const handleChangeView = () => {
    setIsTableView((prev) => {
      const newValue = !prev;
      localStorage.setItem("viewMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleExcluirProduto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduto(id);
        setProdutos(produtos.filter((p) => p.id !== id));
        toast.success("Produto excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir produto. Tente novamente.");
      }
    }
  };

  return (
    <>
      <HeaderActions
        onNew={handleAbrirModal}
        onSearch={handleSearchProd}
        onFilter={onFilter}
        onChangeView={handleChangeView}
        showSearch={true}
        showFilter={true}
        showAdd={true}
        showChangeView={true}
        isTableView={isTableView}
      />

      {showFilter && (
        <div className="filter-container card p-3 mb-3">
          <div className="row">
            <div className="col-md-3 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Filtrar por nome"
                value={filters.nome}
                onChange={(e) => handleFilterChange("nome", e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Filtrar por descrição"
                value={filters.descricao}
                onChange={(e) => handleFilterChange("descricao", e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Preço mínimo"
                value={filters.precoMin}
                onChange={(e) => handleFilterChange("precoMin", e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Preço máximo"
                value={filters.precoMax}
                onChange={(e) => handleFilterChange("precoMax", e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary me-2" onClick={handleApplyFilter}>
              Aplicar Filtro
            </button>
            <button className="btn btn-secondary" onClick={handleClearFilter}>
              Limpar Filtro
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
      {isTableView ? (
        <Table
          tableHead={
            <>
              <th scope="col">Nome</th>
              <th scope="col">Descrição</th>
              <th scope="col">Preço</th>
              <th scope="col">Preço Promo</th>
              <th scope="col">Ações</th>
            </>
          }
          tableBody={
            displayedProdutos.length > 0 ? (
              displayedProdutos.map((produto) => (
                <tr key={produto.id} onDoubleClick={() => handleProdutoClick(produto.id)}>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>R$ {produto.preco.toFixed(2)}</td>
                  <td>R$ {produto.precoPromocional.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Editar"
                      onClick={() => {
                        setProdutoEditando(produto);
                        setModalAberto(true);
                      }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Deletar"
                      onClick={() => handleExcluirProduto(produto.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )
          }
        />
      ) : (
        <div className="catalogo-grid">
          {displayedProdutos.length > 0 ? (
            displayedProdutos.map((produto) => (
              <div key={produto.id} className="produto-card" onClick={() => handleProdutoClick(produto.id)}>
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
                <span className="produto-preco"
                    style={produto.precoPromocional > 0 ? { textDecoration: "line-through" } : {}}
                  >
                    R$ {produto.preco.toFixed(2)}</span>
                  {produto.precoPromocional > 0 && (
                    <span className="produto-preco promocional"> R$ {produto.precoPromocional.toFixed(2)}
                    </span>
                  )}

              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      )}

      <ProdutoModal
        isOpen={modalAberto}
        onClose={handleFecharModal}
        onSave={handleSalvarProduto}
        produto={produtoEditando}
        handleChange={handleChange}
        isSaving={isSaving}
        isUploading={isUploading}
        handleImageUpload={handleImageUpload}
        handleDeleteImage={handleDeleteImage}
      />
    </>
  );
};

export default CatalogoPage;
