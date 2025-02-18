import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { getPageContent } from "../services/firestore";

/**
 * HomePage component that fetches and displays content for the home page.
 * 
 * This component uses the `useState` hook to manage the state of the content and the `useEffect` hook to fetch the content when the component mounts.
 * 
 * The content includes a title, description, image URL, and a call-to-action section. If the content is not available, default values are used.
 * 
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage = () => {
  const [content, setContent] = useState({ title: "", description: "", imageUrl: "", showCta: false, callToAction: "", callToActionButton: "" });

  useEffect(() => {
    const fetchContent = async () => {
      const homeContent = await getPageContent("home");
      if (homeContent) setContent(homeContent);
    };

    fetchContent();
  }, []);

  return (
    <PublicLayout>
      <div className="home-page">
        <main className="main-section">
          <div className="banner-section">
            <h1>{content.title || "Título Padrão"}</h1>
            <p>{content.description || "Descrição padrão da página."}</p>
            {content.imageUrl ? (
              <img src={content.imageUrl} alt="Home" className="banner-image" />
            ) : (
              <img src="..." className="img-fluid" alt="..."/>
            )}
          </div>
          {content.showCta?
          <div className="cta-section">
            <p>{content.callToAction || "Faça sua reserva e garanta o seu lugar!"}</p>
            <Link to="/reserva" className="cta-button">
              {content.callToActionButton || "Reservar Agora"}
            </Link>
          </div>
          :null}
        </main>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
