import React from "react";
// import ImageWithModal from "./ImageModal";
// import { FaTrash } from "react-icons/fa";

const ContactConfig = ({ contact, handleChange, handleImageUpload, handleDeleteImage, isUploading, isSaving }) => {
    const contactItems =[
        {
          title: "Título e Descrição",
          content: (
            <>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Título"
                value={contact.title}
                onChange={(e) => handleChange("contact", "title", e.target.value)}
              />
              <textarea
                className="form-control mb-3"
                placeholder="Descrição"
                value={contact.description}
                onChange={(e) => handleChange("contact", "description", e.target.value)}
              />
            </>
          )
        }
      ];

  return (
    <div>
      {contactItems.map((item, index) => (
        <div key={index} className="mb-4">
          <h5>{item.title}</h5>
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default ContactConfig;