import React from "react";
import ImageWithModal from "../ImageModal";
import { FaTrash } from "react-icons/fa";

const AboutConfig = ({ about, handleChange, handleImageUpload, handleDeleteImage, isUploading, isSaving }) => {
  const aboutItems = [
    {
      title: "Título e Descrição",
      content: (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Título"
            value={about.title}
            onChange={(e) => handleChange("about", "title", e.target.value)}
          />
          <textarea
            className="form-control mb-3"
            placeholder="Descrição"
            value={about.description}
            onChange={(e) => handleChange("about", "description", e.target.value)}
          />
        </>
      )
    },
    {
      title: "História",
      content: (
        <textarea
          className="form-control mb-3"
          placeholder="História"
          value={about.history}
          onChange={(e) => handleChange("about", "history", e.target.value)}
        />
      )
    },
    {
      title: "Missão",
      content: (
        <textarea
          className="form-control mb-3"
          placeholder="Missão"
          value={about.mission}
          onChange={(e) => handleChange("about", "mission", e.target.value)}
        />
      )
    },
    {
      title: "Imagens",
      content: (
        <>
          <label className="form-label">Carregar imagens:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleImageUpload(e, "about", "images")}
            disabled={isUploading || isSaving}
          />
          {about.images.length > 0 && (
            <div className="image-content">
              {about.images.map((img, index) => (
                <div key={index} className="image-preview">
                  <ImageWithModal imageUrl={img} altText={`Imagem ${index + 1}`} />
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDeleteImage("about", "images", img)}
                    disabled={isUploading || isSaving}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )
    }
  ];

  return (
    <div>
      {aboutItems.map((item, index) => (
        <div key={index} className="mb-4">
          <h5>{item.title}</h5>
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default AboutConfig;