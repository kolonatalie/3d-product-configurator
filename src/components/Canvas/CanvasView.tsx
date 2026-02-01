import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SceneManager } from '@/engine/SceneManager';
import { ModelLoader } from '@/engine/ModelLoader';
import { Loader } from '@/components/UI/Loader/Loader';
import sofaModelPath from '../../../public/models/sofa.glb';
import styles from './CanvasView.module.scss';
import { gsap } from 'gsap';

interface CanvasViewProps {
  onLoad: (model: THREE.Group) => void;
  onReady: (manager: SceneManager | null) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ onLoad, onReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || sceneManagerRef.current) return;

    const manager = new SceneManager(canvasRef.current);
    sceneManagerRef.current = manager;
    onReady(manager);

    const loader = new ModelLoader();

    loader.loadModel(sofaModelPath, setProgress).then(({ model, scale }) => {

      model.scale.set(0, 0, 0);
      manager.add(model);

      setIsLoading(false);

      gsap.to(model.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 1,
        ease: 'power4.out',
        delay: 0.1,
        onComplete: () => onLoad(model)
      });
    });

    const handleResize = () => manager.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      manager.dispose();
      sceneManagerRef.current = null;
      onReady(null);
    };
  }, [onLoad, onReady]);

  return (
    <>
      {isLoading && <Loader progress={progress} />}
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};