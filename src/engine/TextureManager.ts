import {
  Texture,
  TextureLoader,
  SRGBColorSpace
} from 'three';

class TextureManager {
  private readonly cache = new Map<string, Texture>();
  private readonly loader = new TextureLoader();

  public async load(path: string): Promise<Texture> {
    const cachedTexture = this.cache.get(path);
    if (cachedTexture) {
      return cachedTexture;
    }

    return new Promise((resolve, reject) => {
      this.loader.load(path, (texture) => {
        texture.colorSpace = SRGBColorSpace;
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