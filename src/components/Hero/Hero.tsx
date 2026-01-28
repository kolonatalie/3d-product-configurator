import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './Hero.module.scss';

export const Hero = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    tl.from(`.${styles.title} span`, {
      y: 100,
      skewY: 7,
      stagger: 0.2,
      opacity: 0,
    })
      .from(`.${styles.description}`, {
        y: 20,
        opacity: 0,
      }, "-=0.8")
      .from(`.${styles.cta}`, {
        y: 50,
        duration: 2,
        opacity: 0,
      }, "-=1");
  }, { scope: container });

  return (
    <section className={styles.hero} ref={container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <div><span>React + GSAP + TS</span></div>
          <div><span>Starter Kit</span></div>
        </h1>
        <p className={styles.description}>
          Architecture is ready. Time to code.
        </p>
        <a
          href="https://github.com/kolonatalie/react-ts-gsap-starter-kit"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          View on GitHub
        </a>
      </div>
    </section>
  );
};