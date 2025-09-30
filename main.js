import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PinturaManager } from './PinturaManager.js';

// Cena, câmera, render
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e6f9fd');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(3, 5, 3);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 300);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// CHÃO
const chaoGeometry = new THREE.PlaneGeometry(10, 10);
const textureLoader = new THREE.TextureLoader();

// Carregar texturas de piso
let pisoTextures = {
  piso1: textureLoader.load('/texturas/piso1.jpg'),
  piso2: textureLoader.load('/texturas/piso2.jpg'),
  piso3: textureLoader.load('/texturas/piso3.png'),
  piso4: textureLoader.load('/texturas/piso4.png'),
  piso5: textureLoader.load('/texturas/piso5.png')
};

//função para lidar com o carregamento de novas texturas
function setupTextureUpload() {
  const addTextureBtn = document.getElementById('add-texture-btn');
  const fileInput = document.getElementById('texture-file-input');
  
  addTextureBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const textureKey = `userTexture_${Date.now()}`;
      const img = new Image();
      
      img.onload = () => {
        // Criar nova textura
        const texture = new THREE.Texture(img);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        texture.needsUpdate = true;
        
        // Adicionar ao objeto de texturas
        pisoTextures[textureKey] = texture;
        
        // Criar novo elemento de opção
        const container = document.getElementById('conteudo-pisos');
        const newOption = document.createElement('img');
        newOption.className = 'piso-option';
        newOption.dataset.texture = textureKey;
        
        // Usar a imagem carregada como src para visualização
        newOption.src = e.target.result;
        
        // Adicionar evento de clique
        newOption.addEventListener('click', () => {
          trocarPiso(textureKey);
        });
        
        // Inserir antes do botão de adicionar
        container.insertBefore(newOption, addTextureBtn);
        
        // Selecionar automaticamente a nova textura
        trocarPiso(textureKey);
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
    fileInput.value = ''; // Resetar o input para permitir selecionar o mesmo arquivo novamente
  });
}

// Chame esta função após a inicialização
setupTextureUpload();



const chaoMaterial = new THREE.MeshStandardMaterial({ 
  map: pisoTextures.piso1,
  roughness: 0.3
});
const chao = new THREE.Mesh(chaoGeometry, chaoMaterial);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);


// Função para trocar piso
function trocarPiso(textureKey) {
  chaoMaterial.map = pisoTextures[textureKey]; //TextureKey é o número do piso selecionado
  chaoMaterial.needsUpdate = true;
  
  // Atualizar seleção visual
  document.querySelectorAll('.piso-option').forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.texture === textureKey) {
      option.classList.add('selected');
    }
  });
}

// Event listeners para as opções de piso
document.querySelectorAll('.piso-option').forEach(option => {
  option.addEventListener('click', () => {
    trocarPiso(option.dataset.texture);
  });
});

// Restante da cena (paredes, teto, móveis, etc.)
const tetoGeometry = new THREE.PlaneGeometry(10, 10);
const tetoMaterial = new THREE.MeshStandardMaterial({ color: '#b4b4b4' });
const teto = new THREE.Mesh(tetoGeometry, tetoMaterial);
teto.position.y = 3;
teto.rotation.x = Math.PI / 2;
scene.add(teto);

// Paredes
const paredeGeometry = new THREE.PlaneGeometry(10, 3);
const paredeMaterial = new THREE.MeshStandardMaterial({
  color: 0xb4b4b4,
  side: THREE.DoubleSide,
  roughness: 0.4
});

const paredes = [
  createParede(paredeGeometry, paredeMaterial, [0, 1.5, -5], 0),
  createParede(paredeGeometry, paredeMaterial, [0, 1.5, 5], Math.PI),
  createParede(paredeGeometry, paredeMaterial, [-5, 1.5, 0], Math.PI/2),
  createParede(paredeGeometry, paredeMaterial, [5, 1.5, 0], -Math.PI/2)
];

function createParede(geometry, material, position, rotationY) {
  const parede = new THREE.Mesh(geometry, material.clone());
  parede.position.set(...position);
  parede.rotation.y = rotationY;
  parede.receiveShadow = true;
  scene.add(parede);
  return parede;
}
// Sistema de Pintura
const pinturaManager = new PinturaManager(paredes, renderer, camera, controls);


// Carregar modelos GLTF
const loader = new GLTFLoader();

// Cactus
loader.load('/models/Cactus.glb', (gltf) => {
    const modelCactus = gltf.scene;
    modelCactus.scale.set(1, 1, 1);
    modelCactus.position.set(-0.01, 0.5, -1);
    scene.add(modelCactus);
});

// Plantas
loader.load('/models/Planta3.glb', (gltf) => {
    const modelPlantinha = gltf.scene;
    modelPlantinha.scale.set(1.5, 1.5, 1.5);
    modelPlantinha.position.set(3, 0, -4.1);
    scene.add(modelPlantinha);
});

loader.load('/models/Planta3.glb', (gltf) => {
    const modelPlantinha2 = gltf.scene;
    modelPlantinha2.scale.set(1.5, 1.5, 1.5);
    modelPlantinha2.position.set(-3, 0, -4.1);
    scene.add(modelPlantinha2);
});

// Mesinha
loader.load('/models/Table Round Small.glb', (gltf) => {
    const modelMesinha = gltf.scene;
    modelMesinha.scale.set(0.5, 0.5, 0.5);
    modelMesinha.position.set(-0.01, 0, -1);
    scene.add(modelMesinha);
});

// TV
loader.load('/models/TV.glb', (gltf) => {
    const modelTV = gltf.scene;
    modelTV.scale.set(1, 1, 1);
    modelTV.position.set(0.5, 1, -4.8);
    scene.add(modelTV);
});

// Sofás
loader.load('/models/Sofa_Pequeno.glb', (gltf) => {
    const modelSofa = gltf.scene;
    modelSofa.scale.set(0.75, 0.75, 0.75);
    modelSofa.position.set(-2, 0, -1.5);
    modelSofa.rotation.y = Math.PI * 3/4;
    scene.add(modelSofa);
});

loader.load('/models/Sofa_Pequeno.glb', (gltf) => {
    const modelSofa2 = gltf.scene;
    modelSofa2.scale.set(0.75, 0.75, 0.75);
    modelSofa2.position.set(2, 0, -1.5);
    modelSofa2.rotation.y = -Math.PI * 3/4;
    scene.add(modelSofa2);
});



// Animação
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Redimensionamento da janela
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
