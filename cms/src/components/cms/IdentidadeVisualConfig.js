import React from "react";
import { FaTrash } from "react-icons/fa";
import ImageWithModal from "../ImageModal";
import Accordion from "../Accordion";

const IdentidadeVisual = ({ identV, handleChangeIdentity,handleChangeIdentityTheme, handleImageUpload, handleDeleteImage, isUploading, isSaving }) => {
  const identVItems = [
    {
      title: "MARCA",
      content: (
        <>
          <div className="mb-3">
            <label htmlFor="brandName" className="form-label">Nome da Marca</label>
            <input
              type="text"
              className="form-control"
              id="brandName"
              placeholder="Nome da marca"
              value={identV.brandName}
              onChange={(e) => handleChangeIdentity("brandName", e.target.value)}
              disabled={isUploading || isSaving}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="brandSlogan" className="form-label">Slogan da Marca</label>
            <input
              type="text"
              className="form-control"
              id="brandSlogan"
              placeholder="Slogan da marca"
              value={identV.brandSlogan}
              onChange={(e) => handleChangeIdentity("brandSlogan", e.target.value)}
              disabled={isUploading || isSaving}
            />
          </div>
        </>
      ),
    },
    {
      title: "CORES",
      content: (
        <>
          <div className="tema-config-main-container">
            <label className="form-label">Configurações do Tema Claro</label>
            <div className="tema-config-container">
              <div className="tema-config">
                <label htmlFor="primaryColor" className="form-label">Primária</label>
                <input
                  type="color"
                  className="form-control"
                  id="primaryColor"
                  value={identV.lightTheme.primaryColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","primaryColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="secondaryColor" className="form-label">Secundária</label>
                <input
                  type="color"
                  className="form-control"
                  id="secondaryColor"
                  value={identV.lightTheme.secondaryColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","secondaryColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="accentColor" className="form-label">Destaque</label>
                <input
                  type="color"
                  className="form-control"
                  id="accentColor"
                  value={identV.lightTheme.accentColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","accentColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="lightColor" className="form-label">Clara</label>
                <input
                  type="color"
                  className="form-control"
                  id="lightColor"
                  value={identV.lightTheme.lightColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","lightColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkColor" className="form-label">Escura</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkColor"
                  value={identV.lightTheme.darkColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","darkColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="textLightColor" className="form-label">Texto Claro</label>
                <input
                  type="color"
                  className="form-control"
                  id="textLightColor"
                  value={identV.lightTheme.textLightColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","textLightColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="textDarkColor" className="form-label">Texto Escuro</label>
                <input
                  type="color"
                  className="form-control"
                  id="textDarkColor"
                  value={identV.lightTheme.textDarkColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","textDarkColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="sideBarColor" className="form-label">Barra lateral</label>
                <input
                  type="color"
                  className="form-control"
                  id="sideBarColor"
                  value={identV.lightTheme.sideBarColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","sideBarColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="sideBarHoverColor" className="form-label">Hover Barra Lateral</label>
                <input
                  type="color"
                  className="form-control"
                  id="sideBarHoverColor"
                  value={identV.lightTheme.sideBarHoverColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","sideBarHoverColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="headerColor" className="form-label">Header</label>
                <input
                  type="color"
                  className="form-control"
                  id="headerColor"
                  value={identV.lightTheme.headerColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","headerColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="borderColor" className="form-label">Borda</label>
                <input
                  type="color"
                  className="form-control"
                  id="borderColor"
                  value={identV.lightTheme.borderColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("lightTheme","borderColor", e.target.value)}
                />
              </div>
            </div>
         
            <label className="form-label">Configurações do Tema Escuro</label>
            <div className="tema-config-container">
              <div className="tema-config">
                <label htmlFor="darkPrimaryColor" className="form-label">Primária</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkPrimaryColor"
                  value={identV.darkTheme.primaryColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","primaryColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkSecondaryColor" className="form-label">Secundária</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkSecondaryColor"
                  value={identV.darkTheme.secondaryColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","secondaryColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkAccentColor" className="form-label">Destaque</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkAccentColor"
                  value={identV.darkTheme.accentColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","accentColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkLightColor" className="form-label">Clara</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkLightColor"
                  value={identV.darkTheme.lightColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","lightColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkDarkColor" className="form-label">Escura</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkDarkColor"
                  value={identV.darkTheme.darkColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","darkColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkTextLightColor" className="form-label">Texto Claro</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkTextLightColor"
                  value={identV.darkTheme.textLightColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","textLightColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkTextDarkColor" className="form-label">Texto Escuro</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkTextDarkColor"
                  value={identV.darkTheme.textDarkColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","textDarkColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkdarksideBarColor" className="form-label">Barra lateral</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkdarksideBarColor"
                  value={identV.darkTheme.sideBarColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","sideBarColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darksideBarHoverColor" className="form-label">Hover Barra Lateral</label>
                <input
                  type="color"
                  className="form-control"
                  id="darksideBarHoverColor"
                  value={identV.darkTheme.sideBarHoverColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","sideBarHoverColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkheaderColor" className="form-label">Header</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkheaderColor"
                  value={identV.darkTheme.headerColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","headerColor", e.target.value)}
                />
              </div>
              <div className="tema-config">
                <label htmlFor="darkborderColor" className="form-label">Borda</label>
                <input
                  type="color"
                  className="form-control"
                  id="darkborderColor"
                  value={identV.darkTheme.borderColor || "#ff9800"}
                  onChange={(e) => handleChangeIdentityTheme("darkTheme","borderColor", e.target.value)}
                />
              </div>
            </div>

            <label  className="form-label">Configurações Gerais</label>
            <div className="mb-3">
              <div className="tema-config-geral">
                <label htmlFor="sidebarWidth" className="form-label">Largura do Sidebar</label>
                <input
                  type="text"
                  className="form-control"
                  id="sidebarWidth"
                  value={identV.sidebarWidth}
                  onChange={(e) => handleChangeIdentity("sidebarWidth", e.target.value)}
                  disabled={isUploading || isSaving}
                />
              </div>
              <div className="tema-config-geral">
                <label htmlFor="sidebarMinimizedWidth" className="form-label">Largura do Sidebar Minimizado</label>
                <input
                  type="text"
                  className="form-control"
                  id="sidebarMinimizedWidth"
                  value={identV.sidebarMinimizedWidth}
                  onChange={(e) => handleChangeIdentity("sidebarMinimizedWidth", e.target.value)}
                  disabled={isUploading || isSaving}
                />
              </div>
              <div className="tema-config-geral">
                <label htmlFor="borderRadius" className="form-label">Raio da Borda</label>
                <input
                  type="text"
                  className="form-control"
                  id="borderRadius"
                  value={identV.borderRadius}
                  onChange={(e) => handleChangeIdentity("borderRadius", e.target.value)}
                  disabled={isUploading || isSaving}
                />
              </div>
              <div className="tema-config-geral">
                <label htmlFor="transitionSpeed" className="form-label">Velocidade da Transição</label>
                <input
                  type="text"
                  className="form-control"
                  id="transitionSpeed"
                  value={identV.transitionSpeed}
                  onChange={(e) => handleChangeIdentity("transitionSpeed", e.target.value)}
                  disabled={isUploading || isSaving}
                />
              </div>
              <div className="tema-config-geral">
                <label htmlFor="boxShadow" className="form-label">Sombra da Caixa</label>
                <input
                  type="text"
                  className="form-control"
                  id="boxShadow"
                  value={identV.boxShadow}
                  onChange={(e) => handleChangeIdentity("boxShadow", e.target.value)}
                  disabled={isUploading || isSaving}
                />
              </div>
            </div>
          </div>
      </>
      ),
    },
    {
      title: "LOGOTIPOS",
      content: (
        <>
        <div className="mb-3">
          <label htmlFor="logoUpload" className="form-label">Logotipo</label>
          <input
            type="file"
            className="form-control"
            id="logoUpload"
            onChange={(e) => handleImageUpload(e, "identV", "logoUrl")}
            disabled={isUploading || isSaving}
          />
          {identV.logoUrl && (
            <div className="image-content">
              <div className="image-preview">
                <ImageWithModal imageUrl={identV.logoUrl} altText="Logotipo da Marca" />
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDeleteImage("identV",'logoUrl',identV.logoUrl)}
                  disabled={isUploading || isSaving}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="logoUpload" className="form-label">Logotipo 192x192pixels</label>
          <input
            type="file"
            className="form-control"
            id="logoUpload"
            onChange={(e) => handleImageUpload(e, "identV", "logo192Url")}
            disabled={isUploading || isSaving}
          />
          {identV.logo192Url && (
            <div className="image-content">
              <div className="image-preview">
                <ImageWithModal imageUrl={identV.logo192Url} altText="Logotipo da Marca" />
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDeleteImage("identV",'logo192Url',identV.logo192Url)}
                  disabled={isUploading || isSaving}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="logoUpload" className="form-label">Logotipo 512x512pixels</label>
          <input
            type="file"
            className="form-control"
            id="logoUpload"
            onChange={(e)=>handleImageUpload(e, "identV", "logo512Url")}
            disabled={isUploading || isSaving}
          />
          {identV.logo512Url && (
            <div className="image-content">
              <div className="image-preview">
                <ImageWithModal imageUrl={identV.logo512Url} altText="Logotipo da Marca" />
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDeleteImage("identV",'logo512Url',identV.logo512Url,)}
                  disabled={isUploading || isSaving}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="logoUpload" className="form-label">Favicon</label>
          <input
            type="file"
            className="form-control"
            id="logoUpload"
            onChange={(e)=>handleImageUpload(e, "identV", "faviconUrl")}
            disabled={isUploading || isSaving}
          />
          {identV.faviconUrl && (
            <div className="image-content">
              <div className="image-preview">
                <ImageWithModal imageUrl={identV.faviconUrl} altText="Logotipo da Marca" />
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleDeleteImage("identV",'faviconUrl',identV.faviconUrl)}
                  disabled={isUploading || isSaving}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )}
        </div>
        </>
        
      ),
    },
    {
      title: "FONTES",
      content: (
        <>
          <div className="mb-3">
            <label htmlFor="primaryFont" className="form-label">Fonte Primária</label>
            <select
              className="form-control"
              id="primaryFont"
              value={identV.primaryFont}
              onChange={(e) => handleChangeIdentity("primaryFont", e.target.value)}
              disabled={isUploading || isSaving}
            >
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="secondaryFont" className="form-label">Fonte Secundária</label>
            <select
              className="form-control"
              id="secondaryFont"
              value={identV.secondaryFont}
              onChange={(e) => handleChangeIdentity("secondaryFont", e.target.value)}
              disabled={isUploading || isSaving}
            >
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
        </>
      ),
    },
  ];

  return <Accordion items={identVItems} id="identidadeVisual" />;
};

export default IdentidadeVisual;
