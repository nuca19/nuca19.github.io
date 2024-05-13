import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { PointerLockControls } from '/js/PointerLockControls.js';
window.PointerLockControls = PointerLockControls;

import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


let object;
let meteor;
let volumeModel;

let audioContext;
let volumeDisplay;
let average;
let watertexture;

//gltb
let animateRocket = false;
let rocket;

let shakeInterval;

function initializeAudioContext() {
    // Check if audioContext is already initialized
    if (!audioContext) {
        console.log('Initializing AudioContext...');
        audioContext = new AudioContext();
        console.log('AudioContext initialized.');
    }
}

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(100, 22.5, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0xFFFFFF, 1);

//const axes = new THREE.AxesHelper(15);
//axes.position.set(-20, 0, 0);
//scene.add(axes);

//glb objects
const loaderg = new GLTFLoader();

loaderg.load(
    '../mdls/Telescope.glb',
    function ( gltf ) {
        const scale = 1.9;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(93, 21, 4);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);
loaderg.load(
    '../mdls/Chair.glb',
    function ( gltf ) {
        const scale = 4.3;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(93, 20, -4);
        gltf.scene.rotation.y = - Math.PI / 4;
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/Cabin.glb',
    function ( gltf ) {
        const scale = 0.03;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-350, 80, 4);
        gltf.scene.rotation.y = Math.PI / 2;
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/desk.glb',
    function ( gltf ) {
        const scale = 2;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(118, 19.6, -32);
        gltf.scene.rotation.y = -Math.PI /2;
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/Rocketship.glb',
    function ( gltf ) {
        const scale = 1;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(50, 23, 33);
        gltf.scene.rotation.y = -Math.PI;
        scene.add( gltf.scene );
        rocket = gltf.scene; 
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/LandingPad.glb',
    function ( gltf ) {
        const scale = 15;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(50, -5, 35);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

//ambient light
var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

//create sky
var skyGeo = new THREE.SphereGeometry(1700, 25, 25);
var loader  = new THREE.TextureLoader();

loader.load("textures/nightsky2.jpg", function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5); // Repeat the texture 10 times in both directions

    var skymaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
    });
    skymaterial.side = THREE.BackSide; // Set the side property on skymaterial
    var sky = new THREE.Mesh(skyGeo, skymaterial);
    scene.add(sky);
});   

//add plane
var loader = new THREE.TextureLoader();
loader.load('textures/ground.png', function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4); // Repeat the texture 4 times in both directions

    var geometry = new THREE.BoxGeometry(1500, 1500, 3);
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
    plane.position.y = -3.5;
    scene.add(plane);

    //mountaintains
    geometry = new THREE.ConeGeometry(250, 150, 4);
    var mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-390, 10, 350);
    scene.add(mountain);
    
    geometry = new THREE.ConeGeometry(350, 250, 4);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-400, 40, 150);
    scene.add(mountain);
    
    geometry = new THREE.ConeGeometry(500, 350, 4);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-450, 70, -150);
    scene.add(mountain);
    
    geometry = new THREE.ConeGeometry(200, 200, 4);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(175, -5, 600);
    scene.add(mountain);

    geometry = new THREE.ConeGeometry(100, 50, 6);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(100, -5, 0); 
    scene.add(mountain);

});

// Function to create a tree
function createTree() {
    var textureLoader = new THREE.TextureLoader();
    var leavesTexture = textureLoader.load('textures/leaves.png');
    var trunkTexture = textureLoader.load('textures/trunk.jpg'); // Load the trunk texture

    // Repeat the texture
    leavesTexture.wrapS = THREE.RepeatWrapping;
    leavesTexture.wrapT = THREE.RepeatWrapping;
    leavesTexture.repeat.set(3, 3);

    // Repeat the trunk texture
    trunkTexture.wrapS = THREE.RepeatWrapping;
    trunkTexture.wrapT = THREE.RepeatWrapping;
    trunkTexture.repeat.set(3, 3); 

    var geometry = new THREE.ConeGeometry(2, 4, 4); 
    var material = new THREE.MeshPhongMaterial({map: leavesTexture});
    var treeTop = new THREE.Mesh(geometry, material);

    geometry = new THREE.CylinderGeometry(0.5, 0.5, 3); 
    material = new THREE.MeshPhongMaterial({map: trunkTexture}); 
    var treeTrunk = new THREE.Mesh(geometry, material);

    treeTrunk.position.y = -3.5; 
    treeTop.add(treeTrunk);

    return treeTop;
}

// Function to create a forest
function createForest(x, y, z, treeCount) {
    var forest = new THREE.Group();

    for (var i = 0; i < treeCount; i++) {
        var tree = createTree();
        tree.position.set(
            x + Math.random() * 75 - 25, 
            y,
            z + Math.random() * 75 - 25  
        );
        forest.add(tree);
    }

    return forest;
}

// Create forests
var forest1 = createForest(-30, 3, -50, 70);
scene.add(forest1);
var forest3 = createForest(-80, 3, 90, 70);
scene.add(forest3);

//river
loader = new THREE.TextureLoader();
loader.load('textures/water.jpg', function(texture) {
    watertexture = texture;
    // Define the points along the path of the river
    const points = [
        new THREE.Vector3(-280, -2, 70),
        new THREE.Vector3(-260, -6, 50),
        new THREE.Vector3(-100, -6, 12),
        new THREE.Vector3(20, -6, 60),
        new THREE.Vector3(50, -6, 200),
        new THREE.Vector3(100, -6, 300),
        new THREE.Vector3(40, -6, 600)
    ];

    // Create a curve from the points
    const curve = new THREE.CatmullRomCurve3(points);
    const riverGeometry = new THREE.TubeGeometry(curve, 70, 8, 16, false);
    const riverMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7
    });
    const river = new THREE.Mesh(riverGeometry, riverMaterial);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    scene.add(river);

    const lakeGeometry = new THREE.PlaneGeometry(50, 50, 10);

    // Create the lake mesh
    const lake = new THREE.Mesh(lakeGeometry, riverMaterial);

    // Position the lake at the end of the vector
    lake.position.set(50,-2, 80);
    lake.rotation.x = -Math.PI / 2;

    // Add the lake to the scene
    //scene.add(lake);
});

function createCabin() {
    var cabin = new THREE.Group();

    // Create the walls
    var geometry = new THREE.PlaneGeometry(7, 5);
    var material = new THREE.MeshPhongMaterial({color: 0x8b4513, side: THREE.DoubleSide}); // Make the walls double-sided
    var wall1 = new THREE.Mesh(geometry, material);
    var wall2 = wall1.clone();
    var wall3 = wall1.clone();
    var wall4 = wall1.clone();

    wall1.rotation.y = Math.PI;
    wall2.rotation.y = Math.PI / 2;
    wall3.rotation.y = -Math.PI / 2;
    wall4.rotation.y = 0;

    wall1.position.z = 3.75;
    wall2.position.x = 3.5;
    wall3.position.x = -2.5;
    wall4.position.z = -3.75;

    cabin.add(wall1, wall2, wall4);

    // Create the roof
    geometry = new THREE.ConeGeometry(5, 2, 4);
    material = new THREE.MeshPhongMaterial({color: 0x8b4513});
    var roof = new THREE.Mesh(geometry, material);
    roof.position.y = 3.5;
    roof.rotation.y = Math.PI / 4;
    cabin.add(roof);

    // Create the door
    geometry = new THREE.BoxGeometry(1, 2, 0.1);
    material = new THREE.MeshPhongMaterial({color: 0x663300});
    var door = new THREE.Mesh(geometry, material);
    door.position.y = -1.5;
    door.position.z = 3.75;
    cabin.add(door);
    
    // Create the floor
    var floorGeometry = new THREE.PlaneGeometry(19, 15); // Adjust the size as needed
    var floorMaterial = new THREE.MeshPhongMaterial({color: 0x654321}); // Adjust the color as needed
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);

    // Position the floor under the cabin
    floor.position.set(97.5, 20, 0); // Adjust the position as needed
    floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal

    // Add the floor to the scene
    scene.add(floor);

    return cabin;
}

// Create a cabin and add it to the scene
var cabin = createCabin();
cabin.position.set(100, 24, 0); // Set the position to the starting position
cabin.scale.set(2, 2, 2); // Scale the cabin
scene.add(cabin);


var city = new THREE.Group();
var buildings = [
    { position: { x: -10, y: 0, z: -40 }, size: { width: 12, height: 30, depth: 12 } },
    { position: { x: 10, y: 0, z: -30 }, size: { width: 12, height: 24, depth: 12 } },
    { position: { x: 30, y: 0, z: -20 }, size: { width: 12, height: 36, depth: 12 } },
    { position: { x: -10, y: 0, z: -10 }, size: { width: 12, height: 18, depth: 12 } },
    { position: { x: 12, y: 0, z: -6 }, size: { width: 12, height: 12, depth: 12 } },
    { position: { x: 20, y: 0, z: -50 }, size: { width: 12, height: 42, depth: 12 } },
    { position: { x: -30, y: 0, z: -30 }, size: { width: 12, height: 24, depth: 12 } },
];


// Create the buildings
for (var i = 0; i < buildings.length; i++) {
    var buildingGeometry = new THREE.BoxGeometry(buildings[i].size.width, buildings[i].size.height, buildings[i].size.depth);
    var buildingMaterial = new THREE.MeshBasicMaterial({color: 0x1C1D22});
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(buildings[i].position.x, buildings[i].size.height / 2, buildings[i].position.z);
    city.add(building);
}

// Position the city
city.position.set(10, -2, -60);
scene.add(city);



const volumeModelGeometry = new THREE.BoxGeometry(2, 2, 2);
volumeModelGeometry.translate(0, 0.5, 0);
const volumeModelMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
volumeModel = new THREE.Mesh(volumeModelGeometry, volumeModelMaterial);
volumeModel.position.set(100, 21, -6.2);
volumeModel.scale.y = 0;
scene.add(volumeModel);
const baseGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
const baseMaterial = new THREE.MeshBasicMaterial({color: 0x1C1D22}); // Change the color as needed
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.set(100, 19.9, -6.2); // Position it under the volumeModel
scene.add(base);

// Create a sphere for visualization
//moon
loader = new THREE.TextureLoader();
loader.load('textures/moon.jpg', function(texture) {
    const sungeo = new THREE.SphereGeometry(70, 32, 32);
    const sunmat = new THREE.MeshBasicMaterial({ map: texture });
    object = new THREE.Mesh(sungeo, sunmat);
    object.position.set(-500, 200, 0);
    scene.add(object);
    object.visible = false; // Initially hide the object
});

//meteor
loader = new THREE.TextureLoader();
loader.load('textures/sun.jpg', function(texture) {
    var meteorgeo = new THREE.SphereGeometry(15, 32, 32);
    var meteormat = new THREE.MeshBasicMaterial({ map: texture });
    meteor = new THREE.Mesh(meteorgeo, meteormat);
    meteor.position.set(-50, 50, 0);
    scene.add(meteor);
    meteor.visible = false; // Initially hide the object

});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const button = new THREE.Mesh(geometry, material);
button.position.set(100, 23, -7.6);
scene.add(button);

// Create a raycaster and a vector to hold the mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add an event listener for the mouse click
window.addEventListener('click', function(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object === button) {
            button.scale.z *= 0.5;
            animateRocket = true;
            shakeCamera(7000); 
        }
    }
}, false);
// Function to handle user audio input
function handleAudioInput() {
    console.log('Requesting microphone access...');
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            console.log('Microphone access granted.');
            initializeAudioContext(); // Initialize audioContext
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            setTimeout(() => {
                function draw() {
                    requestAnimationFrame(draw);
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    //comment quando nao usar voz!!!!
                    average = sum / bufferLength;
                    
                    if (average > 40 && average <= 50) { // Adjust the threshold levels as needed
                        object.visible = true;
                        // Set the initial scale to 0
                        object.scale.set(0, 0, 0);
                        gsap.to(object.scale, { x: 1, y: 1, z: 1, duration: 4, onComplete: function() {
                            object.visible = false;
                        }});
                    } else if (average > 70 && average <= 100) {
                        shakeCamera(3000); // Shake the camera for 1 second
                        meteor.visible = true;
                        meteor.scale.set(0, 0, 0);
                        gsap.to(meteor.position, { y: 4, x: 0, z: 20, duration: 6 });
                        gsap.to(meteor.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 6, onComplete: function() {
                            meteor.visible = false;
                            meteor.position.set(-50, 50, 50);
                        }});
                    } else if (average > 100) {
                        
                    } else {
                        
                    }

                    volumeDisplay.textContent = 'Volume Level: ' + Math.round(average);
                    volumeModel.scale.y = average / 100 *2;

                    //average= 0; //retirar quando nao usar voz!!!!

                }
                draw();
            }, 2000);
        })
        .catch(handleAudioInputError);
}

function shakeCamera(duration = 1000) {
    const shakeIntensity = 0.3;
    clearInterval(shakeInterval); // Clear any existing shake interval

    const initialY = camera.position.y;

    shakeInterval = setInterval(() => {
        camera.position.x += Math.random() * shakeIntensity - shakeIntensity / 2;
        camera.position.y += Math.random() * shakeIntensity - shakeIntensity / 2;
        camera.position.z += Math.random() * shakeIntensity - shakeIntensity / 2;
    }, 50); // Apply shake effect every 100ms

    setTimeout(() => {
        clearInterval(shakeInterval); // Stop shaking after the duration
        camera.position.y = initialY;
    }, duration);
}
// Function to handle errors with audio input
function handleAudioInputError(error) {
    console.error('Error accessing microphone:', error);
}

// Function to create and append start button
function createStartButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    const volbutcont = document.createElement('div');
    volbutcont.id = 'volbutcont';
    
    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start Visualization';
    startButton.addEventListener('click', function() {
        handleAudioInput();
        startButton.style.display = 'none'; // Hide the button when it's clicked
    });
    buttonContainer.appendChild(startButton);
    document.body.appendChild(buttonContainer);


    const volumeButton50 = document.createElement('button');
    volumeButton50.textContent = 'Set Volume to 50';
    volumeButton50.addEventListener('click', function() {
        average = 50;
    });
    volbutcont.appendChild(volumeButton50);

    const volumeButton70 = document.createElement('button');
    volumeButton70.textContent = 'Set Volume to 70';
    volumeButton70.addEventListener('click', function() {
        average = 76;
    });
    volbutcont.appendChild(volumeButton70);
    document.body.appendChild(volbutcont);

    volumeDisplay = document.createElement('div');
    volumeDisplay.id = 'volume-display';
    document.body.appendChild(volumeDisplay);
}

let keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

const controls = new PointerLockControls(camera, document.body);

function setupControlsAndListeners(camera) {
    
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        keys[key] = true;
    }, false);
    
    document.addEventListener('keyup', function(event) {
        const key = event.key;
        keys[key] = false;
    }, false);

    document.addEventListener('click', function () {
        controls.lock();
    }, false);
}

function moveControls(keys, controls, speed) {
    if (keys["w"]) controls.moveForward(speed);
    if (keys["a"]) controls.moveRight(-speed);
    if (keys["s"]) controls.moveForward(-speed);
    if (keys["d"]) controls.moveRight(speed);
}


let rocketSpeed = 0.001; // Start speed
const speedIncrement = 0.0002;
function animate() {
    requestAnimationFrame(animate);

    if (watertexture) {
        watertexture.offset.x -= 0.001;
    }
    if (rocket && animateRocket) {
        rocket.position.y += rocketSpeed;
        rocket.rotation.y += 0.001;
        rocketSpeed += speedIncrement;
        
    }
    const speed = 0.1;
    moveControls(keys, controls, speed);
    renderer.render(scene, camera);
}

// Ensure start button is created after DOM content is loaded
window.addEventListener('DOMContentLoaded', createStartButton);
setupControlsAndListeners(camera);
animate();