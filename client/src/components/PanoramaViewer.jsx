import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase/auth.js';

const storage = getStorage(initializeApp(firebaseConfig));

const PanoramaViewer = ({ imagePath }) => {
  const containerRef = useRef(null);
  const [panoramaUrl, setPanoramaUrl] = useState('');

  useEffect(() => {
    const container = containerRef.current;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.rotation.order = 'YXZ'; // Adjust the camera rotation order if needed

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create a sphere geometry for the panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the geometry to correctly map the texture

    // Load the panorama image as a texture
    const fetchPanorama = async () => {
      try {
        const storageRef = ref(storage, imagePath);
        const url = await getDownloadURL(storageRef);
        setPanoramaUrl(url);
      } catch (error) {
        console.error('Error fetching panorama:', error);
      }
    };

    fetchPanorama();

    // Use the panorama URL when available
    useEffect(() => {
      if (panoramaUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(panoramaUrl, (texture) => {
          // Create a material using the panorama texture
          const material = new THREE.MeshBasicMaterial({ map: texture });

          // Create a mesh with the geometry and material
          const mesh = new THREE.Mesh(geometry, material);

          // Add the mesh to the scene
          scene.add(mesh);
        });
      }
    }, [panoramaUrl]);

    // Create orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; // Disable zoom if desired

    // Handle window resize
    const handleResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    // Render the scene
    const render = () => {
      controls.update(); // Update controls in each frame
      renderer.render(scene, camera);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    animate();

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  }, [imagePath]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default PanoramaViewer;
