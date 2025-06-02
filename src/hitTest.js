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

  // === Invincibility pickup (check current row and adjacent rows)
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    const checkRow = position.currentRow + rowOffset;
    const powerupRow = map.children.find(
      (child) => child.userData?.rowIndex === checkRow
    );

    if (powerupRow) {
      const powerup = powerupRow.children.find(
        (obj) => obj.name === "invincibility"
      );

      if (powerup && !playerState.isInvincible) {
        // Use 3D distance check instead of exact tile matching
        const playerPos = new THREE.Vector3();
        player.getWorldPosition(playerPos);
        
        const powerupPos = new THREE.Vector3();
        powerup.getWorldPosition(powerupPos);
        
        const distance = playerPos.distanceTo(powerupPos);
        
        console.log(`Distance to powerup: ${distance.toFixed(2)}, Player pos: ${playerPos.x.toFixed(1)}, Powerup pos: ${powerupPos.x.toFixed(1)}`);
        
        // Collect if within 20 units (adjustable)
        if (distance < 20) {
          console.log("Collecting invincibility powerup!");
          setInvincible(7000); // 7 seconds
          powerup.parent.remove(powerup);
          break; // Exit the loop once we collect a powerup
        }
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