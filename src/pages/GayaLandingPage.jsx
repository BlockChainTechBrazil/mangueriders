import React, { useRef } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import {
  HeroSection,
  AboutSection,
  TokenomicsSection,
  RoadmapSection,
  CommunitySection,
  FAQSection,
  FooterSection,
} from "@/features/gaya/components/sections";
import { Button } from "@/components/ui/button";
import CarnivalEffects from "@/features/gaya/components/CarnivalEffects";

// Estilos específicos para GAYA
import "@/styles/gaya/main.css";
import "@/styles/gaya/sections.css";
import "@/styles/gaya/scroll-fix.css";
import "@/styles/gaya/carnival-effects.css";

// Desativa explicitamente o carregamento de modelos do jogo principal
window.SKIP_GAME_ASSETS = true;

const GayaLandingPage = () => {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Garantir que a página comece na posição inicial correta e desative recursos extras
  React.useEffect(() => {
    // Desativa explicitamente o carregamento de recursos extras quando entra nesta página
    window.SKIP_GAME_ASSETS = true;
    window.LOAD_WALLET = false;
    window.LOAD_NFT = false;
    window.LOAD_GAME = false;
    window.LOAD_3D_MODELS = false;

    console.log(
      "[GAYA] Desativando carregamento de recursos de jogo e blockchain"
    );

    // Adicionar classes para controlar melhor o scroll
    document.body.classList.add("loading-gaya");
    document.body.classList.add("gaya-page");
    document.documentElement.classList.add("gaya-page");

    // Garantir scroll no topo
    // Usamos vários timeouts para garantir que realmente fique no topo
    // mesmo depois de toda a carga da página
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 10);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 100);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 500);

    // Pequeno atraso para garantir que tudo seja carregado corretamente
    const timer = setTimeout(() => {
      document.body.classList.remove("loading-gaya");
    }, 500);

    // Solução drástica para prevenir scroll automático
    const preventAutoScroll = (e) => {
      const scrollContainer = e.currentTarget;

      // Se o scroll foi muito lento ou detectamos que não foi iniciado pelo usuário
      if (
        !scrollContainer._lastScrollTime ||
        Date.now() - scrollContainer._lastScrollTime > 150
      ) {
        // Apenas permitir scroll além de um certo limite para evitar bugs no início
        if (scrollContainer.scrollTop < 150) {
          e.preventDefault();
          e.stopPropagation();
          scrollContainer.scrollTop = 0;
        }
      }

      // Registrar o último tempo de scroll para detectar ações automáticas
      scrollContainer._lastScrollTime = Date.now();
      scrollContainer._lastScrollTop = scrollContainer.scrollTop;
    };

    // Adicionar listener para travar o scroll automático
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", preventAutoScroll);
    }

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("loading-gaya");
      document.body.classList.remove("gaya-page");
      document.documentElement.classList.remove("gaya-page");
      console.log("[GAYA] Limpando recursos na saída da página");

      // Remover listener usando referência segura
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", preventAutoScroll);
      }
    };
  }, []);
  return (
    <>
      {/* <Suspense fallback={<Loader />}>
        <GayaCanvas scrollContainer={containerRef} />
      </Suspense> */}

      {/* Efeitos visuais do carnaval */}
      <CarnivalEffects />

      <div
        ref={containerRef}
        className="h-screen overflow-y-auto overflow-x-hidden w-full landing-container prevent-auto-scroll"
        style={{
          perspective: "1px", // Reduzido drasticamente de 5px para 1px
          scrollBehavior: "auto",
          overscrollBehavior: "none",
          scrollPadding: "15vh", // Aumentado para dar mais espaço
          scrollSnapType: "y proximity", // Adicionado para melhor controle de scroll
        }}
      >
        <div id="hero" className="gaya-section gaya-container">
          <HeroSection />
        </div>
        <div id="about" className="gaya-section gaya-container">
          <AboutSection />
        </div>

        <div id="tokenomics" className="gaya-section">
          <TokenomicsSection />
        </div>

        <div id="roadmap" className="gaya-section">
          <RoadmapSection />
        </div>

        <div id="community" className="gaya-section">
          <CommunitySection />
        </div>

        <div id="faq" className="gaya-section">
          <FAQSection />
        </div>

        <FooterSection />
      </div>
      {/* Botão flutuante de compra no celular */}
      {isMobile && (
        <Button
          className="fixed bottom-6 right-6 z-50 bg-gaya-primary hover:bg-gaya-primary-dark rounded-full w-16 h-16 shadow-lg shadow-gaya-primary/50"
          size="icon"
        >
          <span className="text-2xl">🚀</span>
        </Button>
      )}
    </>
  );
};

export default GayaLandingPage;
