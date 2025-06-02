import * as THREE from "three";
import { metadata as rows, map } from "./components/Map";
import { player, position, playerState, setInvincible } from "./components/Player";

const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");

export let gameOver = false;

export function hitTest() {
  if (gameOver) return;

  const row = rows[position.currentRow - 1];
  if (!row) return;

  // === Invincibility pickup (check actual 3D row)
  const powerupRow = map.children.find(
    (child) => child.userData?.rowIndex === position.currentRow
  );

  if (powerupRow) {
    const powerup = powerupRow.children.find(
      (obj) => obj.name === "invincibility"
    );

    if (powerup) {
      // Check if player is on the same tile as the powerup
      const powerupTileIndex = powerup.userData?.tileIndex;
      
      console.log(`Player tile: ${position.currentTile}, Powerup tile: ${powerupTileIndex}, Currently invincible: ${playerState.isInvincible}`); // Debug log
      
      if (powerupTileIndex === position.currentTile && !playerState.isInvincible) {
        console.log("Collecting invincibility powerup!"); // Debug log
        setInvincible(7000); // 7 seconds
        powerup.parent.remove(powerup);
      }
    }
  }

  // === Collision detection ===
  if ((row.type === "car" || row.type === "truck") && !playerState.isInvincible) {
    const playerBoundingBox = new THREE.Box3().setFromObject(player);

    for (const { ref } of row.vehicles) {
      if (!ref) continue;

      const vehicleBoundingBox = new THREE.Box3().setFromObject(ref);

      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        gameOver = true;
        if (resultDOM && finalScoreDOM) {
          resultDOM.style.visibility = "visible";
          finalScoreDOM.innerText = position.currentRow.toString();
        }
        break;
      }
    }
  }
}

export function resetGameOver() {
  gameOver = false;
  // Reset the Player.js invincibility state
  playerState.isInvincible = false;
  playerState.invincibilityEndTime = 0;
}