document.addEventListener('DOMContentLoaded', () => {

    // --- FABRIC.JS 2D MINIMAP ENGINE (DUAL FRONT/BACK) ---
    const canvasFrontEl = document.getElementById('design-minimap-front');
    const canvasBackEl = document.getElementById('design-minimap-back');
    const wrapperFront = document.getElementById('map-wrapper-front');
    const wrapperBack = document.getElementById('map-wrapper-back');
    
    let fCanvasFront, fCanvasBack;
    let decalTextureFront, decalTextureBack;
    let activeCanvas = null; // Pointer to whichever array we are editing

    function setupFabric(id) {
        const f = new fabric.Canvas(id);
        f.setDimensions({ width: 700, height: 900 }, { backstoreOnly: true });
        f.setDimensions({ width: 300, height: 385 }, { cssOnly: true });
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

    // --- LEFT BAR UI CONTROLS BINDING ---
    const addTextBtn = document.getElementById('add-text-btn');
    const fontFamilySelect = document.getElementById('font-family');
    const imageUpload = document.getElementById('image-upload');
    const deleteBtn = document.getElementById('delete-layer-btn');

    if (addTextBtn && activeCanvas) {
        addTextBtn.addEventListener('click', () => {
            const textObj = new fabric.IText('YOUR TEXT', {
                left: 350, top: 450,
                fontFamily: fontFamilySelect.value,
                fontSize: 60, fill: '#121212',
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
        // Dynamically update font list sync when switching canvases (for robustness)
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
                        const scale = Math.min(350 / img.width, 350 / img.height);
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
            // Force horizontal centering mathematically and reset angle to prevent crookedness
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
            // Force vertical centering mathematically and reset angle to prevent crookedness
            active.set({
                originY: 'center',
                top: 900 * yRatio,
                angle: 0
            });
            active.setCoords();
            activeCanvas.renderAll();
        }
    }

    if (posLeftBtn) posLeftBtn.addEventListener('click', () => snapActiveObjectX(0.25)); // Left
    if (posHCenterBtn) posHCenterBtn.addEventListener('click', () => snapActiveObjectX(0.50)); // Center
    if (posRightBtn) posRightBtn.addEventListener('click', () => snapActiveObjectX(0.75)); // Right

    if (posTopBtn) posTopBtn.addEventListener('click', () => snapActiveObjectY(0.20)); // Top
    if (posVCenterBtn) posVCenterBtn.addEventListener('click', () => snapActiveObjectY(0.50)); // Middle
    if (posBotBtn) posBotBtn.addEventListener('click', () => snapActiveObjectY(0.80)); // Bottom
    
    // --- FRONT / BACK UI TOGGLE & AUTO-PAN ENGINE ---
    const btnFront = document.getElementById('view-front-btn');
    const btnBack = document.getElementById('view-back-btn');
    
    if(btnFront && btnBack) {
        btnFront.addEventListener('click', () => {
            // UI Switch
            btnFront.style.background = 'var(--accent-3)';
            btnBack.style.background = '#fff';
            wrapperFront.style.display = 'block';
            wrapperBack.style.display = 'none';
            activeCanvas = fCanvasFront;
            
            // Camera Pan
            if(camera && controls) {
                // Hard snap to front
                camera.position.set(0, 0, 2.5);
                controls.update();
            }
        });
        
        btnBack.addEventListener('click', () => {
            // UI Switch
            btnBack.style.background = 'var(--accent-3)';
            btnFront.style.background = '#fff';
            wrapperBack.style.display = 'block';
            wrapperFront.style.display = 'none';
            activeCanvas = fCanvasBack;
            
            // Camera Pan
            if(camera && controls) {
                // Hard snap to back
                camera.position.set(0, 0, -2.5);
                controls.update();
            }
        });
    }


    // --- THREE.JS ENGINE SETUP ---
    const container = document.getElementById('webgl-container');
    const loaderMsg = document.getElementById('loader-msg');
    
    // Core components
    let scene, camera, renderer, controls, tshirtModel;
    let materialReferences = []; // Cache to store materials to change color
    
    function init3D() {
        // 1. SCENE
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff); // Strict white background

        // 2. CAMERA
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 2.5); // "a little more closed up" (zoomed in)

        // 3. RENDERER
        // preserveDrawingBuffer is MANDATORY for saving the canvas as a working PNG
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // 4. LIGHTING
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
        fillLight.position.set(-5, 0, 5);
        scene.add(fillLight);

        // 5. CONTROLS
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 0.5;
        controls.maxDistance = 10;
        // Restrict so the user doesn't end up upside down or weird angles
        controls.maxPolarAngle = Math.PI / 1.5; 
        controls.minPolarAngle = Math.PI / 4;

        // 6. GLTF LOADER & DECAL SETUP
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'assets/model/t_shirt.glb',
            function (gltf) {
                tshirtModel = gltf.scene;

                // Materials
                tshirtModel.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        if (node.material) materialReferences.push(node.material);
                    }
                });

                // Centering math
                const box = new THREE.Box3().setFromObject(tshirtModel);
                const center = box.getCenter(new THREE.Vector3());
                tshirtModel.position.x += (tshirtModel.position.x - center.x);
                tshirtModel.position.y += (tshirtModel.position.y - center.y);
                tshirtModel.position.z += (tshirtModel.position.z - center.z);
                
                // Force perfectly straight alignment
                tshirtModel.rotation.set(0, 0, 0); 
                tshirtModel.updateMatrixWorld(true); // VERY IMPORTANT FOR DECAL VERTS
                scene.add(tshirtModel);

                // --- DECAL PROJECTION ---
                const sizeVector = box.getSize(new THREE.Vector3());
                let planeSize = Math.max(sizeVector.x, sizeVector.y) * 0.6; // Sticker width scale
                if (planeSize === 0) planeSize = 0.5; 
                
                // Canvas resolution is 700x900. Ratio is 1.285
                const size = new THREE.Vector3(planeSize, planeSize * 1.285, planeSize * 1.5); 

                // Offset fix: 3D model bounding box is asymmetrical (right sleeve vs left).
                // Shifting X slightly to the negative (viewer's left) perfectly centers it on the physical collar/torso.
                const torsoXOffset = -sizeVector.x * 0.008;

                // 1. FRONT DECAL MATH
                const positionFront = new THREE.Vector3(torsoXOffset, sizeVector.y * 0.1, sizeVector.z / 2);
                const orientationFront = new THREE.Euler(0, 0, 0); // Projects natively towards -Z (chest)
                const decalMaterialFront = new THREE.MeshBasicMaterial({ 
                    map: decalTextureFront, 
                    transparent: true, 
                    depthWrite: false, 
                    polygonOffset: true,
                    polygonOffsetFactor: -4
                });

                // 2. BACK DECAL MATH
                const positionBack = new THREE.Vector3(torsoXOffset, sizeVector.y * 0.1, -sizeVector.z / 2);
                const orientationBack = new THREE.Euler(0, Math.PI, 0); // Flipped 180deg to project physically towards +Z (spine)
                const decalMaterialBack = new THREE.MeshBasicMaterial({ 
                    map: decalTextureBack, 
                    transparent: true, 
                    depthWrite: false, 
                    polygonOffset: true,
                    polygonOffsetFactor: -4
                });

                // Wrap graphic exactly onto curved 3D vertices using official Decal logic!
                // Iterate ALL meshes in the GLTF to guarantee we hit the chest/spine regardless of how it was exported
                tshirtModel.traverse(function (node) {
                    if (node.isMesh) {
                        // Project Front
                        try {
                            const geomFront = new THREE.DecalGeometry(node, positionFront, orientationFront, size);
                            if (geomFront.attributes.position.count > 0) {
                                scene.add(new THREE.Mesh(geomFront, decalMaterialFront));
                            }
                        } catch (e) {}

                        // Project Back
                        try {
                            const geomBack = new THREE.DecalGeometry(node, positionBack, orientationBack, size);
                            if (geomBack.attributes.position.count > 0) {
                                scene.add(new THREE.Mesh(geomBack, decalMaterialBack));
                            }
                        } catch (e) {}
                    }
                });
                // --------------------------

                controls.target.set(0, 0, 0);
                controls.update();
                
                loaderMsg.style.display = 'none';
            },
            function (xhr) {
                if (xhr.lengthComputable) {
                    const percentComplete = Math.round(xhr.loaded / xhr.total * 100);
                    loaderMsg.innerText = `LOADING MODEL: ${percentComplete}%`;
                }
            },
            function (error) {
                console.error('Error loading GLTF model:', error);
                if (loaderMsg) {
                    loaderMsg.style.color = '#dc143c';
                    loaderMsg.innerHTML = 'MODEL NOT FOUND<br><span style="font-size:0.8rem;">Ensure `assets/model/t_shirt.glb` exists.</span>';
                }
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

    // Startup
    init3D();
    animate();


    // --- COLOR CONFIGURATOR LOGIC ---
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

    // --- RIGHT SIDEBAR OTHER ---
    const sizeBtns = document.querySelectorAll('.size-btn');
    if (sizeBtns) {
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    // Global Cart Animation
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartBadge = document.getElementById('cart-badge');
    
    if (addToCartBtns && cartBadge) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const originalText = btn.innerText;
                btn.innerText = "ADDED TO CART!";
                btn.style.backgroundColor = "var(--accent-3)";
                
                let count = parseInt(cartBadge.innerText);
                count += 1;
                cartBadge.innerText = count;
                
                cartBadge.style.transform = "scale(1.5)";
                setTimeout(() => { cartBadge.style.transform = "scale(1)"; }, 200);
                setTimeout(() => {
                    btn.innerText = "ADD TO CART";
                    btn.style.backgroundColor = "";
                }, 1500);
            });
        });
    }

    // --- SAVE FEATURE ---
    const saveBtn = document.getElementById('save-tshirt-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Force a quick render to ensure we have the absolute latest frame on the GPU buffer
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
                const dataURL = renderer.domElement.toDataURL('image/png');
                
                const link = document.createElement('a');
                link.download = 'nelti_custom_design.png';
                link.href = dataURL;
                link.click();
            }
        });
    }

});
