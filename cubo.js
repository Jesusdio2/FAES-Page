<script type="module">
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const MOVE_STEP = 0.6;   // movimiento por botón
const KEY_STEP = 0.08;   // movimiento por teclado
const GYRO_GAIN_XY = 0.5;
const GYRO_GAIN_Z = 0.1;

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Activar VR ---
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

// Fondo estrellado
scene.background = new THREE.TextureLoader().load('stars.jpg');

// Luces
scene.add(new THREE.AmbientLight(0x404040, 1.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Cubo de referencia
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true })
);
scene.add(cube);

// --- Círculo XY ---
const circleXY = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({length:100}, (_,i)=>{
      const angle = (i/100)*Math.PI*2;
      return new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
    })
  ),
  new THREE.LineBasicMaterial({ color: 0xff0000 })
);
scene.add(circleXY);

// --- Círculo XZ ---
const circleXZ = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({length:100}, (_,i)=>{
      const angle = (i/100)*Math.PI*2;
      return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    })
  ),
  new THREE.LineBasicMaterial({ color: 0x0000ff })
);
scene.add(circleXZ);

// Hipercubo 4D
function hypercubeVertices() {
  const verts = [];
  for (let x of [-1,1]) for (let y of [-1,1]) for (let z of [-1,1]) for (let w of [-1,1]) verts.push({x,y,z,w});
  return verts;
}
function project4Dto3D(v) {
  const factor = 1 / (2 - v.w);
  return new THREE.Vector3(v.x * factor, v.y * factor, v.z * factor);
}
const verts4D = hypercubeVertices();
const edges = [];
for (let i=0;i<verts4D.length;i++){
  for (let j=i+1;j<verts4D.length;j++){
    const diff = (verts4D[i].x!==verts4D[j].x)+(verts4D[i].y!==verts4D[j].y)+(verts4D[i].z!==verts4D[j].z)+(verts4D[i].w!==verts4D[j].w);
    if(diff===1) edges.push([i,j]);
  }
}
const hypercubeLines = new THREE.Group();
edges.forEach(([i,j])=>{
  const lineGeom = new THREE.BufferGeometry().setFromPoints([project4Dto3D(verts4D[i]),project4Dto3D(verts4D[j])]);
  const line = new THREE.Line(lineGeom,new THREE.LineBasicMaterial({color:0xffff00}));
  hypercubeLines.add(line);
});
scene.add(hypercubeLines);

let angle=0;
function rotate4D(v,a){
  const cos=Math.cos(a),sin=Math.sin(a);
  const x=v.x*cos-v.w*sin;
  const w=v.x*sin+v.w*cos;
  const y=v.y*cos-v.z*sin;
  const z=v.y*sin+v.z*cos;
  return {x,y,z,w};
}
function updateHypercube(){
  angle+=0.01;
  const projectedVerts=verts4D.map(v=>project4Dto3D(rotate4D(v,angle)));
  hypercubeLines.children.forEach((line,idx)=>{
    const [i,j]=edges[idx];
    line.geometry.setFromPoints([projectedVerts[i],projectedVerts[j]]);
  });
}

// Cámara inicial
camera.position.set(0,0,5);

// Teclado
const keys={};
document.addEventListener('keydown',e=>keys[e.code]=true);
document.addEventListener('keyup',e=>keys[e.code]=false);

// Botones táctiles
const controls=document.getElementById('controls');
if(controls){
  const actions={
    forward:()=>camera.position.z-=MOVE_STEP,
    back:()=>camera.position.z+=MOVE_STEP,
    left:()=>camera.position.x-=MOVE_STEP,
    right:()=>camera.position.x+=MOVE_STEP,
    up:()=>camera.position.y+=MOVE_STEP,
    down:()=>camera.position.y-=MOVE_STEP
  };
  controls.addEventListener('click',e=>{
    const btn=e.target.closest('button');
    if(!btn) return;
    const action=btn.getAttribute('data-action');
    if(actions[action]) actions[action]();
  });
}

// Giroscopio
function enableGyroIfNeeded(){
  if(!isMobileDevice()) return;
  const needsPermission=typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function';
  if(needsPermission){
    const btn=document.createElement('button');
    btn.textContent='Activar giroscopio';
    btn.style.position='fixed';
    btn.style.top='12px';
    btn.style.right='12px';
    btn.style.zIndex='1000';
    document.body.appendChild(btn);
    btn.addEventListener('click',()=>{
      DeviceOrientationEvent.requestPermission().then(state=>{
        if(state==='granted'){attachDeviceOrientation();btn.remove();}
      });
    });
  }else{
    attachDeviceOrientation();
  }
}
function attachDeviceOrientation(){
  window.addEventListener('deviceorientation',(event)=>{
    const beta=event.beta||0;
    const gamma=event.gamma||0;
    const alpha=event.alpha||0;
    camera.rotation.x=THREE.MathUtils.degToRad(beta)*GYRO_GAIN_XY;
    camera.rotation.y=THREE.MathUtils.degToRad(gamma)*GYRO_GAIN_XY;
    camera.rotation.z=THREE.MathUtils.degToRad(alpha)*GYRO_GAIN_Z;
  });
}
enableGyroIfNeeded();

// --- Animación con WebXR ---
renderer.setAnimationLoop(()=>{
  updateHypercube();
  if(keys['KeyW']) camera.position.z-=KEY_STEP;
  if(keys['KeyS']) camera.position.z+=KEY_STEP;
  if(keys['KeyA']) camera.position.x-=KEY_STEP;
  if(keys['KeyD']) camera.position.x+=KEY_STEP;
  if(keys['Space']) camera.position.y+=KEY_STEP;
  if(keys['ShiftLeft']) camera.position.y-=KEY_STEP;
  renderer.render(scene,camera);
});

// Resize
window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});
</script>
