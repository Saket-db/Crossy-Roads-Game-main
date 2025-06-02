import { queueMove } from "./components/Player";
import { gameOver } from "./hitTest"

function isGameOver() {
  const resultContainer = document.getElementById("result-container");
  return resultContainer && resultContainer.style.visibility === "visible";
}

function safeQueueMove(direction) {
  if (gameOver) return;
  queueMove(direction);
}
document
  .getElementById("forward")
  ?.addEventListener("click", () => safeQueueMove("forward"));

document
  .getElementById("backward")
  ?.addEventListener("click", () => safeQueueMove("backward"));

document
  .getElementById("left")
  ?.addEventListener("click", () => safeQueueMove("left"));

document
  .getElementById("right")
  ?.addEventListener("click", () => safeQueueMove("right"));

window.addEventListener("keydown", (event) => {
  if (isGameOver()) return; // ✅ Block key input if game is over

  if (event.key === "ArrowUp") {
    event.preventDefault();
    safeQueueMove("forward");
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    safeQueueMove("backward");
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    safeQueueMove("left");
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    safeQueueMove("right");
  }
});
