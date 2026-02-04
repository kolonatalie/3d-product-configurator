import {
  Group,
  Box3,
  Vector3,
  Mesh,
  Material,
  MeshStandardMaterial
} from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class ModelLoader {
  private readonly loader: GLTFLoader;
  private readonly dracoLoader: DRACOLoader;

  constructor() {
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    this.dracoLoader.setWorkerLimit(2);

    this.loader = new GLTFLoader();
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  private setupModel(model: Group): void {
    model.traverse((child) => {
      if ((child as Mesh).isMesh) {

        const mesh = child as Mesh;
        const mat = mesh.material;
        mesh.userData.originalMaterial = (mat as Material).clone();
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mat instanceof MeshStandardMaterial) {

          if (mesh.name.includes('wood')) {
            mat.roughness = 0.5;
            mat.metalness = 0;
          } else if (mesh.name.includes('cushion') /*|| mesh.name.includes('fabric')*/) {
            mat.roughness = 0.9;
            mat.metalness = 0;
          }

          if (mat.map) {
            mat.map.anisotropy = 4;
          }
        }
      }
    });
  }

  public async loadModel(path: string, onProgress?: (p: number) => void): Promise<{ model: Group, scale: number }> {
    try {
      const gltf = await this.loader.loadAsync(path, (xhr) => {
        if (onProgress && xhr.total > 0) {
          onProgress((xhr.loaded / xhr.total) * 100);
        }
      });

      const model = gltf.scene;
      this.setupModel(model);
      const scale = this.centerAndScale(model, 3);

      this.dracoLoader.dispose(); 

      return { model, scale };
    } catch (error) {
      console.error('Model loading failed:', error);
      throw error;
    }
  }

  private centerAndScale(model: Group, targetSize: number): number {
    const box = new Box3().setFromObject(model);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scaleFactor = targetSize / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scaleFactor);
    model.children.forEach(child => child.position.sub(center));

    model.position.set(0, 0, 0);
    const updatedBox = new Box3().setFromObject(model);
    model.position.y = -updatedBox.min.y;

    return scaleFactor;
  }
}