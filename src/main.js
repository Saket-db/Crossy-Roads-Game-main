import * as THREE from "three";
import { Renderer } from "./components/Renderer";
import { Camera, resizeCamera } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player, initializePlayer } from "./components/Player";
import { map, initializeMap } from "./components/Map";
import { animateVehicles } from "./animateVehicles";
import { animatePlayer } from "./animatePlayer";
import { hitTest, resetGameOver } from "./hitTest";
import "./style.css";
import "./collectUserInput";

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = DirectionalLight();
dirLight.target = player;
player.add(dirLight);

// Setup camera and renderer
const camera = Camera();
player.add(camera);
let gameOver = false;


const renderer = Renderer();
document.body.appendChild(renderer.domElement);

// Initial sizing
resizeRendererAndCamera();

window.addEventListener("resize", resizeRendererAndCamera);

function resizeRendererAndCamera() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  resizeCamera(); // 📸 Update camera bounds based on aspect ratio only
}


const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");

initializeGame();

document
  .querySelector("#retry")
  ?.addEventListener("click", initializeGame);

function initializeGame() {
  initializePlayer();
   resetGameOver();
  initializeMap();

  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";
  gameOver = false;
}

renderer.setAnimationLoop(() => {
  animateVehicles();
  animatePlayer();
  hitTest();
  renderer.render(scene, camera);
});
