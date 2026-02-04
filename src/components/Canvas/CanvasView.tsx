import React, { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { SceneManager } from '@/engine/SceneManager';
import { Loader } from '@/components/UI/Loader/Loader';
import styles from './CanvasView.module.scss';

const sofaModelPath = '/models/sofa_compressed.glb';

interface CanvasViewProps {
  onLoad: (model: Group) => void;
  onReady: (manager: SceneManager | null) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ onLoad, onReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initId = requestAnimationFrame(async () => {
      if (!canvasRef.current || !active) return;

      const manager = new SceneManager(canvasRef.current);
      sceneManagerRef.current = manager;
      onReady(manager);

      const { ModelLoader } = await import('@/engine/ModelLoader');
      const loader = new ModelLoader();

      try {
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
    });

    const handleResize = () => sceneManagerRef.current?.resize();
    globalThis.addEventListener('resize', handleResize);

    return () => {
      active = false;
      cancelAnimationFrame(initId);
      globalThis.removeEventListener('resize', handleResize);
      sceneManagerRef.current?.dispose();
      sceneManagerRef.current = null;
      onReady(null);
    };
  }, [onLoad, onReady]);

  return (
    <div className={styles.canvasContainer}>
      {isLoading && <Loader progress={progress} />}
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};