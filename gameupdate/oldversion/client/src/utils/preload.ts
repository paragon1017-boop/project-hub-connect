import { generateFloorMap, getRandomMonster, Monster, getRandomEquipmentDrop, getRandomPotionDrop, Potion, Equipment } from "@/lib/game-engine";

type FloorMap = {
  map: number[][];
  startX: number;
  startY: number;
};

type FloorCache = Record<number, FloorMap>;
// Optional: preload monsters per floor to memory
let monsterCache: Record<number, Monster[]> = {} as any;
type EquipmentCache = Record<number, Equipment[]>;
type PotionCache = Record<number, Potion[]>;
let equipmentCache: EquipmentCache = {} as any;
let potionCache: PotionCache = {} as any;
const PRELOAD_MAX_FLOORS = 60;
 

let floorCache: FloorCache = {};
let ready = false;

export async function preloadDungeonFloors(maxFloor: number, onProgress?: (progress: number) => void): Promise<void> {
  floorCache = {};
  for (let floor = 1; floor <= maxFloor; floor++) {
    const { map, startX, startY } = generateFloorMap(floor);
    floorCache[floor] = { map, startX, startY };
    // Generate a small pack of monsters for this floor and cache
    const monsters: Monster[] = [];
    const monsterCount = Math.min(6, 1 + floor); // more monsters on higher floors
    for (let i = 0; i < monsterCount; i++) {
      monsters.push((getRandomMonster as any)(floor));
    }
    (monsterCache as any)[floor] = monsters;

    // Preload equipment drops for this floor
    const floorEquip: Equipment[] = [];
    const equipDrops = 2;
    for (let j = 0; j < equipDrops; j++) {
      const drop = (typeof getRandomEquipmentDrop === 'function') ? getRandomEquipmentDrop(floor) : null;
      if (drop) floorEquip.push({ ...drop, id: `${drop.id}_${floor}_${j}_${Date.now()}` });
    }
    (equipmentCache as any)[floor] = floorEquip;

    // Preload potions for this floor
    const floorPotions: Potion[] = [];
    const potionDrops = 2;
    for (let k = 0; k < potionDrops; k++) {
      const p = (typeof getRandomPotionDrop === 'function') ? getRandomPotionDrop(floor) : null;
      if (p) floorPotions.push({ ...p, id: `${p.id}_${floor}_${k}_${Date.now()}` });
    }
    (potionCache as any)[floor] = floorPotions;
    const progress = Math.round((floor / maxFloor) * 100);
    onProgress?.(progress);
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  ready = true;
}

export function getPreloadedFloor(floor: number): FloorMap | undefined {
  return floorCache[floor];
}

export function getPreloadedMonstersForFloor(floor: number): Monster[] | undefined {
  return monsterCache[floor];
}

export function getPreloadedEquipmentForFloor(floor: number): Equipment[] {
  return equipmentCache[floor] ?? [];
}

export function getPreloadedPotionsForFloor(floor: number): Potion[] {
  return potionCache[floor] ?? [];
}

export function isPreloadReady(): boolean {
  return ready;
}
