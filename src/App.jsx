import React from "react";
import { ToastProvider } from "./components/ui/ToastProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BombLoadingScreen from "./components/BombLoadingScreen";
import ConditionalHeader from "./components/ConditionalHeader";
import GamePage from "./pages/GamePage";
import NFTInventory from "./pages/NFTInventory";
import "./App.css";
import "./styles/gaya/main.css";
import "./styles/gaya/sections.css";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import GayaLandingPage from "./pages/GayaLandingPage";
import NewGayaLandingPage from "./pages/NewGayaLandingPage";
import { WalletProvider } from "./context/WalletContext";
import ResourceManager from "./components/ResourceManager";
import AvalancheGaya from "./pages/AvalancheGaya";
import MultiplayerPage from "./pages/MultiplayerPage";
import GamePageMultiplayer from "./pages/GamePageMultiplayer.tsx";
import SobrePage from "./pages/SobrePage";
import { useWallet } from "./context/WalletContext";
import Footer from "./components/Footer";

function App() {
  // const [isLoading, setIsLoading] = useState(true);

  // const handleLoadingComplete = () => {
  //   setIsLoading(false);
  // };

  // if (isLoading) {
  //   return <BombLoadingScreen onLoadingComplete={handleLoadingComplete} />;
  // }

  return (
    <ToastProvider>
      <Router>
        <ResourceManager>
          <WalletProvider>
            <div className="App">
              {/* <AppSidebar /> */}
              <ConditionalHeader />

              <div className="content-wrapper pt-20 transition-all">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/sobre" element={<SobrePage />} />
                  {/* Rotas protegidas por conexão da carteira */}
                  <Route path="/multiplayer" element={<ProtectedRoute><MultiplayerPage /></ProtectedRoute>} />
                  <Route path="/nft" element={<NFTInventory />} />
                  <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
                  <Route path="/multiplayer/game" element={<ProtectedRoute><GamePageMultiplayer /></ProtectedRoute>} />
                  <Route path="/landing" element={<LandingPage />} />{" "}
                  {/* Agora é a rota principal, mantido para compatibilidade */}
                  <Route path="/gaya" element={<AvalancheGaya />} />
                  <Route path="/gaya1" element={<NewGayaLandingPage />} />
                  <Route path="/gaya2" element={<GayaLandingPage />} />
                </Routes>
              <Footer />
              </div>
            </div>
          </WalletProvider>
        </ResourceManager>
      </Router>
    </ToastProvider>
  );
}

// Componente de rota protegida por conexão de carteira
const ProtectedRoute = ({ children }) => {
  // Nota: ConditionalWalletProvider carrega WalletProvider nestas rotas, então o hook estará disponível
  const { isConnected } = useWallet();
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default App;
