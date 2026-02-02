import React, { useState } from 'react';
import { SceneManager } from '@/engine/SceneManager';
import { changePartColor, changePartTexture, downloadScreenshot, resetPartToOriginal } from '@/engine/Configurator';
import { Group } from 'three';
import { FABRIC_OPTIONS, WOOD_OPTIONS } from '@/constants/configuratorData';
import { ScreenshotIcon } from '../Icons';
import styles from './ConfiguratorPanel.module.scss';

interface ConfiguratorProps {
  model: Group | null;
  sceneManager: SceneManager | null;
}

const PARTS = {
  CUSHION: 'Sofa_cushion',
  WOOD: 'Sofa_wood'
};

export const ConfiguratorPanel: React.FC<ConfiguratorProps> = ({ model, sceneManager }) => {
  const [activeIds, setActiveIds] = useState({ fabric: 'original', wood: 'default' });

  if (!model || !sceneManager) return null;

  const handleFabricChange = (id: string, maps: Record<string, string>) => {
    setActiveIds(prev => ({ ...prev, fabric: id }));

    if (id === 'original') {
      resetPartToOriginal(model, PARTS.CUSHION);
    } else {
      changePartTexture(model, PARTS.CUSHION, maps);
    }
  };

  const handleWoodChange = (id: string, color: string) => {
    setActiveIds(prev => ({ ...prev, wood: id }));
    changePartColor(model, PARTS.WOOD, color);
  };

  return (
    <aside className={styles.panel}>
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Fabric</p>
        <div className={styles.grid}>
          {FABRIC_OPTIONS.map((f) => (
            <button
              key={f.id}
              className={`${styles.swatch} ${activeIds.fabric === f.id ? styles.active : ''}`}
              style={{ backgroundImage: `url(${f.preview})`, backgroundSize: 'cover' }}
              onClick={() => handleFabricChange(f.id, f.maps)}
              title={f.label}
            />
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Wood finish</p>
        <div className={styles.grid}>
          {WOOD_OPTIONS.map((w) => (
            <button
              key={w.id}
              className={`${styles.swatchWood} ${activeIds.wood === w.id ? styles.active : ''}`}
              style={{ backgroundColor: w.value }}
              onClick={() => handleWoodChange(w.id, w.value)}
              title={w.label}
            />
          ))}
        </div>
      </section>
      <button
        className={styles.screenshotBtn}
        onClick={() => downloadScreenshot(sceneManager)}
      >
        <p className={styles.sectionTitle}>Save</p>
        <ScreenshotIcon 
        size={32}
        className={styles.icon} />
      </button>
    </aside>
  );
};