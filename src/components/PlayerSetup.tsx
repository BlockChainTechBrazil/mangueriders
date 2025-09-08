import React, { useState } from "react";
import useGameStore from "../game/store/gameStore";

interface PlayerSetupProps {
  onSetupComplete: () => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onSetupComplete }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const setPlayer = useGameStore((state) => state.setPlayer);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação do nome
    if (!name.trim()) {
      setError("O nome do jogador é obrigatório");
      return;
    }

    // Usamos um personagem temporário que será escolhido depois
    setPlayer({ name, character: "Alex" });
    console.log("Configuração de jogador salva:", { name });
    onSetupComplete();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Configurar Jogador</h2>
        <p>Escolha seu nome e personagem para entrar no jogo.</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Nome do Jogador <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>          {/* Componente de seleção de personagem removido */}

          <button type="submit" style={styles.button}>
            Salvar e Entrar no Lobby
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    color: "white",
    maxWidth: "400px",
    margin: "auto",
  },
  card: { background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "8px" },
  formGroup: { marginBottom: "15px", textAlign: "left" },
  label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
  required: { color: "#f55", marginLeft: "3px" },
  error: {
    color: "#f55",
    backgroundColor: "rgba(255,80,80,0.1)",
    padding: "8px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    width: "calc(100% - 22px)",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#5cb85c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
    width: "100%",
  },
} as const;

export default PlayerSetup;
