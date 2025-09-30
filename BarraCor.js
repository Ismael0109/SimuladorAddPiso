// BarraCor.js - Versão Final Funcional
let renderer, camera, controls;
let modoPinturaAtivo = false;
let paredeSelecionada = null;

export function initPintura(threeRenderer, threeCamera, orbitControls) {
    renderer = threeRenderer;
    camera = threeCamera;
    controls = orbitControls;
    
    const colorPicker = document.getElementById('color-picker');
    const hexCode = document.getElementById('hex-code');
    const pincelBtn = document.getElementById('pincel-btn');
    const instrucoes = document.getElementById('instrucoes');

    // Atualização correta da cor
    colorPicker.addEventListener('input', (e) => {
        const cor = e.target.value;
        hexCode.textContent = cor.toUpperCase();
        
        if (paredeSelecionada) {
            paredeSelecionada.material.color.setStyle(cor);
            paredeSelecionada.material.emissive.setHex(0x111111);
            paredeSelecionada.material.needsUpdate = true;
        }
    });

    // Controle do modo pintura
    pincelBtn.addEventListener('click', () => {
        modoPinturaAtivo = !modoPinturaAtivo;
        
        if (modoPinturaAtivo) {
            entrarModoPintura();
        } else {
            sairModoPintura();
        }
    });

    // Tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modoPinturaAtivo) {
            sairModoPintura();
        }
    });
}

function entrarModoPintura() {
    const pincelBtn = document.getElementById('pincel-btn');
    pincelBtn.classList.add('ativo');
    document.getElementById('instrucoes').style.display = 'block';
    controls.enabled = false;
    renderer.domElement.style.cursor = 'pointer';
}

function sairModoPintura() {
    const pincelBtn = document.getElementById('pincel-btn');
    pincelBtn.classList.remove('ativo');
    document.getElementById('instrucoes').style.display = 'none';
    controls.enabled = true;
    renderer.domElement.style.cursor = 'auto';
    
    if (paredeSelecionada) {
        paredeSelecionada.material.emissive.setHex(0x000000);
        paredeSelecionada = null;
    }
}

export function configurarPinturaParedes(paredes) {
    renderer.domElement.addEventListener('click', (event) => {
        if (!modoPinturaAtivo) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        // Coordenadas do mouse normalizadas
        const mouse = new THREE.Vector2(
            (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
            -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
        );
        
        // Configurar raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // Verificar interseções
        const intersects = raycaster.intersectObjects(paredes);
        
        if (intersects.length > 0) {
            const parede = intersects[0].object;
            
            // Remover destaque da parede anterior
            if (paredeSelecionada && paredeSelecionada !== parede) {
                paredeSelecionada.material.emissive.setHex(0x000000);
            }
            
            // Obter cor do seletor
            const cor = document.getElementById('color-picker').value;
            
            // Aplicar nova cor
            parede.material.color.setStyle(cor);
            parede.material.emissive.setHex(0x111111); // Destaque
            parede.material.needsUpdate = true;
            
            paredeSelecionada = parede;
        }
    }, true);
}