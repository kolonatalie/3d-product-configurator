import {
  Object3D,
  Group,
  Mesh,
  Material,
  RepeatWrapping,
  MeshStandardMaterial,
  Color
} from 'three';

import { gsap } from 'gsap';
import { textureManager } from './TextureManager';
import { SceneManager } from './SceneManager';


type MaterialMapKeys = 'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap';

const playPulseAnimation = (object: Object3D) => {

  if (object.userData.baseScale === undefined) {
    object.userData.baseScale = object.scale.x;
  }
  const finalScale = object.userData.baseScale;
  gsap.killTweensOf(object.scale);

  gsap.to(object.scale, {
    x: finalScale * 1.02,
    y: finalScale * 1.02,
    z: finalScale * 1.02,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out',
    onComplete: () => {
      gsap.set(object.scale, { x: finalScale, y: finalScale, z: finalScale });
    }
  });
};

const preparePart = (model: Group, partName: string): Mesh[] => {
  const container = model.getObjectByName(partName);
  if (!container) return [];

  const meshes: Mesh[] = [];
  container.traverse((child) => {
    if ((child as Mesh).isMesh) meshes.push(child as Mesh);
  });

  if (meshes.length > 0) playPulseAnimation(model);
  return meshes;
};

export const resetPartToOriginal = (model: Group, partName: string) => {
  const meshes = preparePart(model, partName);

  meshes.forEach((mesh) => {
    const original = mesh.userData.originalMaterial;
    if (!original) return;

    const clonedMaterial = original.clone();
    mesh.material = clonedMaterial;

    if (clonedMaterial instanceof Material) {
      clonedMaterial.needsUpdate = true;
    }
  });
};

export const changePartTexture = async (
  model: Group,
  partName: string,
  mapsConfig: Record<string, string>
) => {
  const meshes = preparePart(model, partName);
  if (!meshes) return;

  try {
    const loadTasks = Object.entries(mapsConfig).map(async ([mapType, path]) => {
      const texture = await textureManager.load(path);
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(4, 4);
      texture.anisotropy = 16;

      return { mapType: mapType as MaterialMapKeys, texture };
    });

    const loadedMaps = await Promise.all(loadTasks);

    meshes.forEach((mesh) => {
      const material = mesh.material;
      if (material instanceof MeshStandardMaterial) {
        loadedMaps.forEach(({ mapType, texture }) => {
          material[mapType] = texture;
        });
        gsap.to(material.color, { r: 1, g: 1, b: 1, duration: 0.4 });
        material.needsUpdate = true;
      }
    });
  } catch (error) {
    console.error("Texture loading error:", error);
  }
};

export const changePartColor = (model: Group, partName: string, newColor: string) => {
  const meshes = preparePart(model, partName);
  if (!meshes) return;

  const targetColor = new Color(newColor);
  meshes.forEach((mesh) => {
    if (mesh.material instanceof MeshStandardMaterial) {
      gsap.killTweensOf(mesh.material.color);
      gsap.to(mesh.material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  });
};

export const downloadScreenshot = (manager: SceneManager) => {
  const dataURL = manager.takeScreenshot();
  const link = document.createElement('a');

  link.download = `my-sofa-design-${Date.now()}.png`;
  link.href = dataURL;
  link.click();
};