// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MangueRiderNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Configurações
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_MINT_PER_WALLET = 10;

    // Mapeamentos
    mapping(uint256 => string) private _tokenTypes;
    mapping(uint256 => string) private _tokenRarities;
    mapping(uint256 => string) private _tokenElements;
    mapping(address => uint256) private _walletMintCount;

    // Eventos
    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenType,
        string rarity,
        string element,
        string tokenURI
    );

    event ContractWithdrawn(address indexed owner, uint256 amount);
    event MintPausedChanged(bool paused);

    constructor()
        ERC721("MangueRider Characters", "MRIDER")
        Ownable(msg.sender)
    {}

    /**
     * @dev Mint NFT principal - usado pelo frontend
     */
    function mintNFT(
        address to,
        string memory tokenURI_,
        string memory tokenType,
        string memory rarity,
        string memory element
    ) public payable nonReentrant whenMintNotPaused {
        require(msg.value == MINT_PRICE, "Incorrect payment");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(to != address(0), "Invalid recipient");
        require(msg.sender != address(0), "Invalid sender"); // Redundant but explicit
        // Limita tanto por carteira destino quanto por quem paga, mitigando bypass por 'to' diferente
        require(
            _walletMintCount[to] < MAX_MINT_PER_WALLET,
            "Max mint per wallet reached"
        );
        require(
            _walletMintCount[msg.sender] < MAX_MINT_PER_WALLET,
            "Max mint per wallet reached"
        );
        require(bytes(tokenURI_).length > 0, "Token URI cannot be empty");
        require(bytes(tokenType).length > 0, "Token type cannot be empty");
        require(bytes(rarity).length > 0, "Rarity cannot be empty");
        require(bytes(element).length > 0, "Element cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _walletMintCount[to]++;
        _walletMintCount[msg.sender]++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        _tokenTypes[tokenId] = tokenType;
        _tokenRarities[tokenId] = rarity;
        _tokenElements[tokenId] = element;

        emit NFTMinted(to, tokenId, tokenType, rarity, element, tokenURI_);
    }

    /**
     * @dev Mint em lote para o owner (para distribuição inicial)
     */
    function batchMintOwner(
        address[] calldata recipients,
        string[] calldata tokenURIs,
        string[] calldata tokenTypes,
        string[] calldata rarities,
        string[] calldata elements
    ) public onlyOwner {
        require(
            recipients.length == tokenURIs.length,
            "Arrays length mismatch"
        );
        require(
            recipients.length == tokenTypes.length,
            "Arrays length mismatch"
        );
        require(recipients.length == rarities.length, "Arrays length mismatch");
        require(recipients.length == elements.length, "Arrays length mismatch");
        require(
            _tokenIdCounter.current() + recipients.length <= MAX_SUPPLY,
            "Would exceed max supply"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            _mintSingle(
                recipients[i],
                tokenURIs[i],
                tokenTypes[i],
                rarities[i],
                elements[i]
            );
        }
    }

    /**
     * @dev Função interna para mint individual (evita stack too deep)
     */
    function _mintSingle(
        address to,
        string calldata tokenURI_,
        string calldata tokenType,
        string calldata rarity,
        string calldata element
    ) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        _tokenTypes[tokenId] = tokenType;
        _tokenRarities[tokenId] = rarity;
        _tokenElements[tokenId] = element;

        _walletMintCount[to]++;

        // Evento simplificado para evitar stack too deep
        emit NFTMinted(to, tokenId, tokenType, rarity, element, "");
    }

    /**
     * @dev Getters para informações do token
     */
    function getTokenType(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenTypes[tokenId];
    }

    function getTokenRarity(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenRarities[tokenId];
    }

    function getTokenElement(
        uint256 tokenId
    ) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenElements[tokenId];
    }

    function getTokenInfo(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory tokenType,
            string memory rarity,
            string memory element,
            string memory uri
        )
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            _tokenTypes[tokenId],
            _tokenRarities[tokenId],
            _tokenElements[tokenId],
            tokenURI(tokenId)
        );
    }

    /**
     * @dev Getters para estatísticas
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getWalletMintCount(address wallet) public view returns (uint256) {
        return _walletMintCount[wallet];
    }

    function getRemainingMints(address wallet) public view returns (uint256) {
        return MAX_MINT_PER_WALLET - _walletMintCount[wallet];
    }

    /**
     * @dev Listar tokens de um proprietário
     */
    function getTokensOfOwner(
        address owner_
    ) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner_);
        uint256[] memory temp = new uint256[](tokenCount);
        uint256 currentIndex = 0;

        uint256 maxId = _tokenIdCounter.current();
        for (uint256 i = 0; i < maxId; i++) {
            if (_ownerOf(i) == owner_) {
                temp[currentIndex] = i;
                currentIndex++;
                if (currentIndex == tokenCount) {
                    break;
                }
            }
        }

        // Ajusta o tamanho para a quantidade real encontrada
        uint256[] memory tokenIds = new uint256[](currentIndex);
        for (uint256 j = 0; j < currentIndex; j++) {
            tokenIds[j] = temp[j];
        }
        return tokenIds;
    }

    /**
     * @dev Funções administrativas
     */
    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool ok, ) = payable(owner()).call{value: balance}("");
        require(ok, "Withdraw failed");
        emit ContractWithdrawn(owner(), balance);
    }

    function setMintPrice(uint256 /* newPrice */) public view onlyOwner {
        // Permite ajustar o preço se necessário (implementação futura)
        // Por enquanto, mantemos fixo
        revert("Mint price is fixed");
    }

    /**
     * @dev Overrides necessários
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Observação: No OpenZeppelin v5, _burn não é virtual. Caso seja necessário
    // expor uma função de burn, crie uma função pública/admin que chame _burn(tokenId)
    // e depois limpe os metadados customizados (_tokenTypes/_tokenRarities/_tokenElements).

    /**
     * @dev Função de emergência para pausar mints (se necessário)
     */
    bool public mintPaused = false;

    function pauseMint() public onlyOwner {
        mintPaused = true;
        emit MintPausedChanged(true);
    }

    function unpauseMint() public onlyOwner {
        mintPaused = false;
        emit MintPausedChanged(false);
    }

    modifier whenMintNotPaused() {
        require(!mintPaused, "Minting is paused");
        _;
    }

    // Receber ETH diretamente
    receive() external payable {}
    fallback() external payable {}
}
