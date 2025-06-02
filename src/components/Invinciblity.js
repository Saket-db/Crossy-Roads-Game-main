import * as THREE from "three";

export function InvincibilityPowerup(tileIndex) {
  const geometry = new THREE.SphereGeometry(5, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000, // Black color
    emissive: 0x222222, // Dark gray emissive for visibility
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.name = "invincibility";
  sphere.position.set(tileIndex * 30, 0, 15);

  return sphere;
}