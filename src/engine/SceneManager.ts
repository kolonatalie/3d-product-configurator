import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  ShadowMaterial,
  Mesh,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  PMREMGenerator,
  Object3D
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import Stats from 'stats.js';

export class SceneManager {
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly renderer: WebGLRenderer;
  private readonly controls: OrbitControls;
  private frameId: number | null = null;
  private readonly stats?: Stats;
  

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(
      40,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 2, 2);

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.75;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    const pmremGenerator = new PMREMGenerator(this.renderer);
    const roomEnv = new RoomEnvironment();
    this.scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const isDebug = new URLSearchParams(globalThis.location.search).get('debug') === 'true';

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
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.update();

    this.animate();
    this.initFloor();
  }

  private initLights(): void {
    const ambientLight = new AmbientLight('#ffffff', 0.2);
    this.scene.add(ambientLight);

    const sunLight = new DirectionalLight('#ffffff', 0.8);
    sunLight.position.set(5, 8, 5);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.set(512, 512);
    sunLight.shadow.camera.left = -3;
    sunLight.shadow.camera.right = 3;
    sunLight.shadow.camera.top = 3;
    sunLight.shadow.camera.bottom = -3;
    sunLight.shadow.radius = 4;
    sunLight.shadow.blurSamples = 4;

    this.scene.add(sunLight);
  }

  private initFloor(): void {
    const planeGeometry = new PlaneGeometry(20, 20);
    const planeMaterial = new ShadowMaterial({
      opacity: 0.1,
    });

    const floor = new Mesh(planeGeometry, planeMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;

    this.scene.add(floor);
  }

  public takeScreenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }


  private readonly animate = (): void => {
    this.stats?.begin();
    this.frameId = globalThis.requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.stats?.end();
  };

  public add(object: Object3D): void {
    this.scene.add(object);
  }

  public resize(): void {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    if (this.frameId) globalThis.cancelAnimationFrame(this.frameId);

    this.stats?.dom.remove();

    this.scene.traverse((object) => {
      if (object instanceof Mesh) {
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
    this.scene.environment?.dispose();
    this.scene.clear();
  }
}