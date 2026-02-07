# 3D Sofa Configurator | [Live Demo](https://3d-sofa-configurator.vercel.app)

![Three.js](https://img.shields.io/badge/Three.js-20232A?style=for-the-badge&logo=threejs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Sass (SCSS)](https://img.shields.io/badge/Sass(SCSS)-hotpink?style=for-the-badge&logo=sass&logoColor=white)


A high-performance, photorealistic 3D product customizer built with React, Three.js, and TypeScript. It features a modular 3D engine, PBR materials, and real-time performance optimization.

[![3D Sofa Configurator](/src/assets/demo-sofa.gif)](https://3d-sofa-configurator.vercel.app)

## Features
- **Real-time Customization:** Swap textures (fabric) and colors (wood) instantly using a custom PBR-ready system.
- **Photorealistic Rendering:** Powered by RoomEnvironment and ACES Filmic tone mapping.
- **Optimized Scene Graph:** Minimized Draw Calls through material sharing and geometry batching.
- **Memory Efficiency:** Strict disposal of geometries and materials to prevent memory leaks.
- **Screenshot Engine:** Built-in tool to capture customized designs.

## Tech Stack
- **Frontend:** React 18 / TypeScript / Vite
- **3D Engine:** Three.js (WebGL)
- **Animation:** GSAP
- **Styling:** Sass (SCSS)


## Installation
```Bash
# Clone the repository
git clone https://github.com/kolonatalie/3d-product-configurator

# Install dependencies
npm install --legacy-peer-deps

# Start development server
git init && npx husky install
npm run dev
```


## Available Scripts
|  |  |
| :--- | :--- |
|`npm run dev`| Starts Vite dev server at `http://localhost:3000` |
|`npm run build`| Runs Type-check (`tsc`) and builds the project with Vendor Splitting (React, GSAP into separate chunks).|
|`npm run preview`| Locally previews the production build|
|`npm run lint`| Audits JS/TS and SCSS for errors.|
|`npm run lint:fix` | Automatically fixes linting and styling issues.|

---

## Connect with Me

I'm always open to feedback, collaboration, and connecting with fellow developers.

[![LinkedIn Badge](https://img.shields.io/badge/LinkedIn-563D6F?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kolonatalie/)
[![X Badge](https://img.shields.io/badge/X-8A62B3?style=for-the-badge&logo=x&logoColor=white)](https://x.com/dev_kolonatalie)
[![Bluesky Badge](https://img.shields.io/badge/Bluesky-A575D4?style=for-the-badge&logo=bluesky&logoColor=white)](https://bsky.app/profile/kolonatalie.bsky.social)
[![Mastodon Badge](https://img.shields.io/badge/Mastodon-704F91?style=for-the-badge&logo=mastodon&logoColor=white)](https://mastodon.social/@kolonatalie)
[![GitHub Badge](https://img.shields.io/badge/GitHub-3D2B4F?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kolonatalie)

---

**`Keywords & Topics`**

`threejs`, `webgl`, `gsap`, `typescript`, `react`, `pbr`, `3d-configurator`, `performance`, `creative-coding`, `frontend-engineering`, `web-animation`, `3d-visualization`
