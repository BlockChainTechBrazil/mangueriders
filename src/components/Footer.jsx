import React from 'react';

const Footer = () => (
  <footer className="w-full bg-black/80 text-gray-300 text-center py-6 border-t border-gray-700 mt-12">
    <span>
      © {new Date().getFullYear()} — Projeto desenvolvido por
      <a
        href="https://blockchaintech.dev.br/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:underline ml-1"
      >
        BlockChain Tech Brazil
      </a>
    </span>
  </footer>
);

export default Footer;
