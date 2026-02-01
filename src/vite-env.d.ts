declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}