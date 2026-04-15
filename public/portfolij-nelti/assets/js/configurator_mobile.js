document.addEventListener('DOMContentLoaded', () => {

    // --- FABRIC.JS 2D MINIMAP ENGINE (MOBILE FRONT/BACK) ---
    const canvasFrontEl = document.getElementById('design-minimap-front');
    const canvasBackEl = document.getElementById('design-minimap-back');
    const wrapperFront = document.getElementById('map-wrapper-front');
    const wrapperBack = document.getElementById('map-wrapper-back');
    
    let fCanvasFront, fCanvasBack;
    let decalTextureFront, decalTextureBack;
    let activeCanvas = null;

    function setupFabric(id) {
        const f = new fabric.Canvas(id);
        // Keep high res internal buffer explicitly
        f.setDimensions({ width: 700, height: 900 }, { backstoreOnly: true });
        // Shrink visual size to perfectly fit tight mobile width limits
        f.setDimensions({ width: 280, height: 360 }, { cssOnly: true });
        f.setBackgroundColor('transparent', f.renderAll.bind(f));
        
        const tex = new THREE.CanvasTexture(document.getElementById(id));
        tex.anisotropy = 16;
        f.on('after:render', () => { tex.needsUpdate = true; });
        
        return { f, tex };
    }

    if (canvasFrontEl && canvasBackEl) {
        const frontParams = setupFabric('design-minimap-front');
        fCanvasFront = frontParams.f;
        decalTextureFront = frontParams.tex;

        const backParams = setupFabric('design-minimap-back');
        fCanvasBack = backParams.f;
        decalTextureBack = backParams.tex;

        activeCanvas = fCanvasFront; // Default
    }

    // --- UI BINDINGS ---
    const addTextBtn = document.getElementById('add-text-btn');
    const fontFamilySelect = document.getElementById('font-family');
    const imageUpload = document.getElementById('image-upload');
    const deleteBtn = document.getElementById('delete-layer-btn');

    if (addTextBtn && activeCanvas) {
        addTextBtn.addEventListener('click', () => {
            const textObj = new fabric.IText('YOUR TEXT', {
                left: 350, top: 450,
                fontFamily: fontFamilySelect.value,
                fontSize: 80, fill: '#121212', // Slightly larger font internally to look better on tiny screens
                originX: 'center', originY: 'center', fontWeight: 'bold'
            });
            activeCanvas.add(textObj);
            activeCanvas.setActiveObject(textObj);
        });
    }

    if(fontFamilySelect && activeCanvas) {
        fontFamilySelect.addEventListener('change', () => {
            const active = activeCanvas.getActiveObject();
            if (active && active.type === 'i-text') {
                active.set({ fontFamily: fontFamilySelect.value });
                activeCanvas.renderAll();
            }
        });
        setInterval(() => {
            if(!activeCanvas) return;
            const actObj = activeCanvas.getActiveObject();
            if(actObj && actObj.type === 'i-text' && document.activeElement !== fontFamilySelect) {
                fontFamilySelect.value = actObj.fontFamily;
            }
        }, 500);
    }

    if(imageUpload && activeCanvas) {
        imageUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    fabric.Image.fromURL(evt.target.result, function(img) {
                        const scale = Math.min(300 / img.width, 300 / img.height);
                        img.set({
                            left: 350, top: 450, originX: 'center', originY: 'center',
                            scaleX: scale, scaleY: scale
                        });
                        activeCanvas.add(img);
                        activeCanvas.setActiveObject(img);
                    });
                };
                reader.readAsDataURL(e.target.files[0]);
                imageUpload.value = ''; 
            }
        });
    }

    if (deleteBtn && activeCanvas) {
        deleteBtn.addEventListener('click', () => {
            const active = activeCanvas.getActiveObject();
            if (active) activeCanvas.remove(active);
        });
    }

    // --- POSITIONING ENGINE ---
    const posLeftBtn = document.getElementById('pos-left-btn');
    const posHCenterBtn = document.getElementById('pos-hcenter-btn');
    const posRightBtn = document.getElementById('pos-right-btn');
    const posTopBtn = document.getElementById('pos-top-btn');
    const posVCenterBtn = document.getElementById('pos-vcenter-btn');
    const posBotBtn = document.getElementById('pos-bot-btn');

    function snapActiveObjectX(xRatio) {
        if (!activeCanvas) return;
        const active = activeCanvas.getActiveObject();
        if (active) {
            // Internal canvas is 700x900
            active.set({
                originX: 'center',
                left: 700 * xRatio,
                angle: 0
            });
            active.setCoords();
            activeCanvas.renderAll();
        }
    }

    function snapActiveObjectY(yRatio) {
        if (!activeCanvas) return;
        const active = activeCanvas.getActiveObject();
        if (active) {
            // Internal canvas is 700x900
            active.set({
                originY: 'center',
                top: 900 * yRatio,
                angle: 0
            });
            active.setCoords();
            activeCanvas.renderAll();
        }
    }

    if (posLeftBtn) posLeftBtn.addEventListener('click', () => snapActiveObjectX(0.25));
    if (posHCenterBtn) posHCenterBtn.addEventListener('click', () => snapActiveObjectX(0.50));
    if (posRightBtn) posRightBtn.addEventListener('click', () => snapActiveObjectX(0.75));

    if (posTopBtn) posTopBtn.addEventListener('click', () => snapActiveObjectY(0.20));
    if (posVCenterBtn) posVCenterBtn.addEventListener('click', () => snapActiveObjectY(0.50));
    if (posBotBtn) posBotBtn.addEventListener('click', () => snapActiveObjectY(0.80));
    
    // --- THREE.JS ENGINE ---
    const container = document.getElementById('webgl-container');
    const loaderMsg = document.getElementById('loader-msg');
    
    let scene, camera, renderer, controls, tshirtModel;
    let materialReferences = [];
    
    function init3D() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const width = container.clientWidth;
        const height = container.clientHeight;
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100); // Slightly wider FOV for mobile depth
        camera.position.set(0, 0, 2.8); // Pull out just slightly so it completely fits smaller vertical screens

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; // Disable complex two-finger zoom on mobile to prevent dragging conflicts
        controls.maxPolarAngle = Math.PI / 1.5; 
        controls.minPolarAngle = Math.PI / 3;

        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'assets/model/t_shirt.glb',
            function (gltf) {
                tshirtModel = gltf.scene;

                tshirtModel.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        if (node.material) materialReferences.push(node.material);
                    }
                });

                const box = new THREE.Box3().setFromObject(tshirtModel);
                const center = box.getCenter(new THREE.Vector3());
                tshirtModel.position.x += (tshirtModel.position.x - center.x);
                tshirtModel.position.y += (tshirtModel.position.y - center.y);
                tshirtModel.position.z += (tshirtModel.position.z - center.z);
                
                tshirtModel.rotation.set(0, 0, 0); 
                tshirtModel.updateMatrixWorld(true);
                scene.add(tshirtModel);

                const sizeVector = box.getSize(new THREE.Vector3());
                let planeSize = Math.max(sizeVector.x, sizeVector.y) * 0.6;
                if (planeSize === 0) planeSize = 0.5; 
                
                const sizeConfig = new THREE.Vector3(planeSize, planeSize * 1.285, planeSize * 1.5); 

                // Offset fix: 3D model bounding box is asymmetrical (right sleeve vs left).
                // Shifting X slightly to the negative perfectly centers it on the torso physically.
                const torsoXOffset = -sizeVector.x * 0.008;

                // FRONT DECAL
                const positionFront = new THREE.Vector3(torsoXOffset, sizeVector.y * 0.1, sizeVector.z / 2);
                const orientationFront = new THREE.Euler(0, 0, 0);
                const decalMaterialFront = new THREE.MeshBasicMaterial({ 
                    map: decalTextureFront, transparent: true, depthWrite: false, 
                    polygonOffset: true, polygonOffsetFactor: -4
                });

                // BACK DECAL
                const positionBack = new THREE.Vector3(torsoXOffset, sizeVector.y * 0.1, -sizeVector.z / 2);
                const orientationBack = new THREE.Euler(0, Math.PI, 0);
                const decalMaterialBack = new THREE.MeshBasicMaterial({ 
                    map: decalTextureBack, transparent: true, depthWrite: false, 
                    polygonOffset: true, polygonOffsetFactor: -4
                });

                tshirtModel.traverse(function (node) {
                    if (node.isMesh) {
                        try {
                            const geomFront = new THREE.DecalGeometry(node, positionFront, orientationFront, sizeConfig);
                            if (geomFront.attributes.position.count > 0) scene.add(new THREE.Mesh(geomFront, decalMaterialFront));
                        } catch (e) {}

                        try {
                            const geomBack = new THREE.DecalGeometry(node, positionBack, orientationBack, sizeConfig);
                            if (geomBack.attributes.position.count > 0) scene.add(new THREE.Mesh(geomBack, decalMaterialBack));
                        } catch (e) {}
                    }
                });

                controls.target.set(0, 0, 0);
                controls.update();
                loaderMsg.style.display = 'none';
            },
            function (xhr) {
                if (xhr.lengthComputable && loaderMsg) {
                    const percentComplete = Math.round(xhr.loaded / xhr.total * 100);
                    loaderMsg.innerText = `LOADING MODEL: ${percentComplete}%`;
                }
            },
            function (error) {
                if (loaderMsg) loaderMsg.innerHTML = 'MODEL NOT FOUND';
            }
        );

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        if (!container || !camera || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    init3D();
    animate();

    // --- FRONT / BACK UI TOGGLE & AUTO-PAN ENGINE ---
    const btnFront = document.getElementById('view-front-btn');
    const btnBack = document.getElementById('view-back-btn');
    
    if(btnFront && btnBack) {
        btnFront.addEventListener('click', () => {
            btnFront.style.background = 'var(--accent-3)';
            btnBack.style.background = '#fff';
            wrapperFront.style.display = 'block';
            wrapperBack.style.display = 'none';
            activeCanvas = fCanvasFront;
            
            if(camera && controls) {
                camera.position.set(0, 0, 2.8);
                controls.update();
            }
        });
        
        btnBack.addEventListener('click', () => {
            btnBack.style.background = 'var(--accent-3)';
            btnFront.style.background = '#fff';
            wrapperBack.style.display = 'block';
            wrapperFront.style.display = 'none';
            activeCanvas = fCanvasBack;
            
            if(camera && controls) {
                camera.position.set(0, 0, -2.8);
                controls.update();
            }
        });
    }

    // --- PRODUCT OPTIONS ---
    const colorBtns = document.querySelectorAll('.color-btn');
    if (colorBtns) {
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const hexColor = btn.dataset.hex;
                if (materialReferences.length > 0 && hexColor) {
                    materialReferences.forEach(mat => {
                        mat.color.set(hexColor);
                        mat.needsUpdate = true;
                    });
                }
            });
        });
    }

    const sizeBtns = document.querySelectorAll('.size-btn');
    if (sizeBtns) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    const saveBtn = document.getElementById('save-tshirt-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
                const dataURL = renderer.domElement.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'nelti_mobile_design.png';
                link.href = dataURL;
                link.click();
            }
        });
    }
});
