import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Componente para criar efeitos visuais do carnaval de Recife
export const CarnivalEffects = () => {
  const containerRef = useRef(null);
  const [confetti, setConfetti] = useState([]);

  // Função para criar um novo confete
  const createConfetti = () => {
    // Cores disponíveis para os confetes
    const colors = ["orange", "blue", "yellow", "pink", "purple", "green"];
    // Formas disponíveis
    const shapes = ["square", "circle", "triangle"];

    // Gerar propriedades aleatórias
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomId = `confetti-${Date.now()}-${Math.random()}`;
    const randomLeft = `${Math.random() * 100}%`;
    const randomDuration = 4 + Math.random() * 6; // Entre 4 e 10 segundos
    const randomRotation = Math.random() * 720 - 360; // Entre -360 e 360 graus
    const randomTravelX = Math.random() * 200 - 100; // Entre -100px e 100px

    return {
      id: randomId,
      color: randomColor,
      shape: randomShape,
      style: {
        left: randomLeft,
        "--travel-x": `${randomTravelX}px`,
        "--rotation": `${randomRotation}deg`,
        animationDuration: `${randomDuration}s`,
      },
    };
  };

  // Efeito para adicionar confetes periodicamente
  useEffect(() => {
    // Iniciar com alguns confetes
    const initialConfetti = Array.from({ length: 15 }, createConfetti);
    setConfetti(initialConfetti);

    // Adicionar novos confetes a cada segundo
    const interval = setInterval(() => {
      setConfetti((prev) => {
        // Remover confetes antigos se houver mais de 50
        const filtered = prev.length > 50 ? prev.slice(prev.length - 50) : prev;
        return [...filtered, createConfetti()];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // URLs de imagens de Recife e do carnaval (placeholder)
  const recifeCarnivalImages = [
    {
      url: "https://imgur.com/Gvjs64f.jpg", // Marco Zero
      alt: "Marco Zero do Recife",
      style: {
        width: "200px",
        top: "15%",
        left: "10%",
        "--rotation": "-5deg",
        "--float-time": "12",
        "--float-x": "15px",
        "--float-y": "-12px",
      },
    },
    {
      url: "https://imgur.com/KNkGI6L.jpg", // Bonecos de Olinda
      alt: "Bonecos gigantes de Olinda",
      style: {
        width: "180px",
        top: "25%",
        right: "12%",
        "--rotation": "3deg",
        "--float-time": "15",
        "--float-x": "-20px",
        "--float-y": "-15px",
      },
    },
    {
      url: "https://imgur.com/gdGzuKm.jpg", // Frevo
      alt: "Dançarinos de Frevo",
      style: {
        width: "150px",
        bottom: "20%",
        left: "15%",
        "--rotation": "7deg",
        "--float-time": "10",
        "--float-x": "25px",
        "--float-y": "-10px",
      },
    },
    {
      url: "https://imgur.com/4QzjqyM.jpg", // Galo da Madrugada
      alt: "Galo da Madrugada",
      style: {
        width: "170px",
        bottom: "30%",
        right: "15%",
        "--rotation": "-8deg",
        "--float-time": "14",
        "--float-x": "-15px",
        "--float-y": "-20px",
      },
    },
  ];

  return (
    <>
      {/* Container para os confetes */}
      <div ref={containerRef} className="confetti-container">
        {confetti.map((item) => (
          <div
            key={item.id}
            className={`confetti confetti-${item.color} confetti-${item.shape}`}
            style={item.style}
          />
        ))}
      </div>
      {/* Container para as imagens de Recife */}
      <div className="recife-images-container">
        {recifeCarnivalImages.map((image, index) => (
          <motion.img
            key={`recife-image-${index}`}
            src={image.url}
            alt={image.alt}
            className="recife-image"
            style={image.style}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.5, 0.7] }}
            transition={{
              duration: 5,
              delay: index * 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Vídeo de fundo do carnaval de Recife */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="carnival-video-background"
      >
        <source src="https://imgur.com/GUDcjDi.mp4" type="video/mp4" />
      </video>
    </>
  );
};

export default CarnivalEffects;
