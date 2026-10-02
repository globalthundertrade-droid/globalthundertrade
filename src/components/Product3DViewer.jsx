import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  RotateCw, RefreshCw, Eye, ZoomIn, ZoomOut, Compass, Info, Check, Sparkles 
} from 'lucide-react';

/**
 * Procedural Organic Fabric Micro-Weave Bump Map Generator
 * Generates a high-res tactile woven canvas texture in memory
 */
function createFabricWeaveTexture(type = 'cotton') {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const step = type === 'denim' ? 6 : type === 'leather' ? 8 : 4;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const noise = (Math.sin(x * 0.5) * Math.cos(y * 0.5) + 1) * 0.5;
      const shade = Math.floor(115 + noise * 50);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(x, y, step - 1, step - 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

export default function Product3DViewer({
  productType = 'hoodie',
  selectedColor = '#111111',
  selectedFit = 'Classic',
  selectedFabric = 'Standard',
  selectedGsm = 'Standard',
  wireframe = false,
  autoRotate = false,
  embroidery = 'None',
  print = 'None',
  hardware = 'None',
  badgeText = null
}) {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [wireframeMode, setWireframeMode] = useState(wireframe);
  const [modelSource, setModelSource] = useState('procedural'); // 'glb' | 'procedural'
  const [showInfo, setShowInfo] = useState(false);
  const [currentAngle, setCurrentAngle] = useState('perspective');

  const garmentGroupRef = useRef(null);
  const materialRef = useRef(null);
  const cameraRef = useRef(null);
  const targetRotationYRef = useRef(0);
  const targetRotationXRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.8);
    cameraRef.current = camera;

    // 2. High-Fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // 3. Studio Lighting Architecture (Key, Fill, Rim, Top Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.5, 3.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbe4eb, 1.1);
    fillLight.position.set(-3.5, 2.5, 2.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 3.8, -3.5);
    scene.add(rimLight);

    const bottomReflectLight = new THREE.DirectionalLight(0x222222, 0.6);
    bottomReflectLight.position.set(0, -3, 2);
    scene.add(bottomReflectLight);

    // 4. Garment Material with Tactile Micro-Weave
    const isLeather = productType === 'jacket' || productType === 'leather-jacket';
    const isDenim = productType === 'jeans';
    const fabricBumpTexture = createFabricWeaveTexture(isLeather ? 'leather' : isDenim ? 'denim' : 'cotton');

    const garmentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor),
      roughness: isLeather ? 0.38 : isDenim ? 0.85 : 0.9,
      metalness: isLeather ? 0.18 : 0.03,
      bumpMap: fabricBumpTexture,
      bumpScale: isLeather ? 0.003 : 0.008,
      wireframe: wireframeMode
    });
    materialRef.current = garmentMaterial;

    // 5. Garment Group & Shadow Plane
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;
    scene.add(garmentGroup);

    // Studio Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x040404,
      transparent: true,
      opacity: 0.55
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.45;
    scene.add(shadowMesh);

    // 6. Model Loading Strategy: Try External GLB first, fallback to Procedural
    let activeLoaderCancelled = false;
    const glbPath = `/models/${productType}.glb`;
    const loader = new GLTFLoader();

    loader.load(
      glbPath,
      (gltf) => {
        if (activeLoaderCancelled) return;
        while (garmentGroup.children.length > 0) {
          garmentGroup.remove(garmentGroup.children[0]);
        }
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = garmentMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        // Center & Scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);
        model.scale.set(scale, scale, scale);
        model.position.sub(center.multiplyScalar(scale));
        garmentGroup.add(model);
        setModelSource('glb');
      },
      undefined,
      () => {
        // Fallback to high-precision procedural studio model
        if (activeLoaderCancelled) return;
        buildProceduralStudioModel(garmentGroup, productType, garmentMaterial);
        setModelSource('procedural');
      }
    );

    // 7. Touch & Mouse Drag Rotation Architecture
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (clientX, clientY) => {
      isDragging = true;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging || !garmentGroup) return;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      targetRotationYRef.current += deltaX * 0.009;
      targetRotationXRef.current = Math.max(-0.4, Math.min(0.4, targetRotationXRef.current + deltaY * 0.006));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    const handleMouseDown = (e) => onPointerDown(e.clientX, e.clientY);
    const handleMouseMove = (e) => onPointerMove(e.clientX, e.clientY);
    const handleMouseUp = () => onPointerUp();

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onPointerUp();

    // Wheel Zoom
    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(2.2, Math.min(5.4, camera.position.z + e.deltaY * 0.003));
    };

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    dom.addEventListener('touchmove', handleTouchMove, { passive: true });
    dom.addEventListener('touchend', handleTouchEnd);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Fluid Render & Animation Loop with Slerp Smoothing
    let animId;
    function animate() {
      if (garmentGroup) {
        if (isRotating && !isDragging) {
          targetRotationYRef.current += 0.005;
        }
        // Smooth interpolation
        garmentGroup.rotation.y += (targetRotationYRef.current - garmentGroup.rotation.y) * 0.12;
        garmentGroup.rotation.x += (targetRotationXRef.current - garmentGroup.rotation.x) * 0.12;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      activeLoaderCancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      dom.removeEventListener('wheel', handleWheel);
      if (mount && renderer.domElement) {
        mount.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [productType]);

  // Sync Color Live
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(selectedColor);
    }
  }, [selectedColor]);

  // Sync Wireframe Mode Live
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = wireframeMode;
    }
  }, [wireframeMode]);

  // Preset Angle Handlers
  const setPresetAngle = (angle) => {
    setCurrentAngle(angle);
    setIsRotating(false);
    if (!garmentGroupRef.current) return;
    targetRotationXRef.current = 0;
    if (angle === 'front') targetRotationYRef.current = 0;
    else if (angle === 'back') targetRotationYRef.current = Math.PI;
    else if (angle === 'side') targetRotationYRef.current = Math.PI / 2;
    else if (angle === 'perspective') {
      targetRotationYRef.current = Math.PI / 4;
      targetRotationXRef.current = 0.08;
    }
  };

  const handleZoom = (delta) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.2, Math.min(5.4, cameraRef.current.position.z + delta));
    }
  };

  const resetView = () => {
    setPresetAngle('perspective');
    if (cameraRef.current) cameraRef.current.position.set(0, 0.2, 3.8);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 460, userSelect: 'none' }}>
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          cursor: 'grab', 
          borderRadius: 2, 
          overflow: 'hidden',
          touchAction: 'none'
        }} 
      />

      {/* Top Left: 3D Engine Status & Model Identification */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 16, 
          left: 16, 
          display: 'flex', 
          flexDirection: 'column',
          gap: 6, 
          zIndex: 4 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span 
            style={{ 
              background: 'rgba(10,10,10,0.85)', 
              backdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--white, #ffffff)', 
              fontSize: 10, 
              letterSpacing: '.14em', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              padding: '6px 12px', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: modelSource === 'glb' ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
            {modelSource === 'glb' ? 'PRODUCTION GLB 3D MODEL' : '3D WEBGL STUDIO MODEL (GLB READY)'}
          </span>

          <button
            onClick={() => setShowInfo(!showInfo)}
            title="3D Architecture Details"
            style={{
              background: 'rgba(10,10,10,0.85)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--gray, #aaaaaa)',
              padding: '6px 8px',
              borderRadius: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Info size={12} />
          </button>
        </div>

        {/* Architecture Info Flyout */}
        {showInfo && (
          <div 
            style={{ 
              background: 'rgba(12,12,12,0.95)', 
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: 12,
              borderRadius: 2,
              maxWidth: 320,
              fontSize: 11,
              color: 'var(--gray, #bbb)',
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: 'var(--white, #fff)', display: 'block', marginBottom: 4 }}>
              {modelSource === 'glb' ? 'Loaded Production GLB Mesh' : 'Procedural WebGL Studio Model'}
            </strong>
            {modelSource === 'glb' ? (
              <span>Loaded from <code>/public/models/{productType}.glb</code> with dynamic PBR fabric material recoloring.</span>
            ) : (
              <span>
                Using GTT's high-precision WebGL studio mesh with organic fabric bump micro-weave. To replace with a custom CAD/3D artist model, drop <code>{productType}.glb</code> into <code>/public/models/</code>.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Top Right: Preset View Angle Controls */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          display: 'flex', 
          gap: 4, 
          zIndex: 4 
        }}
      >
        {[
          { id: 'front', label: 'FRONT' },
          { id: 'side', label: 'SIDE' },
          { id: 'back', label: 'BACK' },
          { id: 'perspective', label: '360°' }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setPresetAngle(view.id)}
            style={{
              padding: '6px 10px',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '.08em',
              background: currentAngle === view.id ? 'var(--white, #fff)' : 'rgba(10,10,10,0.85)',
              color: currentAngle === view.id ? 'var(--black, #000)' : 'var(--white, #fff)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all .2s ease'
            }}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Bottom Right: Interactive Controls (Rotate, Mesh, Zoom, Reset) */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: 16, 
          right: 16, 
          display: 'flex', 
          gap: 6, 
          zIndex: 4 
        }}
      >
        <button
          onClick={() => handleZoom(-0.4)}
          title="Zoom In"
          style={btnControlStyle}
        >
          <ZoomIn size={13} />
        </button>

        <button
          onClick={() => handleZoom(0.4)}
          title="Zoom Out"
          style={btnControlStyle}
        >
          <ZoomOut size={13} />
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause Rotation' : 'Auto Rotate'}
          style={{
            ...btnControlStyle,
            background: isRotating ? 'var(--white, #fff)' : 'rgba(10,10,10,0.85)',
            color: isRotating ? 'var(--black, #000)' : 'var(--white, #fff)'
          }}
        >
          <RotateCw size={12} /> {isRotating ? 'PAUSE' : 'ROTATE'}
        </button>

        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          title="Toggle Mesh Structure"
          style={{
            ...btnControlStyle,
            background: wireframeMode ? 'var(--white, #fff)' : 'rgba(10,10,10,0.85)',
            color: wireframeMode ? 'var(--black, #000)' : 'var(--white, #fff)'
          }}
        >
          <Eye size={12} /> MESH
        </button>

        <button
          onClick={resetView}
          title="Reset View Position"
          style={btnControlStyle}
        >
          <RefreshCw size={12} /> RESET
        </button>
      </div>

      {/* Bottom Left: Applied Customization Badges */}
      <div 
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          pointerEvents: 'none',
          zIndex: 3
        }}
      >
        {print !== 'None' && (
          <span style={specBadgeStyle}>
            PRINT &middot; {print}
          </span>
        )}
        {embroidery !== 'None' && (
          <span style={specBadgeStyle}>
            EMBROIDERY &middot; {embroidery}
          </span>
        )}
        {hardware !== 'None' && (
          <span style={specBadgeStyle}>
            HARDWARE &middot; {hardware}
          </span>
        )}
      </div>
    </div>
  );
}

const btnControlStyle = {
  background: 'rgba(10,10,10,0.85)',
  color: 'var(--white, #ffffff)',
  border: '1px solid rgba(255,255,255,0.18)',
  padding: '7px 11px',
  borderRadius: 2,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.06em',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  transition: 'all .2s ease'
};

const specBadgeStyle = {
  background: 'rgba(10,10,10,0.8)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: 'var(--white, #fff)',
  fontSize: 10,
  letterSpacing: '.08em',
  fontWeight: 700,
  padding: '4px 8px',
  borderRadius: 2,
  backdropFilter: 'blur(8px)',
  textTransform: 'uppercase'
};

/**
 * High-Precision Procedural 3D Garment Generator for GTT Silhouettes
 */
function buildProceduralStudioModel(group, type, material) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f1f1f,
    roughness: 0.92,
    metalness: 0.04
  });

  const metalHardwareMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.88,
    roughness: 0.22
  });

  if (type === 'hoodie') {
    // Heavy Boxy Torso
    const torsoGeo = new THREE.CylinderGeometry(0.84, 0.77, 1.45, 32);
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.position.y = -0.15;
    group.add(torso);

    // Ribbed Hemband
    const hemGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.18, 32);
    const hem = new THREE.Mesh(hemGeo, material);
    hem.position.y = -0.92;
    group.add(hem);

    // Kangaroo Pouch Pocket
    const pouchGeo = new THREE.BoxGeometry(0.88, 0.48, 0.24);
    const pouch = new THREE.Mesh(pouchGeo, material);
    pouch.position.set(0, -0.44, 0.74);
    group.add(pouch);

    // Drop-Shoulder Sleeves with Ribbed Cuffs
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.22, 1.32, 24), material);
    sleeveL.position.set(-1.08, 0.05, 0);
    sleeveL.rotation.z = Math.PI / 5.2;
    group.add(sleeveL);

    const cuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 24), material);
    cuffL.position.set(-1.42, -0.45, 0);
    cuffL.rotation.z = Math.PI / 5.2;
    group.add(cuffL);

    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.22, 1.32, 24), material);
    sleeveR.position.set(1.08, 0.05, 0);
    sleeveR.rotation.z = -Math.PI / 5.2;
    group.add(sleeveR);

    const cuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 24), material);
    cuffR.position.set(1.42, -0.45, 0);
    cuffR.rotation.z = -Math.PI / 5.2;
    group.add(cuffR);

    // Double-Layered 3D Hood
    const hoodGeo = new THREE.SphereGeometry(0.58, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.76);
    const hood = new THREE.Mesh(hoodGeo, material);
    hood.position.set(0, 0.8, -0.08);
    hood.rotation.x = Math.PI * 0.12;
    group.add(hood);

  } else if (type === 'tshirt' || type === 'oversized-tee') {
    // Relaxed Boxy Drop Shoulder Torso
    const isOversized = type === 'oversized-tee';
    const torsoGeo = new THREE.CylinderGeometry(isOversized ? 0.86 : 0.8, isOversized ? 0.84 : 0.78, 1.38, 32);
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.position.y = -0.15;
    group.add(torso);

    // Thick 1.25" Ribbed Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.065, 16, 40), trimMaterial);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.54, 0);
    group.add(collar);

    // Drop-Shoulder Elbow-Length Sleeves
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.29, isOversized ? 0.85 : 0.76, 24), material);
    sleeveL.position.set(-0.98, 0.2, 0);
    sleeveL.rotation.z = Math.PI / 3.6;
    group.add(sleeveL);

    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.29, isOversized ? 0.85 : 0.76, 24), material);
    sleeveR.position.set(0.98, 0.2, 0);
    sleeveR.rotation.z = -Math.PI / 3.6;
    group.add(sleeveR);

  } else if (type === 'sweatshirt') {
    // Crewneck Torso
    const torsoGeo = new THREE.CylinderGeometry(0.82, 0.76, 1.4, 32);
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.position.y = -0.15;
    group.add(torso);

    // Ribbed Hem & Collar
    const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.18, 32), material);
    hem.position.y = -0.9;
    group.add(hem);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.06, 16, 36), trimMaterial);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.53, 0);
    group.add(collar);

    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 1.3, 24), material);
    sleeveL.position.set(-1.05, 0.06, 0);
    sleeveL.rotation.z = Math.PI / 5.2;
    group.add(sleeveL);

    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 1.3, 24), material);
    sleeveR.position.set(1.05, 0.06, 0);
    sleeveR.rotation.z = -Math.PI / 5.2;
    group.add(sleeveR);

  } else if (type === 'jacket' || type === 'leather-jacket') {
    // Moto / Leather Jacket Torso
    const torsoGeo = new THREE.CylinderGeometry(0.85, 0.79, 1.48, 32);
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.position.y = -0.15;
    group.add(torso);

    // Biker Lapels
    const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.52, 0.06), material);
    lapelLeft.position.set(-0.25, 0.35, 0.8);
    lapelLeft.rotation.z = -0.28;
    group.add(lapelLeft);

    const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.52, 0.06), material);
    lapelRight.position.set(0.25, 0.35, 0.8);
    lapelRight.rotation.z = 0.28;
    group.add(lapelRight);

    // Asymmetric Metal YKK Zipper Track
    const zipMesh = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.28, 0.04), metalHardwareMaterial);
    zipMesh.position.set(0.12, -0.15, 0.83);
    group.add(zipMesh);

    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.21, 1.38, 24), material);
    sleeveL.position.set(-1.05, 0.08, 0);
    sleeveL.rotation.z = Math.PI / 5.5;
    group.add(sleeveL);

    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.21, 1.38, 24), material);
    sleeveR.position.set(1.05, 0.08, 0);
    sleeveR.rotation.z = -Math.PI / 5.5;
    group.add(sleeveR);

  } else if (type === 'jeans') {
    // Denim Waistband
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.76, 0.26, 32), material);
    waist.position.y = 0.65;
    group.add(waist);

    // Donut Button & Fly
    const button = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16), metalHardwareMaterial);
    button.rotation.x = Math.PI / 2;
    button.position.set(0, 0.66, 0.76);
    group.add(button);

    // Baggy / Straight Denim Legs
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.29, 1.9, 24), material);
    legL.position.set(-0.39, -0.4, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.29, 1.9, 24), material);
    legR.position.set(0.39, -0.4, 0);
    group.add(legR);

  } else if (type === 'baggy-sweat-pants' || type === 'joggers') {
    // Elastic Waistband
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.76, 0.24, 32), trimMaterial);
    waist.position.y = 0.65;
    group.add(waist);

    // Metal-Tipped Drawstrings
    const drawL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), metalHardwareMaterial);
    drawL.position.set(-0.08, 0.52, 0.77);
    group.add(drawL);

    const drawR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32, 8), metalHardwareMaterial);
    drawR.position.set(0.08, 0.54, 0.77);
    group.add(drawR);

    // Wide / Baggy Drape
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.25, 1.78, 24), material);
    legL.position.set(-0.37, -0.34, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.25, 1.78, 24), material);
    legR.position.set(0.37, -0.34, 0);
    group.add(legR);

    // Ribbed Ankle Cuffs
    const cuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 24), trimMaterial);
    cuffL.position.set(-0.37, -1.26, 0);
    group.add(cuffL);

    const cuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 24), trimMaterial);
    cuffR.position.set(0.37, -1.26, 0);
    group.add(cuffR);

  } else if (type === 'shorts') {
    // Heavy Loopback Shorts
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.76, 0.24, 32), trimMaterial);
    waist.position.y = 0.45;
    group.add(waist);

    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.34, 0.9, 24), material);
    legL.position.set(-0.36, -0.1, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.34, 0.9, 24), material);
    legR.position.set(0.36, -0.1, 0);
    group.add(legR);

  } else {
    // Medical Scrubs & Clean Silhouettes
    const torsoGeo = new THREE.CylinderGeometry(0.8, 0.76, 1.38, 32);
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.position.y = -0.15;
    group.add(torso);

    const vneck = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.02, 0.45, 3), trimMaterial);
    vneck.position.set(0, 0.42, 0.74);
    vneck.rotation.x = Math.PI / 2;
    group.add(vneck);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.04), material);
    pocket.position.set(-0.35, 0.12, 0.78);
    group.add(pocket);

    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.26, 0.76, 24), material);
    sleeveL.position.set(-0.94, 0.2, 0);
    sleeveL.rotation.z = Math.PI / 3.8;
    group.add(sleeveL);

    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.26, 0.76, 24), material);
    sleeveR.position.set(0.94, 0.2, 0);
    sleeveR.rotation.z = -Math.PI / 3.8;
    group.add(sleeveR);
  }
}
