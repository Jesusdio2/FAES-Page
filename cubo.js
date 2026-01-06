import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { SVGRenderer } from 'three/examples/jsm/renderers/SVGRenderer.js';

let renderer;
let useSVG = false; // bandera para alternar

function initRenderer() {
  if (useSVG) {
    renderer = new SVGRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
  } else {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));
  }
  document.body.appendChild(renderer.domElement);
}

// Inicializar con WebGL
initRenderer();

// --- Animación ---
function animate() {
  updateHypercube();

  if (!useSVG) {
    // WebGL con VR
    renderer.setAnimationLoop(() => {
      updateHypercube();
      renderer.render(scene, camera);
    });
  } else {
    // SVG: usar requestAnimationFrame
    function loop() {
      updateHypercube();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    loop();
  }
}

// --- Cambiar modo dinámicamente ---
function toggleRenderer() {
  // limpiar DOM
  document.body.removeChild(renderer.domElement);
  useSVG = !useSVG;
  initRenderer();
  animate();
}

// Botón para alternar
const btn = document.createElement('button');
btn.textContent = 'Cambiar Renderer';
btn.style.position = 'fixed';
btn.style.top = '12px';
btn.style.left = '12px';
btn.style.zIndex = '1000';
document.body.appendChild(btn);
btn.addEventListener('click', toggleRenderer);

animate();
