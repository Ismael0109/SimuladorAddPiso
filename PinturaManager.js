import * as THREE from 'three';

export class PinturaManager {
    constructor(paredes, renderer, camera, controls) {
        this.paredes = paredes;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;
        this.corAtual = new THREE.Color('#b4b4b4');
        this.modoPinturaAtivo = false;
        
        this.initUI();
        this.setupEventListeners();
    }

    initUI() {
        this.colorPicker = document.getElementById('color-picker');
        this.hexCode = document.getElementById('hex-code');
        this.pincelBtn = document.getElementById('pincel-btn');
        this.instrucoes = document.getElementById('instrucoes');
    }

    setupEventListeners() {
        // Atualizar cor quando o seletor muda
        this.colorPicker.addEventListener('input', (e) => {
            this.corAtual.set(e.target.value);
            this.hexCode.textContent = e.target.value.toUpperCase();
        });

        // Botão de pintura
        this.pincelBtn.addEventListener('click', () => {
            this.toggleModoPintura();
        });

        // Tecla ESC para cancelar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modoPinturaAtivo) {
                this.desativarModoPintura();
            }
        });
    }

    toggleModoPintura() {
        if (this.modoPinturaAtivo) {
            this.desativarModoPintura();
        } else {
            this.ativarModoPintura();
        }
    }

    ativarModoPintura() {
        this.modoPinturaAtivo = true;
        this.pincelBtn.classList.add('ativo');
        this.instrucoes.style.display = 'block';
        this.controls.enabled = false;
        this.renderer.domElement.style.cursor = 'pointer';
        
        // Configurar evento de clique
        this.clickListener = (event) => this.pintarParede(event);
        this.renderer.domElement.addEventListener('click', this.clickListener);
    }

    desativarModoPintura() {
        this.modoPinturaAtivo = false;
        this.pincelBtn.classList.remove('ativo');
        this.instrucoes.style.display = 'none';
        this.controls.enabled = true;
        this.renderer.domElement.style.cursor = '';
        
        if (this.clickListener) {
            this.renderer.domElement.removeEventListener('click', this.clickListener);
        }
    }

    pintarParede(event) {
        if (!this.modoPinturaAtivo) return;

        // Coordenadas do mouse
        const mouse = new THREE.Vector2(
            (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        );

        // Configurar raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        // Verificar interseções
        const intersects = raycaster.intersectObjects(this.paredes);

        if (intersects.length > 0) {
            const parede = intersects[0].object;
            parede.material.color.copy(this.corAtual);
            parede.material.needsUpdate = true;
            
            // Feedback visual
            parede.material.emissive.setHex(0x111111);
            setTimeout(() => {
                parede.material.emissive.setHex(0x000000);
            }, 200);
        }
    }
}