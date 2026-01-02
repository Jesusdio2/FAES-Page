// Configuración de sensibilidad
const MOVE_STEP = 0.6;      // mayor movimiento por click/tap (ajústalo a tu gusto)
const KEY_STEP = 0.08;      // paso por frame con teclado
const GYRO_GAIN_XY = 0.5;   // ganancia de rotación para beta/gamma
const GYRO_GAIN_Z = 0.1;    // ganancia de rotación para alpha

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fondo estrellado (asegúrate de tener stars.jpg en la carpeta)
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

// Círculo XY
const circleXY = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 100 }, (_, i) => {
      const a = (i / 100) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
    })
  ),
  new THREE.LineBasicMaterial({ color: 0xff0000 })
);
scene.add(circleXY);

// Círculo XZ
const circleXZ = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 100 }, (_, i) => {
      const a = (i / 100) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    })
  ),
  new THREE.LineBasicMaterial({ color: 0x0000ff })
);
scene.add(circleXZ);

// Hipercubo 4D
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

// Botones táctiles con paso grande y soporte tap/hold
const controls = document.getElementById('controls');
if (controls) {
  const actions = {
    forward: () => (camera.position.z -= MOVE_STEP),
    back:    () => (camera.position.z += MOVE_STEP),
    left:    () => (camera.position.x -= MOVE_STEP),
    right:   () => (camera.position.x += MOVE_STEP),
    up:      () => (camera.position.y += MOVE_STEP),
    down:    () => (camera.position.y -= MOVE_STEP),
  };

  let holdTimer = null;

  controls.addEventListener('touchstart', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (!actions[action]) return;

    actions[action](); // tap inmediato

    // repetición mientras se mantiene presionado
    holdTimer = setInterval(actions[action], 80);
    e.preventDefault();
  }, { passive: false });

  controls.addEventListener('touchend', () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      holdTimer = null;
    }
  });

  // También habilitar con mouse para pruebas en PC
  controls.addEventListener('mousedown', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (!actions[action]) return;

    actions[action]();
    holdTimer = setInterval(actions[action], 80);
  });
  window.addEventListener('mouseup', () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      holdTimer = null;
    }
  });
}

// Giroscopio (rotación solamente)
function enableGyroIfNeeded() {
  if (!isMobileDevice()) return;

  const needsPermission = typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function';

  if (needsPermission) {
    const btn = document.createElement('button');
    btn.textContent = 'Activar giroscopio';
    btn.style.position = 'fixed';
    btn.style.top = '12px';
    btn.style.right = '12px';
    btn.style.zIndex = '1000';
    btn.style.padding = '12px 16px';
    btn.style.borderRadius = '10px';
    btn.style.border = '2px solid rgba(255,255,255,0.8)';
    btn.style.background = 'rgba(255,255,255,0.12)';
    btn.style.color = '#fff';
    btn.style.fontWeight = '600';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
          attachDeviceOrientation();
          btn.remove();
        } else {
          btn.textContent = 'Permiso denegado';
        }
      }).catch(() => {
        btn.textContent = 'Error permiso';
      });
    });
  } else {
    attachDeviceOrientation();
  }
}

function attachDeviceOrientation() {
  window.addEventListener('deviceorientation', (event) => {
    const beta = event.beta || 0;   // adelante/atrás
    const gamma = event.gamma || 0; // izquierda/derecha
    const alpha = event.alpha || 0; // giro vertical

    const rx = THREE.MathUtils.degToRad(beta) * GYRO_GAIN_XY;
    const ry = THREE.MathUtils.degToRad(gamma) * GYRO_GAIN_XY;
    const rz = THREE.MathUtils.degToRad(alpha) * GYRO_GAIN_Z;

    camera.rotation.set(rx, ry, rz);
  });
}

enableGyroIfNeeded();

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
