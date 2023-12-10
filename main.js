import './style.css';
import * as THREE from 'three';

// import orbit controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// import GLTF loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//iport DRACOLoader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

//import loadingManager
import { LoadingManager } from 'three';

//import gsap
import gsap from 'gsap';


const draco = new DRACOLoader();
draco.setDecoderConfig({ type: 'js' });
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//load cubeTextureLoader from /cubemap
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  '/cubemap/px.png',
  '/cubemap/nx.png',
  '/cubemap/py.png',
  '/cubemap/ny.png',
  '/cubemap/pz.png',
  '/cubemap/nz.png',
]);

//add environment map to scene
scene.background = texture;


// make new cylinder geometry
const geometry = new THREE.CylinderGeometry( 3.5, 3.5, 0.3, 32 );
const textureLoader = new THREE.TextureLoader();
const texture2 = textureLoader.load('/textures/wood_cabinet_worn_long_rough_4k.jpg');
const material = new THREE.MeshStandardMaterial( {map:texture2, metalness: 0.2, roughness: 0.5} );
const cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(0, -1, 0);
cylinder.castShadow = true;
cylinder.receiveShadow = true;


scene.add( cylinder );





// Orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.rotateSpeed = 0.2;

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector('.progress-bar-container');

loadingManager.onLoad = function () {
  progressBarContainer.style.display = 'none';
};

const gltfLoader = new GLTFLoader(loadingManager);


// DRACOLoader
// const gltfLoader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
// gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setDRACOLoader(draco);







let sneaker;

//load shoe model
gltfLoader.load('/models/Shoe_compressed.glb', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, 0, 0);
  scene.add(gltf.scene);

  
  sneaker = gltf.scene.children[0];
  gltf.scene.rotateY(Math.PI / 2); // Math.PI represents 180 degrees


 


//add array with shoe parts

const laces = document.getElementById('laces');
const inside = document.getElementById('inside');
const outside_1 = document.getElementById('outside1');
const outside_2 = document.getElementById('outside2');
const outside_3 = document.getElementById('outside3');
const sole_bottom = document.getElementById('solebottom');
const sole_top = document.getElementById('soletop');

// Assuming you have an element with id 'laces' in your HTML
const shoeParts = [
  { element: laces, name: 'laces' },
  { element: inside, name: 'inside' },
  { element: outside_1, name: 'outside_1' },
  { element: outside_2, name: 'outside_2' },
  { element: outside_3, name: 'outside_3' },
  { element: sole_bottom, name: 'sole_bottom' },
  { element: sole_top, name: 'sole_top' }
];


const color1= document.getElementById('color1');
const color2= document.getElementById('color2');
const color3= document.getElementById('color3');
const color4= document.getElementById('color4');
const color5= document.getElementById('color5');

const colorButtons = [
  color1,
  color2,
  color3,
  color4,
  color5
];

let lastClickedColor = {};

// Add event listener for color buttons outside the loop
colorButtons.forEach((colorButton, index) => {
  colorButton.addEventListener('click', () => {
    console.log(`Color ${index + 1} clicked!`);
    const selectedColor = colorButton.style.backgroundColor;
    console.log(selectedColor);
    // Assuming you have a selectedPart variable storing the currently selected shoe part
    if (selectedPart) {
      updateShoeColor(selectedColor, selectedPart);
    }
  });
});

let selectedPart = null;

shoeParts.forEach((part) => {
  part.element.addEventListener('click', () => {
    console.log(`${part.name} clicked!`);
    selectedPart = part.name; // Update the selectedPart variable
    
    if(selectedPart==="laces"){
      
      gsap.to(camera.position, {
        duration: 1, 
        x: 2, 
        y: 2.5, 
        z: 0
      });
    }
    if(selectedPart==="inside"){
      gsap.to(camera.position, {
        duration: 1, 
        x: -1, 
        y: 3, 
        z: 0
      });
    }
    if(selectedPart==="outside_1"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 0, 
        y: 2, 
        z: 2.5
      });
    }
    if(selectedPart==="outside_2"){
      gsap.to(camera.position, {
        duration: 1, 
        x: -2, 
        y: 1.5, 
        z: 2
      });
    }
    if(selectedPart==="outside_3"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 2.5, 
        y: 2.5, 
        z: 0
      });
    }
    if(selectedPart==="sole_bottom"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 0, 
        y: 0, 
        z: 2
      });
    }
    if(selectedPart==="sole_top"){
      gsap.to(camera.position, {
        duration: 1, 
        x: 0, 
        y: 0.5, 
        z: 2
      });
    }
  });
});

function updateShoeColor(color, partName) {
  console.log(color, partName);
  sneaker.traverse((child) => {
    if (child.isMesh && child.name === partName) {
      const newColor = new THREE.Color(color);
      child.material.color.copy(newColor);

      // Store last clicked color of every shoe part in an object
      lastClickedColor[partName] = newColor;
      console.log(lastClickedColor);
    }
  });
}

  sneaker.traverse((child) => {
    child.castShadow = true;
  });

  animate();

});


  //add light to shoe
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  ambientLight.position.set(0, 2, 0).normalize();
  scene.add(ambientLight);

  //add point light to shoe
  const pointLight = new THREE.PointLight(0xffffff, 8);
  pointLight.position.set(0, 5, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);
  

camera.position.z = 3;
camera.position.y = 1.5;
camera.position.x = 0;

// dont be able to look under the cylinder
const minHeight = cylinder.position.y + cylinder.geometry.parameters.height / 2;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = minHeight + 1;
controls.maxDistance = 10;
controls.enablePan = false;
controls.enableDamping = true;

// add clock
const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );


  // sneaker.position.y = Math.sin(Date.now() * 0.0001) * 0.1;
  const elapsedTime = clock.getElapsedTime();
  sneaker.position.y = Math.sin(elapsedTime) * 0.03;
  

  camera.lookAt(sneaker.position);

  controls.update();

	renderer.render( scene, camera );
}  

