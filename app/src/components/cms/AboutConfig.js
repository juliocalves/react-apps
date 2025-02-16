import React from "react";
import ImageWithModal from "../ImageModal";
import { FaTrash } from "react-icons/fa";
import MarkdownEditor from "../MarkdownEditor";
/**
 * AboutConfig component renders a configuration form for the "About" section.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.about - The about data object.
 * @param {Function} props.handleChange - Function to handle changes in the input fields.
 * @param {Function} props.handleImageUpload - Function to handle image uploads.
 * @param {Function} props.handleDeleteImage - Function to handle image deletions.
 * @param {boolean} props.isUploading - Flag indicating if an image is currently being uploaded.
 * @param {boolean} props.isSaving - Flag indicating if the form is currently being saved.
 *
 * @returns {JSX.Element} The rendered AboutConfig component.
 */
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
          <MarkdownEditor
          value={about.description}
          onChange={(newText) => handleChange("about", "description", newText)}
        />
        </>
      )
    },
    {
      title: "História",
      content: (
       <MarkdownEditor
        value={about.history}
        onChange={(newText) => handleChange("about", "history", newText)}
        />
      )
    },
    {
      title: "Missão",
      content: (
        <MarkdownEditor
          value={about.mission}
          onChange={(newText) => handleChange("about", "mission", newText)}
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
            accept="image/*"
            
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