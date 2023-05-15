# Panorama Prototype Documentation

The Panorama Prototype allows the user to interact with a 3D panorama image within a web browser using mouse controls. It uses the THREE.js JavaScript library for 3D rendering.

## HTML Structure

The HTML structure includes a single div container where the panorama will be rendered. This is linked with the `three.min.js` for 3D rendering, `OrbitControls.js` for controlling the user interaction, and `panorama.js` for setting up and controlling the panorama.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Panorama Prototype</title>
    <style>
        /* styling */
    </style>
</head>
<body>
    <div id="panorama-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
    <script src="/OrbitControls.js"></script>
    <script src="panorama.js"></script>
</body>
</html>
```

## Panorama Setup
    * Create a new THREE.Scene object
    * Create a new THREE.PerspectiveCamera object
    * Create a new THREE.WebGLRenderer object
    * Set the renderer's size to the window's inner width and height
    * Append the renderer's DOM element to the panorama container
    * Create a new THREE.TextureLoader object
    * Load the panorama image using the texture loader
    * Create a new THREE.MeshBasicMaterial object
    * Set the material's map to the panorama image
    * Set the material's side to THREE.BackSide
    * Create a new THREE.Mesh object
    * Set the mesh's geometry to a new THREE.SphereGeometry object
    * Set the mesh's material to the material created above
    * Add the mesh to the scene
    * Create a new THREE.OrbitControls object
    * Set the controls' target to the mesh's position
    * Set the controls' enableZoom property to false
    * Set the controls' enablePan property to false
    * Set the controls' enableDamping property to true
    * Set the controls' dampingFactor property to 0.05
    * Set the controls' rotateSpeed property to -0.25
    * Set the controls' minPolarAngle property to Math.PI / 2
    * Set the controls' maxPolarAngle property to Math.PI / 2
    * Set the controls' minAzimuthAngle property to -Math.PI / 2
    * Set the controls' maxAzimuthAngle property to Math.PI / 2
    * Set the controls' minDistance property to 0
    * Set the controls' maxDistance property to 0
    * Set the controls' autoRotate property to true
    * Set the controls' autoRotateSpeed property to 0.25
    * Set the controls' autoRotate to false when the user interacts with the panorama
    * Set the controls' update method to the update function
    * Set the camera's position to the mesh's position
    * Set the camera's fov property to 75
    * Set the camera's aspect property to the window's inner width divided by the window's inner height
    * Set the camera's near property to 0.1
    * Set the camera's far property to 1000
    * Set the camera's lookAt method to the mesh's position
    * Set the renderer's render method to the render function
    * Call the render function

## Panorama Update
    * Call the controls' update method
    * Call the renderer's render method

## Panorama Render
    * Call the renderer's render method
    * Call the requestAnimationFrame method with the render function as an argument

## Panorama Resize
    * Set the camera's aspect property to the window's inner width divided by the window's inner height
    * Call the camera's updateProjectionMatrix method
    * Set the renderer's size to the window's inner width and height
    * Call the renderer's render method

## Panorama Mouse Move
    * Set the controls' autoRotate property to false
    * Set the controls' autoRotateSpeed property to 0
    * Set the controls' enableRotate property to true
    * Set the controls' enableZoom property to true
    * Set the controls' enablePan property to true
    * Set the controls' enableDamping property to true
    * Set the controls' dampingFactor property to 0.05
    * Set the controls' rotateSpeed property to 0.25
    * Set the controls' minPolarAngle property to 0
    * Set the controls' maxPolarAngle property to Math.PI
    * Set the controls' minAzimuthAngle property to -Math.PI
    * Set the controls' maxAzimuthAngle property to Math.PI
    * Set the controls' minDistance property to 0
    * Set the controls' maxDistance property to 1000
    * Set the controls' update method to the update function

## Running Panorama Environment Server
    * Open a terminal
    * Navigate to the panorama directory
    * Run the following command:
        * python3 -m http.server 8000
