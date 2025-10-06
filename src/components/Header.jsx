import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Removido WalletConnect local: usaremos o WalletContext diretamente
import { useWallet } from "@/context/WalletContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Contexto da wallet
  const {
    isConnected,
    walletAddress,
    balance,
    networkName,
    isCorrectNetwork,
    ownedNFTs,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  // Não precisamos mais simular jogadores online, já que o componente foi substituído
  // Efeito para detectar scroll e mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito para fechar menu da wallet ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletMenuOpen && !event.target.closest(".wallet-menu-container")) {
        setWalletMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [walletMenuOpen]);

  // Verificar se a rota atual está ativa
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navegação com checagem de conexão para telas de jogo
  const handleNavClick = (path) => {
    const requiresWallet = ["/game"];
    if (requiresWallet.includes(path) && !isConnected) {
      // Abre menu da wallet para incentivar conexão
      setWalletMenuOpen(true);
      return;
    }
    navigate(path);
  };
  // Array de rotas para o header
  const routes = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/game", label: "Solo", icon: "▶️" },
    { path: "/nft", label: "NFTs", icon: "💎" },
    { path: "/sobre", label: "Sobre", icon: "ℹ️" },
  ];

  return (
    <>
      {/* Header Tecnológico Fixo */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg shadow-cyan-500/10"
          : "bg-transparent"
          }`}
      >
        {/* Padrão tecnológico de fundo */}
        <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFCC00' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div
              className="flex items-center group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center mr-3 relative group-hover:scale-110 transition-all duration-300">
                <span className="text-xl">💣</span>
                {/* Efeito de brilho em torno do logo */}
                <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300"></div>
                {/* Efeito de pulse */}
                <div className="absolute -inset-2 rounded-full border border-yellow-500 opacity-0 group-hover:opacity-100 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                  MANGUERIDER
                </h1>
                <div className="text-xs text-gray-400 font-mono">
                  /* VIRTUAL EXPERIENCE */
                </div>
              </div>
            </div>{" "}
            {/* Menu de navegação para desktop */}
            <nav className="hidden md:block">
              <ul className="flex space-x-1.5 items-center">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button
                      onClick={() => handleNavClick(route.path)}
                      className={`header-button relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden ${isActive(route.path)
                        ? "text-black"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {isActive(route.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 -z-10"></div>
                      )}
                      <span className="flex items-center">
                        <span className="mr-1.5 text-base">{route.icon}</span>
                        {route.label}
                      </span>
                      {isActive(route.path) && (
                        <>
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-yellow-400"></span>
                          <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-yellow-400 notification-pulse"></span>
                        </>
                      )}
                    </button>
                  </li>
                ))}{" "}
                {/* Botão Wallet Menu com efeito especial (sempre visível) */}
                <li className="ml-2 relative">
                  <div className="relative wallet-menu-container">
                    {/* Botão da Wallet */}
                    <button
                      onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                      className="relative group px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/50 rounded-lg overflow-hidden transition-all duration-300 hover:bg-cyan-600/30"
                    >
                      <span className="relative z-10 flex items-center text-sm text-cyan-300 font-semibold group-hover:text-white transition-colors duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {isConnected ? (
                          <span>
                            {walletAddress
                              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                              : "Conectado"}
                          </span>
                        ) : (
                          "Conectar"
                        )}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 ml-1 transition-transform duration-200 ${walletMenuOpen ? "rotate-180" : ""}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </button>

                    {/* Menu Dropdown */}
                    {walletMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-xl z-50">
                        {!isConnected ? (
                          /* Seção de conexão */
                          <div className="p-4">
                            <h3 className="text-cyan-300 font-semibold mb-3">Conectar Carteira</h3>
                            <p className="text-xs text-gray-400 mb-3">Conecte sua carteira para jogar e acessar recursos.</p>
                            <button
                              onClick={async () => {
                                console.log('🔄 Header: Clique no botão conectar');
                                try {
                                  console.log('🔄 Header: Chamando connectWallet...');
                                  await connectWallet();
                                  console.log('✅ Header: Wallet conectada com sucesso');
                                  setWalletMenuOpen(false);
                                } catch (e) {
                                  console.error('❌ Header: Erro ao conectar carteira:', e);
                                  alert(e?.message || "Falha ao conectar carteira");
                                }
                              }}
                              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-600 hover:to-blue-700 transition-colors"
                            >
                              Conectar com a carteira
                            </button>
                          </div>
                        ) : (
                          /* Seção conectada */
                          <div className="p-4 space-y-4">
                            {/* Info da Wallet */}
                            <div className="border-b border-cyan-500/20 pb-3">
                              <h3 className="text-cyan-300 font-semibold mb-2">Minha Carteira</h3>
                              <div className="space-y-1 text-sm text-gray-300">
                                <div className="flex justify-between">
                                  <span>Endereço:</span>
                                  <span className="text-cyan-200 font-mono">
                                    {walletAddress?.substring(0, 10)}...{walletAddress?.substring(walletAddress.length - 6)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Saldo:</span>
                                  <span className="text-green-400 font-semibold">{balance} ETH</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Rede:</span>
                                  <span className={isCorrectNetwork ? "text-green-400" : "text-orange-400"}>{networkName}</span>
                                </div>
                              </div>
                            </div>

                            {/* NFTs Possuídos */}
                            <div className="border-b border-cyan-500/20 pb-3">
                              <h4 className="text-cyan-300 font-semibold mb-2">Meus NFTs ({ownedNFTs.length})</h4>
                              {ownedNFTs.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto">
                                  {ownedNFTs.slice(0, 4).map((nft, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-cyan-900/20 border border-cyan-500/20 rounded p-2 text-xs text-cyan-100">
                                      {nft.image ? (
                                        <img src={nft.image} alt={`NFT ${nft.tokenId}`} className="w-6 h-6 rounded object-cover" />
                                      ) : (
                                        <div className="w-6 h-6 rounded bg-cyan-800/40 flex items-center justify-center">💎</div>
                                      )}
                                      <div className="flex-1 truncate">
                                        <div className="truncate">#{nft.tokenId} • {nft.element} • {nft.rarity}</div>
                                      </div>
                                    </div>
                                  ))}
                                  {ownedNFTs.length > 4 && (
                                    <div className="bg-gray-700/50 border border-gray-500/20 rounded p-2 text-xs text-gray-300 flex items-center justify-center">
                                      +{ownedNFTs.length - 4} mais
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">Nenhum NFT encontrado</p>
                              )}
                            </div>

                            {/* Menu de Ações */}
                            <div className="space-y-2">
                              <button
                                onClick={() => {
                                  setHistoryModalOpen(true);
                                  setWalletMenuOpen(false);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-600/20 rounded-lg transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Histórico de Transações
                              </button>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(walletAddress);
                                  alert("Endereço copiado!");
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-600/20 rounded-lg transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                                Copiar Endereço
                              </button>

                              <button
                                onClick={() => window.open(`https://sepolia.etherscan.io/address/${walletAddress}`, "_blank")}
                                className="w-full flex items-center px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-600/20 rounded-lg transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                                Ver no Etherscan
                              </button>

                              <button
                                onClick={() => {
                                  disconnectWallet();
                                  setWalletMenuOpen(false);
                                }}
                                className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                </svg>
                                Desconectar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
            {/* Botão de menu para mobile */}
            <button
              className="md:hidden text-white p-2 relative bg-black/50 rounded-md border border-yellow-500/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span
                  className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? "w-6 -rotate-45 translate-y-2" : "w-6"
                    }`}
                ></span>
                <span
                  className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "w-4"
                    }`}
                ></span>
                <span
                  className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? "w-6 rotate-45 -translate-y-2" : "w-5"
                    }`}
                ></span>
              </div>
              <div className="absolute -inset-px bg-yellow-400/10 rounded-md blur-sm"></div>
            </button>
          </div>

          {/* Menu de navegação para mobile */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen
              ? "max-h-96 opacity-100 scale-y-100"
              : "max-h-0 opacity-0 scale-y-95"
              }`}
            style={{ transformOrigin: "top" }}
          >
            <div className="py-4 space-y-2 relative">
              {/* Linhas decorativas */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/10 to-transparent"></div>

              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button
                      onClick={() => {
                        handleNavClick(route.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left pl-10 pr-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center relative overflow-hidden ${isActive(route.path)
                        ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400"
                        : "text-gray-300 hover:bg-white/5"
                        }`}
                    >
                      {isActive(route.path) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                      )}
                      <span className="mr-3 text-xl">{route.icon}</span>
                      <span>{route.label}</span>
                      {isActive(route.path) && (
                        <span className="ml-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 14.586l5.293-5.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                ))}{" "}
                {/* Wallet Menu para mobile */}
                <li className="mt-4 px-6">
                  <div className="space-y-3">
                    {!isConnected ? (
                      <button
                        onClick={async () => {
                          try {
                            await connectWallet();
                            setMobileMenuOpen(false);
                          } catch (e) {
                            alert(e?.message || "Falha ao conectar carteira");
                          }
                        }}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg border border-cyan-500/40 text-white font-semibold transition-all duration-300 hover:from-cyan-600 hover:to-blue-700"
                      >
                        Conectar com a carteira
                      </button>
                    ) : (
                      <div className="space-y-3">
                        {/* Info da Wallet Mobile */}
                        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                          <h4 className="text-cyan-300 font-semibold mb-2 text-sm">Minha Carteira</h4>
                          <div className="space-y-1 text-xs text-gray-300">
                            <div className="flex justify-between">
                              <span>Endereço:</span>
                              <span className="text-cyan-200 font-mono">{walletAddress?.substring(0, 8)}...{walletAddress?.substring(walletAddress.length - 4)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Saldo:</span>
                              <span className="text-green-400 font-semibold">{balance} ETH</span>
                            </div>
                            <div className="flex justify-between">
                              <span>NFTs:</span>
                              <span className="text-purple-400">{ownedNFTs.length}</span>
                            </div>
                            {ownedNFTs.length > 0 && (
                              <div className="mt-2 grid grid-cols-4 gap-1">
                                {ownedNFTs.slice(0, 4).map((nft, idx) => (
                                  <div key={idx} className="w-10 h-10 rounded overflow-hidden bg-cyan-900/30 border border-cyan-500/20">
                                    {nft.image ? (
                                      <img src={nft.image} alt={`nft ${nft.tokenId}`} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">💎</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Botões de Ação Mobile */}
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setHistoryModalOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center px-3 py-2 text-sm text-cyan-300 bg-cyan-600/20 hover:bg-cyan-600/30 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Histórico
                          </button>

                          <button
                            onClick={() => {
                              disconnectWallet();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-400 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Desconectar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Efeito de borda de energia */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>
        {/* Efeito de circuito */}
        <div className="h-1 w-full overflow-hidden">
          <div className="h-full w-10 bg-yellow-400 animate-circuit"></div>
        </div>
        {/* Efeito de scanline */}
        <div className="scanline hidden md:block"></div>{" "}
      </header>

      {/* Espaçador para compensar o header fixo */}
      <div className="h-24"></div>

      {/* Modal de Histórico de Transações */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-900 to-black border border-cyan-500/30 text-white max-w-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-cyan-300 text-xl">
              📊 Histórico de Transações
            </DialogTitle>
            <DialogDescription className="text-cyan-100">
              Veja todas as suas transações na blockchain
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-96 overflow-y-auto">
            {/* Simulação de transações */}
            <div className="space-y-3">
              {/* Exemplo de transação bem-sucedida */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-green-300 font-semibold">
                      Compra de NFT
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">2 horas atrás</span>
                </div>
                <div className="text-sm text-gray-300 ml-6">
                  <div>Rex #157 - 0.001 ETH</div>
                  <div className="text-xs text-green-400 font-mono">
                    0x1234...5678
                  </div>
                </div>
              </div>

              {/* Exemplo de transação pendente */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-yellow-300 font-semibold">
                      Compra Pendente
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">5 min atrás</span>
                </div>
                <div className="text-sm text-gray-300 ml-6">
                  <div>Aqua #234 - 0.001 ETH</div>
                  <div className="text-xs text-yellow-400 font-mono">
                    0x9876...4321
                  </div>
                </div>
              </div>

              {/* Exemplo de transação falhada */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-red-300 font-semibold">
                      Transação Falhada
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">1 dia atrás</span>
                </div>
                <div className="text-sm text-gray-300 ml-6">
                  <div>Spark #345 - 0.001 ETH</div>
                  <div className="text-xs text-red-400">Saldo insuficiente</div>
                </div>
              </div>

              {/* Transações mais antigas */}
              <div className="bg-gray-800/50 border border-gray-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-green-300 font-semibold">
                      Compra de NFT
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">3 dias atrás</span>
                </div>
                <div className="text-sm text-gray-300 ml-6">
                  <div>Cyber Rex #189 - 0.001 ETH</div>
                  <div className="text-xs text-green-400 font-mono">
                    0xabcd...efgh
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-green-300 font-semibold">
                      Compra de NFT
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">1 semana atrás</span>
                </div>
                <div className="text-sm text-gray-300 ml-6">
                  <div>Bomba Suprema #456 - 0.001 ETH</div>
                  <div className="text-xs text-green-400 font-mono">
                    0x1111...2222
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem se não houver transações */}
            {(!isConnected || ownedNFTs.length === 0) && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-400 mb-2">
                  Nenhuma transação encontrada
                </p>
                <p className="text-sm text-gray-500">
                  {!isConnected
                    ? "Conecte sua carteira para ver o histórico"
                    : "Faça sua primeira compra de NFT para ver as transações aqui"}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-cyan-500/20">
            <button
              onClick={() =>
                window.open("https://sepolia.etherscan.io", "_blank")
              }
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Ver no Etherscan →
            </button>
            <button
              onClick={() => setHistoryModalOpen(false)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
