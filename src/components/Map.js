import * as THREE from "three";
import { generateRows } from "../utilities/generateRows";
import { Grass } from "./Grass";
import { Road } from "./Road";
import { InvincibilityPowerup } from "./Invinciblity";
import { Tree } from "./Tree";
import { Car } from "./Car";
import { Truck } from "./Truck";

export const metadata = [];
export const map = new THREE.Group();

export function initializeMap() {
  metadata.length = 0;
  map.remove(...map.children);

  // Initial static rows
  const rows = [Grass(0), Grass(-1), Road(-2), Road(-3), Grass(-4), Grass(-5)];
  rows.forEach((row, index) => {
    row.userData.rowIndex = -index;
    map.add(row);
  });

  addRows();
}

export function addRows() {
  const newMetadata = generateRows(20);
  const startIndex = metadata.length;

  metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    // === Forest (grass) rows
    if (rowData.type === "forest") {
      const row = Grass(rowIndex);
      row.userData.rowIndex = rowIndex;

      // Trees
      rowData.trees.forEach(({ tileIndex, height }) => {
        const tree = Tree(tileIndex, height);
        row.add(tree);
      });

      // 20% chance to spawn invincibility powerup (increased for testing)
      if (Math.random() < 0.2) {
        const tileIndex = Math.floor(Math.random() * 9); // Assume 9 tiles/row
        const powerup = InvincibilityPowerup(tileIndex);
        powerup.name = "invincibility";
        // Store the tile index for easier collision detection
        powerup.userData = { tileIndex: tileIndex };
        row.userData.powerupTile = tileIndex;
        row.add(powerup);
        
        console.log(`Added invincibility powerup at row ${rowIndex}, tile ${tileIndex}`); // Debug log
      }

      map.add(row);
    }

    // === Car rows
    if (rowData.type === "car") {
      const row = Road(rowIndex);
      row.userData.rowIndex = rowIndex;

      rowData.vehicles.forEach((vehicle) => {
        const car = Car(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref = car;
        row.add(car);
      });

      map.add(row);
    }

    // === Truck rows
    if (rowData.type === "truck") {
      const row = Road(rowIndex);
      row.userData.rowIndex = rowIndex;

      rowData.vehicles.forEach((vehicle) => {
        const truck = Truck(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref = truck;
        row.add(truck);
      });

      map.add(row);
    }
  });
}