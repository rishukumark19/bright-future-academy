/**
 * THREE.JS HERO AMBIENT 3D SCENE
 * Design-DNA & Modern Creative Touch:
 * Floating geometric emerald wireframe & ambient particle constellation
 */
import * as THREE from 'three';

export function initHeroScene() {
  const canvas = document.getElementById('hero-three-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  if (!container) return;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 18;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── 1. FLOATING GEOMETRIC SHAPES (Knowledge Polyhedra) ──────────────────
  const group = new THREE.Group();
  scene.add(group);

  // Soft Emerald Materials
  const icosaGeometry = new THREE.IcosahedronGeometry(3.5, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x20B486,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });
  const icosaMesh = new THREE.Mesh(icosaGeometry, wireMaterial);
  group.add(icosaMesh);

  // Inner core solid with subtle glow
  const innerGeometry = new THREE.IcosahedronGeometry(2.4, 0);
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0x77FAC7,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  group.add(innerMesh);

  // Small floating satellite rings
  const ringGeo = new THREE.TorusGeometry(5.2, 0.04, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x20B486,
    transparent: true,
    opacity: 0.18,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  group.add(ringMesh);

  // Position group slightly toward the right hero background
  group.position.set(4, 0.5, -2);

  // ── 2. AMBIENT PARTICLE CONSTELLATION ───────────────────────────────────
  const particlesCount = 75;
  const positions = new Float32Array(particlesCount * 3);
  const scales = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    scales[i] = Math.random() * 0.8 + 0.4;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x20B486,
    size: 0.25,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // ── 3. INTERACTIVE PARALLAX & ANIMATION LOOP ────────────────────────────
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.0008;
    mouseY = (event.clientY - windowHalfY) * 0.0008;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Resize handler
  function onResize() {
    if (!container || !canvas) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize, { passive: true });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse interpolation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate main polyhedra
    icosaMesh.rotation.y = elapsedTime * 0.12 + targetX * 2;
    icosaMesh.rotation.x = elapsedTime * 0.08 + targetY * 2;

    innerMesh.rotation.y = -elapsedTime * 0.18;
    innerMesh.rotation.z = elapsedTime * 0.1;

    ringMesh.rotation.z = elapsedTime * 0.05;

    // Slow drift of particle cloud
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = targetY * 0.5;

    // Slight parallax on group position
    group.position.x = 4 + targetX * 3;
    group.position.y = 0.5 - targetY * 3;

    renderer.render(scene, camera);
  }

  animate();
}

