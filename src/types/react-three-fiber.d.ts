import * as THREE from 'three';
import { Object3DNode, MaterialNode, BufferGeometryNode } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      primitive: Object3DNode<any, any> & { object: any };
      circleGeometry: BufferGeometryNode<THREE.CircleGeometry, typeof THREE.CircleGeometry>;
      meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    primitive: Object3DNode<any, any> & { object: any };
    circleGeometry: BufferGeometryNode<THREE.CircleGeometry, typeof THREE.CircleGeometry>;
    meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
  }
}
