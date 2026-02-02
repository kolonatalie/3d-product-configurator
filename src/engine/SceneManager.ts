import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import Stats from 'stats.js';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private frameId: number | null = null;
  private composer: EffectComposer;
  private stats?: Stats;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color('#dbe6ea');

    this.camera = new THREE.PerspectiveCamera(
      40,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 2, 2);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.65;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      0.1, // Strength
      0.3,  // Radius
      0.97  // Threshold
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    const isDebug = new URLSearchParams(window.location.search).get('debug') === 'true';

    if (isDebug) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      canvas.parentElement?.appendChild(this.stats.dom);
      this.stats.dom.style.position = 'absolute';
      this.stats.dom.style.top = '0px';
      this.stats.dom.style.left = '0px';
    }

    this.initLights();

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.animate();
    this.initFloor();

    //this.scene.add(new THREE.AxesHelper(5));
  }

  private initLights() {
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.1);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#ffffff', 0.5);
    sunLight.position.set(5, 8, 5);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;

    sunLight.shadow.camera.left = -3;
    sunLight.shadow.camera.right = 3;
    sunLight.shadow.camera.top = 3;
    sunLight.shadow.camera.bottom = -3;

    sunLight.shadow.radius = 10;
    sunLight.shadow.blurSamples = 25;

    this.scene.add(sunLight);
  }

  private initFloor() {
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.ShadowMaterial({
      opacity: 0.1,
    });

    const floor = new THREE.Mesh(planeGeometry, planeMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true; 

    this.scene.add(floor);
  }

  public takeScreenshot(): string {
    this.composer.render();
    return this.renderer.domElement.toDataURL('image/png');
  }


  private animate = () => {
    this.stats?.begin();

    this.frameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.composer.render();

    this.stats?.end();
    // console.log('Draw calls:', this.renderer.info.render.calls);
  };

  public add(object: THREE.Object3D) {
    this.scene.add(object);
  }

  public resize() {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  public dispose() {
    if (this.frameId) cancelAnimationFrame(this.frameId);

    if (this.stats?.dom.parentElement) {
      this.stats.dom.parentElement.removeChild(this.stats.dom);
    }

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach(mat => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.controls.dispose();
    this.renderer.dispose();
    this.scene.clear();
  }
}