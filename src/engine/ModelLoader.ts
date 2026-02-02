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
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  private centerAndScale(model: Group, targetSize: number): number {
    const box = new Box3().setFromObject(model);
    const size = new Vector3();
    box.getSize(size);
    const center = new Vector3();
    box.getCenter(center);

    const scaleFactor = targetSize / Math.max(size.x, size.y, size.z);
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    model.children.forEach((child) => {
      child.position.x -= center.x;
      child.position.y -= center.y;
      child.position.z -= center.z;
    });
    model.position.set(0, 0, 0);

    const updatedBox = new Box3().setFromObject(model);
    model.position.y = -updatedBox.min.y;

    return scaleFactor;
  }

  public async loadModel(path: string, onProgress?: (progress: number) => void): Promise<{ model: Group, scale: number }> {
    return new Promise((resolve, reject) => {
      this.loader.load(path, (gltf) => {
        const model = gltf.scene;
        this.setupModel(model);

        const scale = this.centerAndScale(model, 3);
        resolve({ model, scale });
      },
        (xhr) => {
          if (onProgress && xhr.total > 0) {
            const percent = (xhr.loaded / xhr.total) * 100;
            onProgress(percent);
          }
        },
        (error) => {
          console.error('Draco/GLTF loading error:', error);
          reject(error);
        }
      );
    });
  }

  private setupModel(model: Group) {
    model.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.userData.originalMaterial = (mesh.material as Material).clone();
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material instanceof MeshStandardMaterial) {

          if (mesh.name.includes('wood')) {
            mesh.material.roughness = 0.5;
            mesh.material.metalness = 0;
          } else if (mesh.name.includes('cushion') || mesh.name.includes('fabric')) {
            mesh.material.roughness = 0.9;
            mesh.material.metalness = 0;
          }

          if (mesh.material.map) {
            mesh.material.map.anisotropy = 4;
          }
        }
      }
    });
  }
}