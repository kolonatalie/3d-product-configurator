import React from 'react';
import styles from './Loader.module.scss';

export const Loader: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.content}>
        <div className={styles.spinner} />
        <p>Loading Experience: {Math.min(Math.round(progress), 100)}%</p>
      </div>
    </div>
  );
};