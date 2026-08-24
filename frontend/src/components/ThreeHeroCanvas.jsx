/**
 * ThreeHeroCanvas Component
 *
 * Renders an interactive Three.js 3D canvas featuring floating culinary geometric particles,
 * subtle ambient and point lighting, and mouse-parallax physics tailored for a light Zomato theme.
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeHeroCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderer with transparent background for clean light-mode integration
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Light Setup (Warm orange/rose hues)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xf97316, 2.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xe11d48, 2.0, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Create 3D floating meshes
    const group = new THREE.Group();
    scene.add(group);

    const objects = [];
    const geometries = [
      new THREE.TorusGeometry(1.2, 0.4, 16, 40), // Donut shape
      new THREE.IcosahedronGeometry(1.0, 0),     // Gem/spice particle
      new THREE.CylinderGeometry(0.8, 0.8, 0.5, 24), // Plate/disk
      new THREE.SphereGeometry(0.7, 24, 24)      // Citrus bubble
    ];

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.2, metalness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.2 })
    ];

    for (let i = 0; i < 18; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.x = (Math.random() - 0.5) * 30;
      mesh.position.y = (Math.random() - 0.5) * 16;
      mesh.position.z = (Math.random() - 0.5) * 15;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = 0.5 + Math.random() * 0.7;
      mesh.scale.set(scale, scale, scale);

      mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        speedY: 0.005 + Math.random() * 0.01,
        initialY: mesh.position.y
      };

      objects.push(mesh);
      group.add(mesh);
    }

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth group parallax
      group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.05;
      group.rotation.x += (-mouseY * 0.3 - group.rotation.x) * 0.05;

      // Individual mesh floating motion
      objects.forEach((obj, idx) => {
        obj.rotation.x += obj.userData.rotX;
        obj.rotation.y += obj.userData.rotY;
        obj.position.y = obj.userData.initialY + Math.sin(elapsedTime * 1.5 + idx) * 0.8;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60"
      aria-hidden="true"
    />
  );
};

export default ThreeHeroCanvas;
