import React, { useState, useEffect } from "react";
import { getPageContent, updatePageContent, updateIdentity, createIdentity, getIdentity } from "../../services/firestore";
import { deleteFile } from "../../services/appwrite";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "../../components/Accordion";
import IdentidadeVisual from "../../components/cms/IdentidadeVisualConfig";
import HomeConfig from "../../components/cms/HomeConfig";
import AboutConfig from "../../components/cms/AboutConfig";
import ContactConfig from "../../components/cms/ContactConfig";
import ReservationsConfig from "../../components/cms/ReservationsConfig";
import { uploadImg } from "../../services/appwrite";

const AppearancePage = () => {
  const [pages, setPages] = useState({
    home: {
      title: "",
      description: "",
      imageUrl: "",
      showCta: false,
      callToAction: "",
      callToActionButton: "",
    },
    about: {
      title: "",
      description: "",
      history: "",
      mission: "",
      images: [],
    },
    contact: {
      title: "",
      description: "",
    },
    reservation: {
      title: "",
      description: "",
    },
  });

  const [identV, setIdentV] = useState({
    brandName: "",
    brandSlogan: "",
    darkTheme: {
      primaryColor: "",
      secondaryColor: "",
      accentColor: "",
      lightColor: "",
      darkColor: "",
      textLightColor: "",
      textDarkColor: "",
      sideBarColor:"",
      sideBarHoverColor:"",
      headerColor:"",
      borderColor:"",
    },
    lightTheme: {
      primaryColor: "",
      secondaryColor: "",
      accentColor: "",
      lightColor: "",
      darkColor: "",
      textLightColor: "",
      textDarkColor: "",
      sideBarColor:"",
      sideBarHoverColor:"",
      headerColor:"",
      borderColor:"",
    },
    logoUrl: "",
    logo192Url: "",
    logo512Url: "",
    faviconUrl: "",
    primaryFont: "Arial",
    secondaryFont: "Roboto",
    sidebarWidth: "",
    sidebarMinimizedWidth: "",
    borderRadius: "",
    transitionSpeed: "",
    boxShadow: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasIdentity, setHasIdentity] = useState(false);
  const handleChangeIdentity = (field, value) => {
    setIdentV((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleChangeIdentityTheme = (themeKey, field, value) => {
    setIdentV((prev) => ({
          ...prev,
          [themeKey]: {
            ...prev[themeKey],
            [field]: value,
          },
    }));
  };
  

  useEffect(() => {
    const fetchContent = async () => {
      const homeContent = await getPageContent("home");
      const aboutContent = await getPageContent("about");

      setPages((prevPages) => ({
        ...prevPages,
        home: homeContent || prevPages.home,
        about: aboutContent || prevPages.about,
      }));
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const fetchIdentity = async () => {
      const identityContent = await getIdentity(); // Implemente essa função no seu serviço
      if (identityContent) {
        setIdentV(identityContent);
        setHasIdentity(true);
      }
    };
    fetchIdentity();
  }, []);

  const handleChange = (page, field, value) => {
    setPages((prev) => ({
      ...prev,
      [page]: { ...prev[page], [field]: value },
    }));
  };

  const handleImageUpload = async (event, page, field) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImg(file);

      if (imageUrl) {
        if(page === "identV"){
          handleChangeIdentity(field, imageUrl);
        }else{

          if (field === "images") {
            handleChange(page, field, [...pages[page].images, imageUrl]);
          } else {
            handleChange(page, field, imageUrl);
          }
        }
        toast.success("Imagem carregada com sucesso!");
      } else {
        throw new Error("URL da imagem não gerada");
      }
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  

  const handleDeleteImage = async (page, field, imageUrl) => {
  
    try {
      await deleteFile(imageUrl);
      if (page === "identV") {
        handleChangeIdentity(field, "");
      } else {
        if (field === "images") {
          handleChange(page, field, pages[page].images.filter((img) => img !== imageUrl));
        } else {
          handleChange(page, field, "");
        }
      }
  
      toast.info("Imagem removida com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
      toast.error("Erro ao deletar a imagem. Tente novamente.");
    }
  };

  const handleSave = async (page) => {
    setIsSaving(true);
    try {
      switch (page) {
        case "identV":
          // Se já existe identidade, atualize; caso contrário, crie-a.
          if (hasIdentity) {
            await updateIdentity(identV);
          } else {
            await createIdentity(identV);
          }
          break;
        default:
          await updatePageContent(page, pages[page]);
          break;
      }
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const accordionPaginaItems = [
    {
      title: "HOME",
      content: (
        <>
          <HomeConfig
            home={pages.home}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isUploading={isUploading}
            isSaving={isSaving}
          />
          <button
            onClick={() => handleSave("home")}
            disabled={isUploading || isSaving}
            className="btn btn-primary mt-3"
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </>
      ),
    },
    {
      title: "SOBRE",
      content: (
        <>
          <AboutConfig
            about={pages.about}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isUploading={isUploading}
            isSaving={isSaving}
          />
          <button
            onClick={() => handleSave("about")}
            disabled={isUploading || isSaving}
            className="btn btn-primary mt-3"
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </>
      ),
    },
    {
      title: "CONTATO",
      content: (
        <>
          <ContactConfig
            contact={pages.contact}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isUploading={isUploading}
            isSaving={isSaving}
          />
          <button
            onClick={() => handleSave("contact")}
            disabled={isUploading || isSaving}
            className="btn btn-primary mt-3"
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </>
      ),
    },
    {
      title: "RESERVAS",
      content: (
        <>
          <ReservationsConfig
            reservation={pages.reservation}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isUploading={isUploading}
            isSaving={isSaving}
          />
          <button
            onClick={() => handleSave("reservation")}
            disabled={isUploading || isSaving}
            className="btn btn-primary mt-3"
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </>
      ),
    },
  ];

  const accordionItems = [
    {
      title: "IDENTIDADE VISUAL",
      content: (
        <>
          <IdentidadeVisual
            identV={identV}
            handleChangeIdentity={handleChangeIdentity}
            handleChangeIdentityTheme={handleChangeIdentityTheme}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isUploading={isUploading}
            isSaving={isSaving}
          />
          <button
            onClick={() => handleSave("identV")}
            disabled={isUploading || isSaving}
            className="btn btn-primary mt-3"
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </>
      ),
    },
    {
      title: "PÁGINAS",
      content: (
        <>
          <Accordion items={accordionPaginaItems} id={"paginaitens"} />
        </>
      ),
    },
  ];

  return (
    <div className="">
      <ToastContainer />
      <div className="accordion-container">
        <Accordion items={accordionItems} id={"configuracoes"} />
      </div>
    </div>
  );
};

export default AppearancePage;
