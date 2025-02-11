import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProdutos, createProduto } from "../../services/firestore";
import ProdutoModal from "../../components/produtos/ProdutoModal";
import { toast, ToastContainer } from "react-toastify";
import { uploadImg, deleteFile } from "../../services/appwrite";
import HeaderActions from "../../components/HeaderActions";
import Table from "../../components/Table";


const CatalogoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    imagens: [],
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
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({  // Estado para armazenar os filtros
    nome: "",
    descricao: "",
    precoMin: "",
    precoMax: "",
    // Adicione outros filtros aqui (categoria, marca, etc.)
  });
  
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const onFilter = () => {
    setShowFilter(!showFilter)
  }

  const handleApplyFilter = () => {
    const filteredProdutos = produtos.filter((produto) => {
      const nomeMatch = produto.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const descricaoMatch = produto.descricao.toLowerCase().includes(filters.descricao.toLowerCase());
      const precoMatch = 
        (filters.precoMin === "" || produto.preco >= parseFloat(filters.precoMin)) &&
        (filters.precoMax === "" || produto.preco <= parseFloat(filters.precoMax));

      return nomeMatch && descricaoMatch && precoMatch; // Todos os filtros devem corresponder
    });
    setProdutos(filteredProdutos)
  }

  const handleClearFilter = () => {
    setFilters({
      nome: "",
      descricao: "",
      precoMin: "",
      precoMax: "",
    })
    const fetchProdutos = async () => {
      const data = await getProdutos();
      setProdutos(Array.isArray(data) ? data : []);
    };
    fetchProdutos();
  }

  const [isTableView, setIsTableView] = useState(
    () => JSON.parse(localStorage.getItem("viewMode")) || false
  );

  // Função para alternar a exibição e salvar no localStorage
  const handleChangeView = () => {
    setIsTableView((prev) => {
      const newValue = !prev;
      localStorage.setItem("viewMode", JSON.stringify(newValue)); // Salva no localStorage
      return newValue;
    });
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
            </div> {/* End of row */}
            <div className="d-flex justify-content-end"> {/* Align buttons to the right */}
              <button className="btn btn-primary me-2" onClick={handleApplyFilter}> {/* Added Bootstrap button styles and margin */}
                Aplicar Filtro
              </button>
              <button className="btn btn-secondary" onClick={handleClearFilter}> {/* Added Bootstrap button styles */}
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
           </>
         }
         tableBody={
           displayedProdutos.length > 0 ? (
             displayedProdutos.map((produto) => (
               <tr key={produto.id} onClick={() => handleProdutoClick(produto.id)}>
                 <td>{produto.nome}</td>
                 <td>{produto.descricao}</td>
                 <td>R$ {produto.preco.toFixed(2)}</td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="3" className="text-center">Nenhum produto encontrado.</td>
             </tr>
           )
         }
       />
       
      ) : (
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
      )}

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
    </>
  );
};

export default CatalogoPage;
