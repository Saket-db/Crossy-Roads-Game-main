import * as THREE from "three";
import { metadata as rows } from "./components/Map";
import { player, position } from "./components/Player";

const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");

export let gameOver = false;

export function hitTest() {
  if (gameOver) return; // ✅ Avoid repeated checks after Game Over

  const row = rows[position.currentRow - 1];
  if (!row) return;

  if (row.type === "car" || row.type === "truck") {
    const playerBoundingBox = new THREE.Box3().setFromObject(player);

    for (const { ref } of row.vehicles) {
      if (!ref) throw Error("Vehicle reference is missing");

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
}