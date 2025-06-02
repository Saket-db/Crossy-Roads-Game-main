import * as THREE from "three";

let camera;

export function Camera() {
  camera = new THREE.OrthographicCamera(
    -150, 150, 150, -150, 100, 900 // Default view size (zoomed-in)
  );

  camera.up.set(0, 0, 1);
  camera.position.set(300, -300, 300);
  camera.lookAt(0, 0, 0);

  return camera;
}

export function resizeCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  const viewSize = 150; // Controls zoom level; lower = closer

  camera.left = -viewSize * aspect;
  camera.right = viewSize * aspect;
  camera.top = viewSize;
  camera.bottom = -viewSize;
  camera.updateProjectionMatrix();
}
