import * as THREE from 'three';

class TextureManager {
  private cache = new Map<string, THREE.Texture>();
  private loader = new THREE.TextureLoader();

  public async load(path: string): Promise<THREE.Texture> {
    const cachedTexture = this.cache.get(path);
    if (cachedTexture) {
      return Promise.resolve(cachedTexture);
    }

    return new Promise((resolve, reject) => {
      this.loader.load( path,(texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.flipY = false;
          texture.anisotropy = 16;
          
          this.cache.set(path, texture);
          resolve(texture);
        },
        undefined,
        (err) => {
          console.error(`Error loading texture: ${path}`, err);
          reject(err);
        }
      );
    });
  }

  public dispose() {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
  }
}

export const textureManager = new TextureManager();