import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Loader from './Loader';

const PanoramaViewer = ({ image }) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let camera, scene, renderer, controls;

    // Initialize the scene
    init();

    function init() {
      // Create a new camera object
      camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);

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
      renderer.setSize(window.innerWidth * (isFullscreen ? 1 : 0.8), window.innerHeight * (isFullscreen ? 1 : 0.8)); // Set the canvas size to 100% or 80% of the window size

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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth * (isFullscreen ? 1 : 0.8), window.innerHeight * (isFullscreen ? 1 : 0.8)); // Update the canvas size to 100% or 80% of the new window size
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
  }, [image, isFullscreen]);

  const handleFullScreen = () => {
    if (!isFullscreen) {
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if (containerRef.current.mozRequestFullScreen) {
          containerRef.current.mozRequestFullScreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.msRequestFullscreen) {
          containerRef.current.msRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? true : false);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} className="rounded-xl" style={{ width: '80%', height: 'calc(80vh - 100px)' }}>
        {isLoading && <Loader />}
      </div>
      <button
        onClick={handleFullScreen}
        className="ml-5 mb-5 rounded-xl p-4 text-white bg-slate-500 border-2 hover:bg-sky-500 font-medium"
        style={{ width: '10%' }} // Set the button width to 100% for fullscreen
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
};

export default PanoramaViewer;
