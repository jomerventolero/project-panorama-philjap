import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Loader from './Loader';

const PanoramaViewer = ({image}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let camera, scene, renderer, controls;

    // Initialize the scene
    init();

    function init() {
      // Create a new camera object
      camera = new THREE.PerspectiveCamera(100, (window.innerWidth / 2 - 20) / (window.innerHeight / 2 - 20), 1, 1000);

      // Set the camera position
      camera.position.set(0, 0, 0.1);

      // Create a new scene object
      scene = new THREE.Scene();

      // Load the panorama image
      const loader = new THREE.TextureLoader();
      const texture = loader.load(image, () => setIsLoading(false));

      // Set the texture wrapping and flipping options
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;

      // Create a new sphere geometry to hold the panorama image
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      // Create a new material with the loaded texture
      const material = new THREE.MeshBasicMaterial({ map: texture });

      // Create a new mesh with the geometry and material
      const mesh = new THREE.Mesh(geometry, material);

      // Add the mesh to the scene
      scene.add(mesh);

      // Create a new WebGL renderer object
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth / 2 - 20, window.innerHeight / 2 - 20);

      // Append the renderer to the container
      containerRef.current.appendChild(renderer.domElement);

      // Create a new OrbitControls object
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = -0.25;

      // Set the render loop
      renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
      });
    }

    // Resize the renderer when the window size changes
    const handleResize = () => {
      camera.aspect = (window.innerWidth / 2 - 20) / (window.innerHeight / 2 - 20);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2 - 20, window.innerHeight / 2 - 20);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function in useEffect
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [image]);

  return (
    <div ref={containerRef} style={{padding: 20, width: 'calc(50vw - 40px)', height: 'calc(50vh - 40px)', boxSizing: 'border-box'}}>
      {isLoading && <Loader />}
    </div>
  );
};

export default PanoramaViewer;
