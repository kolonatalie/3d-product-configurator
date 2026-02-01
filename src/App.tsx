import React, { useState, useCallback, lazy, Suspense } from 'react';
import * as THREE from 'three';
import { SceneManager } from '@/engine/SceneManager';
import { Loader } from './components/UI/Loader/Loader';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import styles from './styles/App.module.scss';

const CanvasView = lazy(() => import('./components/Canvas/CanvasView').then(m => ({ default: m.CanvasView })));
const ConfiguratorPanel = lazy(() => import('./components/UI/ConfiguratorPanel/ConfiguratorPanel').then(m => ({ default: m.ConfiguratorPanel })));

const App: React.FC = () => {
  const [sofa, setSofa] = useState<THREE.Group | null>(null);
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);

  const handleModelLoad = useCallback((model: THREE.Group) => {
    setSofa(model);
  }, []);

  return (
    <div className={styles.appWrapper}>
      <Header />
      <main className={styles.container}>
        <div className={styles.overlay}>
          <h1>3D Sofa Configurator</h1>
          <p>Click and drag to rotate • Scroll to zoom</p>
        </div>
        <Suspense fallback={<Loader progress={0} />}>
          <CanvasView
            onLoad={handleModelLoad}
            onReady={setSceneManager}
          />
          {sofa && (
            <ConfiguratorPanel
              model={sofa}
              sceneManager={sceneManager}
            />
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;