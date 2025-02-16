import React from "react";
// import ImageWithModal from "./ImageModal";
// import { FaTrash } from "react-icons/fa";

const ReservationsConfig = ({ reservation, handleChange, handleImageUpload, handleDeleteImage, isUploading, isSaving }) => {
    const reservationsItems = [
        {
          title: "Título e Descrição",
          content: (
            <>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Título"
                value={reservation.title}
                onChange={(e) => handleChange("reservation", "title", e.target.value)}
              />
              <textarea
                className="form-control mb-3"
                placeholder="Descrição"
                value={reservation.description}
                onChange={(e) => handleChange("reservation", "description", e.target.value)}
              />
            </>
          )
        }
      ];

  return (
    <div>
      {reservationsItems.map((item, index) => (
        <div key={index} className="mb-4">
          <h5>{item.title}</h5>
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default ReservationsConfig;