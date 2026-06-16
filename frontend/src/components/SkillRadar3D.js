import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SkillRadar3D = ({ skills }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Create radar geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const numSkills = skills.length;

    for (let i = 0; i < numSkills; i++) {
      const angle = (i / numSkills) * Math.PI * 2;
      const x = Math.cos(angle) * skills[i].proficiency / 100 * 2;
      const y = Math.sin(angle) * skills[i].proficiency / 100 * 2;
      vertices.push(x, y, 0);
    }

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );

    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Add skill labels
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      line.rotation.z += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [skills]);

  return <div ref={containerRef} className="w-full h-96 rounded-lg shadow-lg" />;
};

export default SkillRadar3D;
