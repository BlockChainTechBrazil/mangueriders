/* 
 * Corretivo para o THREE.BufferAttribute
 *
 * Este arquivo fornece um polyfill para o método "addUpdateRange" das BufferAttributes
 * do Three.js quando usado com react-three-fiber. Isso resolve os warnings de depreciação
 * que aparecem quando usamos recursos que internamente usam "updateRange".
 */

import * as THREE from 'three';

// Verifica se estamos no ambiente do cliente
if (typeof window !== 'undefined') {
  // Adiciona um polyfill para o método addUpdateRange se não existir
  if (THREE.BufferAttribute.prototype && !THREE.BufferAttribute.prototype.addUpdateRange) {
    THREE.BufferAttribute.prototype.addUpdateRange = function (start, count) {
      // Este é um método simples para mitigar os warnings
      // até que as bibliotecas dependentes sejam atualizadas
      console.debug(`BufferAttribute.addUpdateRange chamado via polyfill (start: ${start}, count: ${count})`);
      this.needsUpdate = true;
    };
  }

  // Para compatibilidade com certos casos, permitimos que o updateRange ainda funcione
  // mas sem disparar o warning
  const originalDescriptor = Object.getOwnPropertyDescriptor(THREE.BufferAttribute.prototype, 'updateRange');
  if (originalDescriptor && originalDescriptor.get) {
    try {
      // Sobrescrever o getter para não disparar o warning, mas manter a funcionalidade
      Object.defineProperty(THREE.BufferAttribute.prototype, 'updateRange', {
        get: function () {
          return { offset: 0, count: -1 };
        }, set: function (value) {
          // Silenciosamente ignora o set mas marca como needsUpdate
          console.debug(`BufferAttribute.updateRange setter chamado com valor:`, value);
          this.needsUpdate = true;
        },
        configurable: true,
        enumerable: true
      });
    } catch (error) {
      console.warn('Não foi possível aplicar o polyfill para BufferAttribute.updateRange', error);
    }
  }
}
