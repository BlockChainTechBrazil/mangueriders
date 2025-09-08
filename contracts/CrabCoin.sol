// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CrabCoin is ERC20, Ownable, ReentrancyGuard {
    // Configurações
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10 ** 18; // 1 milhão de tokens
    uint256 public constant CLEANING_REWARD = 10 * 10 ** 18; // 10 tokens por limpeza
    uint256 public constant CRAB_REWARD = 1 * 10 ** 18; // 1 token por crab encontrado

    // Mapeamentos para controle de recompensas
    mapping(address => uint256) public cleaningRewards;
    mapping(address => uint256) public crabRewards;

    // Eventos
    event CleaningReward(address indexed player, uint256 amount);
    event CrabReward(address indexed player, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("CrabCoin", "CRAB") Ownable(msg.sender) {
        // Mint inicial para o owner
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Recompensar jogador por limpeza
     */
    function rewardCleaning(address player) public onlyOwner nonReentrant {
        require(player != address(0), "Invalid player address");

        cleaningRewards[player] += CLEANING_REWARD;
        _mint(player, CLEANING_REWARD);

        emit CleaningReward(player, CLEANING_REWARD);
        emit TokensMinted(player, CLEANING_REWARD);
    }

    /**
     * @dev Recompensar jogador por encontrar crab
     */
    function rewardCrab(address player) public onlyOwner nonReentrant {
        require(player != address(0), "Invalid player address");

        crabRewards[player] += CRAB_REWARD;
        _mint(player, CRAB_REWARD);

        emit CrabReward(player, CRAB_REWARD);
        emit TokensMinted(player, CRAB_REWARD);
    }

    /**
     * @dev Mint adicional para o owner (se necessário)
     */
    function mintAdditional(uint256 amount) public onlyOwner {
        _mint(owner(), amount);
        emit TokensMinted(owner(), amount);
    }

    /**
     * @dev Getters para estatísticas
     */
    function getTotalCleaningRewards(
        address player
    ) public view returns (uint256) {
        return cleaningRewards[player];
    }

    function getTotalCrabRewards(address player) public view returns (uint256) {
        return crabRewards[player];
    }

    function getTotalRewards(address player) public view returns (uint256) {
        return cleaningRewards[player] + crabRewards[player];
    }

    /**
     * @dev Função de emergência para queimar tokens (se necessário)
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Overrides necessários
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
