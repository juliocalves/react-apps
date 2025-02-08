import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
const ImageModal = ({ imageUrl, altText, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt={altText} className="modal-image" />
        <button className="modal-close-btn" onClick={onClose}>
            <IoIosClose />
        </button>
      </div>
    </div>
  );
};

const ImageWithModal = ({ imageUrl, altText }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <img
        src={imageUrl}
        alt={altText}
        className="img-thumbnail img-fluid"
        onClick={openModal}
        style={{ cursor: "pointer" }}
      />

      {isModalOpen && (
        <ImageModal imageUrl={imageUrl} altText={altText} onClose={closeModal} />
      )}
    </>
  );
};

export default ImageWithModal;