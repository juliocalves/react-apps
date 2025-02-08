import React, { useEffect, useState } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { getPageContent } from "../services/firestore";
import { Carousel } from "react-bootstrap";
import ReactMarkdown from 'react-markdown';
const AboutPage = () => {
  const [content, setContent] = useState({
    title: "",
    description: "",
    history: "",
    mission: "",
    images: [],
  });
  const description = content.description;
  useEffect(() => {
    const fetchContent = async () => {
      const aboutContent = await getPageContent("about");
      if (aboutContent) setContent(aboutContent);
    };

    fetchContent();
  }, []);

  return (
    <PublicLayout>
      <div className="sobre-page">
        <h1>{content.title || "Sobre Nós"}</h1>

       
        {/* Carrossel de Imagens */}
        {content.images.length > 0 ? (
          <Carousel>
            {content.images.map((img, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100" src={img} alt={`Imagem ${index + 1}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p>Carregando imagens...</p>
        )}
          <div className="about-description">
            <ReactMarkdown>
            {description || "Conheça mais sobre nossa história e missão."}
            </ReactMarkdown>
          </div>
        {/* <h2>Nossa História</h2>
        <p>{content.history || "Fundada em 2010, nossa empresa cresceu e se tornou referência."}</p>

        <h2>Nossa Missão</h2>
        <p>{content.mission || "Oferecer experiências únicas para nossos clientes."}</p> */}
      </div>
    </PublicLayout>
  );
};

export default AboutPage;