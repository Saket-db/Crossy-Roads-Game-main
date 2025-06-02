import * as THREE from "three";
import { endsUpInValidPosition } from "../utilities/endsUpInValidPosition";
import { metadata as rows, addRows } from "./Map";

export const player = Player();
export const playerState = {
  isInvincible: false,
  invincibilityEndTime: 0,
};

function Player() {
  const player = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({
      color: "aqua",
      flatShading: true,
    })
  );
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.z = 10;
  player.add(body);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({
      color: "pink",
      flatShading: true,
    })
  );
  cap.position.z = 21;
  cap.castShadow = true;
  cap.receiveShadow = true;
  player.add(cap);

  const playerContainer = new THREE.Group();
  playerContainer.add(player);

  return playerContainer;
}

export const position = {
  currentRow: 0,
  currentTile: 0,
};

export const movesQueue = [];

export function initializePlayer() {
  // Initialize the Three.js player object
  player.position.x = 0;
  player.position.y = 0;
  player.children[0].position.z = 0;

  // Initialize metadata
  position.currentRow = 0;
  position.currentTile = 0;

  // Clear the moves queue
  movesQueue.length = 0;

  // Reset invincibility state
  playerState.isInvincible = false;
  playerState.invincibilityEndTime = 0;
}

export function queueMove(direction) {
  const isValidMove = endsUpInValidPosition(
    {
      rowIndex: position.currentRow,
      tileIndex: position.currentTile,
    },
    [...movesQueue, direction]
  );

  if (!isValidMove) return;

  movesQueue.push(direction);
}

export function stepCompleted() {
  const direction = movesQueue.shift();

  if (direction === "forward") position.currentRow += 1;
  if (direction === "backward") position.currentRow -= 1;
  if (direction === "left") position.currentTile -= 1;
  if (direction === "right") position.currentTile += 1;

  // Add new rows if the player is running out of them
  if (position.currentRow > rows.length - 10) addRows();

  const scoreDOM = document.getElementById("score");
  if (scoreDOM) scoreDOM.innerText = position.currentRow.toString();
}

export function setInvincible(durationMs) {
  playerState.isInvincible = true;
  playerState.invincibilityEndTime = performance.now() + durationMs;

  // Visual feedback: change player body color
  // Access the body mesh: player -> group -> body
  const bodyMesh = player.children[0].children[0];
  if (bodyMesh && bodyMesh.material) {
    bodyMesh.material.color.set("yellow");
    // Add emissive glow for better visibility
    bodyMesh.material.emissive.set(0xffff00);
    bodyMesh.material.emissiveIntensity = 0.3;
  }
}

export function updatePlayerState() {
  if (playerState.isInvincible && performance.now() > playerState.invincibilityEndTime) {
    playerState.isInvincible = false;

    // Reset player color
    const bodyMesh = player.children[0].children[0];
    if (bodyMesh && bodyMesh.material) {
      bodyMesh.material.color.set("aqua");
      bodyMesh.material.emissive.set(0x000000);
      bodyMesh.material.emissiveIntensity = 0;
    }
  }
}