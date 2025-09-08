// Arquivo de patch para corrigir o enum CellType
import { CellType } from './src/pages/PageGame/types';

// Mapeamento de nomes antigos para os novos
export const SOLID_BLOCK = CellType.Wall;
export const DESTRUCTIBLE_BLOCK = CellType.Breakable;
export const EMPTY = CellType.Empty;

// Exportamos também os valores corretos para facilitar a migração
export {
  CellType
};
