import React, { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { SceneManager as SceneManagerType } from '@/engine/SceneManager';
import { Loader } from '@/components/UI/Loader/Loader';
import styles from './CanvasView.module.scss';

const sofaModelPath = '/models/sofa_compressed.glb';

interface CanvasViewProps {
  onLoad: (model: Group) => void;
  onReady: (manager: SceneManagerType | null) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ onLoad, onReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let manager: SceneManagerType | null = null;

    const initScene = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!canvasRef.current || !active) return;

      const { SceneManager } = await import('@/engine/SceneManager');
      manager = new SceneManager(canvasRef.current);
      onReady(manager);

      try {
        manager.getMaxAnisotropy();

        const { ModelLoader } = await import('@/engine/ModelLoader');
        const loader = new ModelLoader();

        const { model, scale } = await loader.loadModel(sofaModelPath, (p) => {
          if (active) setProgress(p);
        });

        if (!active) return;
        model.scale.set(0, 0, 0);
        manager.add(model);
        setIsLoading(false);

        const { gsap } = await import('gsap/gsap-core');
        gsap.to(model.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.1,
          onComplete: () => onLoad(model)
        });
      } catch (error) {
        console.error("Model loading failed:", error);
      }
    };

    initScene();

  const handleResize = () => manager?.resize();
  globalThis.addEventListener('resize', handleResize);

  return () => {
    active = false;
    globalThis.removeEventListener('resize', handleResize);
    manager?.dispose();
  };
}, [onLoad, onReady]);

return (
  <div className={styles.canvasContainer}>
    {isLoading && <Loader progress={progress} />}
    <canvas ref={canvasRef} className={styles.canvas} />
  </div>
);
};