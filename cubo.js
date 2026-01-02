// Configuración de sensibilidad
const MOVE_STEP = 0.6;      // paso para botones
const KEY_STEP = 0.08;      // paso para teclado
const ACC_GAIN = 0.05;      // sensibilidad del acelerómetro

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fondo estrellado
scene.background = new THREE.TextureLoader().load('stars.jpg');

// Luces
scene.add(new THREE.AmbientLight(0x404040, 1.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);
const pointLight = new THREE.PointLight(0xffaa00, 1, 100);
pointLight.position.set(-5, -5, -5);
scene.add(pointLight);

// Cubo de referencia
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true })
);
scene.add(cube);

// Hipercubo 4D (igual que antes)
function hypercubeVertices() {
  const verts = [];
  for (let x of [-1, 1]) for (let y of [-1, 1]) for (let z of [-1, 1]) for (let w of [-1, 1]) verts.push({ x, y, z, w });
  return verts;
}
function project4Dto3D(v) {
  const factor = 1 / (2 - v.w);
  return new THREE.Vector3(v.x * factor, v.y * factor, v.z * factor);
}
const verts4D = hypercubeVertices();
const edges = [];
for (let i = 0; i < verts4D.length; i++) {
  for (let j = i + 1; j < verts4D.length; j++) {
    const diff =
      (verts4D[i].x !== verts4D[j].x) +
      (verts4D[i].y !== verts4D[j].y) +
      (verts4D[i].z !== verts4D[j].z) +
      (verts4D[i].w !== verts4D[j].w);
    if (diff === 1) edges.push([i, j]);
  }
}
const hypercubeLines = new THREE.Group();
edges.forEach(([i, j]) => {
  const lineGeom = new THREE.BufferGeometry().setFromPoints([project4Dto3D(verts4D[i]), project4Dto3D(verts4D[j])]);
  const line = new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: 0xffff00 }));
  hypercubeLines.add(line);
});
scene.add(hypercubeLines);

let angle = 0;
function rotate4D(v, a) {
  const cos = Math.cos(a), sin = Math.sin(a);
  const x = v.x * cos - v.w * sin;
  const w = v.x * sin + v.w * cos;
  const y = v.y * cos - v.z * sin;
  const z = v.y * sin + v.z * cos;
  return { x, y, z, w };
}
function updateHypercube() {
  angle += 0.01;
  const projectedVerts = verts4D.map(v => project4Dto3D(rotate4D(v, angle)));
  hypercubeLines.children.forEach((line, idx) => {
    const [i, j] = edges[idx];
    line.geometry.setFromPoints([projectedVerts[i], projectedVerts[j]]);
  });
}

// Cámara inicial
camera.position.set(0, 0, 5);

// Teclado (PC)
const keys = {};
document.addEventListener('keydown', e => (keys[e.code] = true));
document.addEventListener('keyup', e => (keys[e.code] = false));

// --- Acelerómetro: mover cámara en X/Y solamente ---
if (isMobileDevice()) {
  window.addEventListener("devicemotion", (event) => {
    const acc = event.accelerationIncludingGravity;
    if (acc) {
      camera.position.x += acc.x * ACC_GAIN;   // izquierda/derecha
      camera.position.y += acc.y * ACC_GAIN;   // arriba/abajo
      // ❌ NO modificamos camera.position.z (sin zoom)
    }
  });
}

// Animación
function animate() {
  requestAnimationFrame(animate);
  updateHypercube();

  // Movimiento con teclado (PC)
  if (keys['KeyW']) camera.position.z -= KEY_STEP;
  if (keys['KeyS']) camera.position.z += KEY_STEP;
  if (keys['KeyA']) camera.position.x -= KEY_STEP;
  if (keys['KeyD']) camera.position.x += KEY_STEP;
  if (keys['Space']) camera.position.y += KEY_STEP;
  if (keys['ShiftLeft']) camera.position.y -= KEY_STEP;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
