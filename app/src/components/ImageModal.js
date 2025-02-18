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

/**
 * ImageWithModal component renders an image that opens a modal when clicked.
 *
 * @param {Object} props - The component props.
 * @param {string} props.imageUrl - The URL of the image to display.
 * @param {string} props.altText - The alt text for the image.
 *
 * @returns {JSX.Element} The rendered component.
 */
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