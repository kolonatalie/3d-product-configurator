import { useState } from 'react';
import styles from './Header.module.scss';
import { LogoIcon } from '../UI/Icons';


export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href='https://github.com/kolonatalie' target='blank'>
          <LogoIcon
            size={35}
            className={styles.icon} />
        </a>
      </div>
      <nav className={`${styles.nav} ${isOpen ? styles.showLinks : ''}`}>
        <ul>
          <li><a href="https://github.com/kolonatalie/3d-product-configurator" target='blank'>Code</a></li>
        </ul>
        <button
          className={`${styles.navToggle} ${isOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="open main menu"
        >
          <div className={styles.dotsMenu}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </button>
      </nav>
    </header>
  );
};