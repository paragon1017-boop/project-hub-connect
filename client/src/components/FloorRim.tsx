import React from 'react';
import { Texture } from 'three';

export type RimEdge = 'N'|'S'|'E'|'W'|'NE'|'NW'|'SE'|'SW';

// Tiny border piece that sits on top of floor tiles to create a rim around edges
export function FloorRim({ x, y, edge, px, py, variant = 0, texture }: {
  x: number;
  y: number;
  edge: RimEdge;
  px: number;
  py: number;
  texture?: Texture | null;
  variant?: number;
}) {
  const rimH = 0.02; // height of the rim above the floor
  const rimThick = 0.08; // thickness of the rim border on the tile edge
  // Randomized visual variation per rim (deterministic based on tile) for rim appearance
  const v = ((typeof variant === 'number' ? variant : 0) % 4 + 4) % 4;
  const colors = [0x888888, 0x7a7a7a, 0x6b6b6b, 0x9a9a9a];
  const color = colors[v];
  let geoArgs: [number, number, number];
  let pos: [number, number, number];
  // Rims sit ON the tile edges (inset into the tile), not extending outward
  if (edge === 'N') {
    // North edge rim sitting on north edge of tile
    geoArgs = [1, rimH, rimThick];
    pos = [x - px + 0.5, rimH / 2, y - py + 0.0 + rimThick / 2];
  } else if (edge === 'S') {
    // South edge rim sitting on south edge of tile
    geoArgs = [1, rimH, rimThick];
    pos = [x - px + 0.5, rimH / 2, y - py + 1.0 - rimThick / 2];
  } else if (edge === 'E') {
    // East edge rim sitting on east edge of tile
    geoArgs = [rimThick, rimH, 1];
    pos = [x - px + 1.0 - rimThick / 2, rimH / 2, y - py + 0.5];
  } else if (edge === 'W') {
    // West edge rim sitting on west edge of tile
    geoArgs = [rimThick, rimH, 1];
    pos = [x - px + 0.0 + rimThick / 2, rimH / 2, y - py + 0.5];
  } else if (edge === 'NE') {
    // Northeast corner
    geoArgs = [rimThick, rimH, rimThick];
    pos = [x - px + 1.0 - rimThick / 2, rimH / 2, y - py + 0.0 + rimThick / 2];
  } else if (edge === 'NW') {
    // Northwest corner
    geoArgs = [rimThick, rimH, rimThick];
    pos = [x - px + 0.0 + rimThick / 2, rimH / 2, y - py + 0.0 + rimThick / 2];
  } else if (edge === 'SE') {
    // Southeast corner
    geoArgs = [rimThick, rimH, rimThick];
    pos = [x - px + 1.0 - rimThick / 2, rimH / 2, y - py + 1.0 - rimThick / 2];
  } else { // 'SW'
    // Southwest corner
    geoArgs = [rimThick, rimH, rimThick];
    pos = [x - px + 0.0 + rimThick / 2, rimH / 2, y - py + 1.0 - rimThick / 2];
  }
  
  return (
    <mesh position={pos}>
      <boxGeometry args={geoArgs} />
      <meshBasicMaterial color={color} map={texture ?? undefined} />
    </mesh>
  );
}
