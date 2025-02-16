import React from "react";
import { FaTrash } from "react-icons/fa";
import ImageWithModal from "../ImageModal";
import Accordion from "../Accordion";

const HomeConfig = ({ home, handleChange, handleImageUpload, handleDeleteImage, isUploading, isSaving }) => {
    return (
      <Accordion
        items={[
          {
            title: "Título e Descrição",
            content: (
              <>
                <div className="mb-3">
                  <label htmlFor="homeTitle" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="homeTitle"
                    placeholder="Título"
                    value={home.title}
                    onChange={(e) => handleChange("home", "title", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="homeDescription" className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    id="homeDescription"
                    placeholder="Descrição"
                    value={home.description}
                    onChange={(e) => handleChange("home", "description", e.target.value)}
                  />
                </div>
              </>
            ),
          },
          {
            title: "Banner",
            content: (
              <div className="mb-3">
                <label htmlFor="homeImage" className="form-label">Banner</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  
                  id="homeImage"
                  onChange={(e) => handleImageUpload(e, "home")}
                  disabled={isUploading || isSaving}
                />
                {home.imageUrl && (
                  <div className="image-content">
                    <div className="image-preview">
                      <ImageWithModal
                        imageUrl={home.imageUrl}
                        altText="Imagem de destaque da Home"
                      />
                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleDeleteImage("home", "imageUrl", home.imageUrl)}
                        disabled={isUploading || isSaving}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          {
            title: "Call to Action",
            content: (
              <>
                <div className="mb-3">
                  <label htmlFor="showCta" className="form-label">Mostrar Call to Action?</label>
                  <input
                    type="checkbox"
                    id="showCta"
                    checked={home.showCta}
                    onChange={(e) => handleChange("home", "showCta", e.target.checked)}
                    disabled={isUploading || isSaving}
                  />
                </div>
                {home.showCta && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="callToAction" className="form-label">Texto do Call to Action</label>
                      <input
                        type="text"
                        className="form-control"
                        id="callToAction"
                        placeholder="Texto do CTA"
                        value={home.callToAction}
                        onChange={(e) => handleChange("home", "callToAction", e.target.value)}
                        disabled={isUploading || isSaving}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="callToActionButton" className="form-label">Texto do Botão do CTA</label>
                      <input
                        type="text"
                        className="form-control"
                        id="callToActionButton"
                        placeholder="Texto do botão"
                        value={home.callToActionButton}
                        onChange={(e) => handleChange("home", "callToActionButton", e.target.value)}
                        disabled={isUploading || isSaving}
                      />
                    </div>
                  </>
                )}
              </>
            ),
          },
        ]}
        id={'homeConfig'}
      />
    );
  };
  
  export default HomeConfig;
  