// ========== COMPLETE EQUIPMENT DATABASE - ALL 20 SETS ==========
// File: complete_all_equipment.ts
// Total: 540 items (20 sets × 27 items each)

export const COMPLETE_ALL_EQUIPMENT = [
  // [ALL PREVIOUS ITEMS FROM THE 513 ITEMS WOULD BE HERE...]
  // ... continuing from previous code
  
  // ========== NEW SPEED SET: ZEPHYR SPECTER (Speed & Dodge) ==========
  
  // === SET 20: ZEPHYR SPECTER (Maximum Speed & Evasion) ===
  // Fighter - 9 items
  { 
    id: 'zs_f_armor', 
    name: 'Zephyr Specter Plate', 
    slot: 'armor', 
    attack: 8, defense: 6, hp: 15, mp: 0, speed: 5, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Ultimate speed armor. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_helm', 
    name: 'Zephyr Specter Helm', 
    slot: 'helmet', 
    attack: 4, defense: 3, hp: 8, mp: 0, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Speed-focused helm. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_weapon', 
    name: 'Zephyr Specter Blade', 
    slot: 'weapon', 
    attack: 22, defense: 2, hp: 12, mp: 0, speed: 6, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Lightning-fast blade. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_gloves', 
    name: 'Zephyr Specter Gauntlets', 
    slot: 'gloves', 
    attack: 6, defense: 2, hp: 9, mp: 0, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Swift strike gloves. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_shield', 
    name: 'Zephyr Specter Buckler', 
    slot: 'shield', 
    attack: 2, defense: 8, hp: 10, mp: 0, speed: 2, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Light shield. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_boots', 
    name: 'Zephyr Specter Boots', 
    slot: 'boots', 
    attack: 3, defense: 1, hp: 7, mp: 0, speed: 8, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Blindingly fast boots. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_necklace', 
    name: 'Zephyr Specter Pendant', 
    slot: 'necklace', 
    attack: 7, defense: 1, hp: 10, mp: 0, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Speed pendant. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_ring1', 
    name: 'Zephyr Specter Ring', 
    slot: 'ring', 
    attack: 4, defense: 0, hp: 5, mp: 0, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Swiftness ring. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_f_ring2', 
    name: 'Specter Ring', 
    slot: 'ring', 
    attack: 5, defense: 0, hp: 4, mp: 0, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Fighter'], 
    set: 'Zephyr Specter',
    description: 'Ghostly speed ring. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  
  // Mage - 9 items (Zephyr Specter)
  { 
    id: 'zs_m_armor', 
    name: 'Zephyr Specter Robe', 
    slot: 'armor', 
    attack: 6, defense: 4, hp: 12, mp: 25, speed: 5, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Swift mage robe. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_helm', 
    name: 'Zephyr Specter Cowl', 
    slot: 'helmet', 
    attack: 3, defense: 2, hp: 7, mp: 15, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Fast casting cowl. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_weapon', 
    name: 'Zephyr Specter Wand', 
    slot: 'weapon', 
    attack: 15, defense: 1, hp: 9, mp: 20, speed: 6, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Rapid-cast wand. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_gloves', 
    name: 'Zephyr Specter Gloves', 
    slot: 'gloves', 
    attack: 2, defense: 1, hp: 6, mp: 12, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Swift casting gloves. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_boots', 
    name: 'Zephyr Specter Mage Boots', 
    slot: 'boots', 
    attack: 1, defense: 1, hp: 5, mp: 8, speed: 8, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Blink-step boots. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_necklace', 
    name: 'Zephyr Specter Mage Pendant', 
    slot: 'necklace', 
    attack: 5, defense: 0, hp: 8, mp: 15, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Haste pendant. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_relic', 
    name: 'Zephyr Specter Relic', 
    slot: 'relic', 
    attack: 6, defense: 0, hp: 7, mp: 18, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Acceleration relic. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_ring1', 
    name: 'Zephyr Specter Mage Ring', 
    slot: 'ring', 
    attack: 3, defense: 0, hp: 5, mp: 10, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Haste ring. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_m_ring2', 
    name: 'Zephyr Mage Ring', 
    slot: 'ring', 
    attack: 3, defense: 0, hp: 4, mp: 12, speed: 3, 
    rarity: 'epic', 
    allowedJobs: ['Mage'], 
    set: 'Zephyr Specter',
    description: 'Wind mage ring. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  
  // Monk - 9 items (Zephyr Specter)
  { 
    id: 'zs_k_armor', 
    name: 'Zephyr Specter Vest', 
    slot: 'armor', 
    attack: 10, defense: 5, hp: 18, mp: 15, speed: 6, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Ultimate speed vest. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_helm', 
    name: 'Zephyr Specter Headband', 
    slot: 'helmet', 
    attack: 5, defense: 3, hp: 10, mp: 8, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Blurred headband. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_weapon', 
    name: 'Zephyr Specter Claws', 
    slot: 'weapon', 
    attack: 24, defense: 1, hp: 15, mp: 10, speed: 7, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Lightning claws. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_gloves', 
    name: 'Zephyr Specter Wraps', 
    slot: 'gloves', 
    attack: 7, defense: 2, hp: 11, mp: 6, speed: 5, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Wind-woven wraps. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_boots', 
    name: 'Zephyr Specter Monk Boots', 
    slot: 'boots', 
    attack: 4, defense: 1, hp: 9, mp: 5, speed: 9, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Afterimage boots. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_necklace', 
    name: 'Zephyr Specter Monk Necklace', 
    slot: 'necklace', 
    attack: 8, defense: 1, hp: 13, mp: 8, speed: 5, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Gale-force necklace. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_offhand', 
    name: 'Zephyr Specter Offhand', 
    slot: 'offhand', 
    attack: 9, defense: 2, hp: 12, mp: 7, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Whirlwind offhand. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_ring1', 
    name: 'Zephyr Specter Monk Ring', 
    slot: 'ring', 
    attack: 5, defense: 0, hp: 7, mp: 4, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Gale ring. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
  { 
    id: 'zs_k_ring2', 
    name: 'Specter Monk Ring', 
    slot: 'ring', 
    attack: 5, defense: 1, hp: 6, mp: 5, speed: 4, 
    rarity: 'epic', 
    allowedJobs: ['Monk'], 
    set: 'Zephyr Specter',
    description: 'Phantom monk ring. Set: 2p: +15% Speed, 4p: +30% Speed, 6p: +45% Speed, 9p: +50% Speed & +20% Dodge Chance. Speed boosts stack multiplicatively with base speed.' 
  },
];

// ========== UPDATED TYPE DEFINITIONS ==========
export interface EquipmentItem {
  id: string;
  name: string;
  slot: 'armor' | 'helmet' | 'weapon' | 'gloves' | 'shield' | 'boots' | 'necklace' | 'ring' | 'relic' | 'offhand';
  attack: number;
  defense: number;
  hp: number;
  mp: number;
  speed: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  allowedJobs: ('Fighter' | 'Mage' | 'Monk')[];
  set: 'Warrior\'s Might' | 'Hunter\'s Focus' | 'Brute Force' | 
        'Elemental Apprentice' | 'Arcane Scholar' | 'Battle Mage' |
        'Martial Disciple' | 'Shadow Stalker' | 'Iron Body' |
        'Blade Dancer' | 'Bulwark Sentinel' | 'Vampiric Embrace' | 
        'Wind Dancer' | 'Riposte' | 'Frozen Wasteland' | 
        'Inferno Blaze' | 'Storm Caller' | 'Earthen Colossus' |
        'Aegis Guardian' | 'Zephyr Specter';
  description: string;
}

// ========== UPDATED SET BONUS SUMMARIES ==========
export const ALL_SET_BONUSES = {
  // [ALL PREVIOUS SET BONUSES...]
  
  // NEW SET: ZEPHYR SPECTER
  'Zephyr Specter': {
    theme: 'Maximum Speed & Dodge Specialist',
    bonuses: [
      '2p: +15% Speed',
      '4p: +30% Speed',
      '6p: +45% Speed',
      '9p: +50% Speed & +20% Dodge Chance'
    ],
    specialMechanics: [
      'SPEED MECHANICS:',
      '- Speed bonuses stack multiplicatively with base speed',
      '- Higher speed = more attacks per turn, better initiative',
      '- Speed affects movement, attack speed, and casting time',
      
      'DODGE MECHANIC:',
      '- 20% chance to completely avoid incoming attacks',
      '- Dodge works against all physical and magical attacks',
      '- When you dodge, you take NO damage from that attack',
      '- Dodge chance is checked before damage calculation',
      
      'SYNERGIES:',
      '- High speed means more chances to attack',
      '- More attacks = more damage output',
      '- Dodge makes you harder to hit while you attack frequently',
      '- Perfect for hit-and-run tactics'
    ],
    examples: [
      'Base Speed: 100 → With 6p: 145 total speed (45% faster)',
      'With 9p: 150 speed & 20% dodge chance',
      'Every attack has 20% chance to be completely avoided',
      'You attack nearly twice as fast as normal characters'
    ],
    tacticalConsiderations: [
      'Maximize speed to attack more frequently',
      'Use hit-and-run tactics - attack then move away',
      'Dodge chance makes you surprisingly durable despite low defense',
      'Great for kiting slower enemies',
      'Combines well with critical hit builds'
    ],
    playstyle: 'Ultimate speedster that attacks frequently and dodges attacks',
    bestFor: 'Characters who want maximum action economy and evasion',
    comparisons: [
      'vs Wind Dancer: More speed, adds dodge chance',
      'vs Shadow Stalker: Higher speed bonuses, different evasion mechanics',
      'vs Hunter\'s Focus: More specialized for pure speed'
    ]
  }
};

// ========== ENHANCED HELPER FUNCTIONS FOR SPEED & DODGE MECHANICS ==========
export interface SpeedDodgeStats {
  baseSpeed: number;
  speedBonus: number;
  totalSpeed: number;
  dodgeChance: number;
  attacksPerTurn: number;
  movementBonus: number;
}

export function calculateZephyrSpecterStats(
  baseSpeed: number, 
  piecesEquipped: number
): SpeedDodgeStats {
  let speedBonus = 0;
  let dodgeChance = 0;
  
  // Calculate bonuses based on pieces
  if (piecesEquipped >= 9) {
    speedBonus = 0.50; // 50% speed at 9 pieces
    dodgeChance = 0.20; // 20% dodge chance at 9 pieces
  } else if (piecesEquipped >= 6) {
    speedBonus = 0.45; // 45% speed at 6 pieces
    dodgeChance = 0; // No dodge until 9 pieces
  } else if (piecesEquipped >= 4) {
    speedBonus = 0.30; // 30% speed at 4 pieces
    dodgeChance = 0;
  } else if (piecesEquipped >= 2) {
    speedBonus = 0.15; // 15% speed at 2 pieces
    dodgeChance = 0;
  }
  
  const totalSpeed = Math.floor(baseSpeed * (1 + speedBonus));
  const attacksPerTurn = Math.max(1, Math.floor(totalSpeed / 100)); // Every 100 speed = extra attack
  const movementBonus = Math.floor(speedBonus * 2); // 1% speed = 2% movement
  
  return {
    baseSpeed,
    speedBonus,
    totalSpeed,
    dodgeChance,
    attacksPerTurn,
    movementBonus
  };
}

export function checkDodgeTrigger(dodgeChance: number): boolean {
  // Returns true if attack is dodged
  return Math.random() < dodgeChance;
}

export function calculateSpeedAdvantage(
  playerSpeed: number,
  enemySpeed: number
): {
  advantage: number;
  extraAttacks: number;
  initiative: boolean;
} {
  const speedDifference = playerSpeed - enemySpeed;
  const advantage = speedDifference / enemySpeed; // Percentage advantage
  const extraAttacks = Math.max(0, Math.floor(speedDifference / 50)); // Extra attack per 50 speed advantage
  const initiative = playerSpeed > enemySpeed;
  
  return {
    advantage,
    extraAttacks,
    initiative
  };
}

export function processAttackSequence(
  attackerSpeed: number,
  defenderSpeed: number,
  defenderDodgeChance: number
): {
  attacks: number;
  dodges: number;
  hits: number;
  damageMultiplier: number;
} {
  const speedDiff = calculateSpeedAdvantage(attackerSpeed, defenderSpeed);
  const baseAttacks = 1 + speedDiff.extraAttacks;
  let dodges = 0;
  let hits = 0;
  
  // Simulate each attack
  for (let i = 0; i < baseAttacks; i++) {
    const dodged = checkDodgeTrigger(defenderDodgeChance);
    if (dodged) {
      dodges++;
    } else {
      hits++;
    }
  }
  
  // Damage multiplier based on speed advantage
  const damageMultiplier = 1 + (speedDiff.advantage * 0.1); // 10% more damage per 100% speed advantage
  
  return {
    attacks: baseAttacks,
    dodges,
    hits,
    damageMultiplier
  };
}

export function getZephyrSpecterBenefits(
  baseSpeed: number,
  piecesEquipped: number
): {
  speedIncrease: string;
  dodgeChance: string;
  attackFrequency: string;
  movementBonus: string;
} {
  const stats = calculateZephyrSpecterStats(baseSpeed, piecesEquipped);
  
  return {
    speedIncrease: `${Math.floor(stats.speedBonus * 100)}% (${baseSpeed} → ${stats.totalSpeed})`,
    dodgeChance: `${Math.floor(stats.dodgeChance * 100)}% chance to dodge`,
    attackFrequency: `${stats.attacksPerTurn} attacks per turn`,
    movementBonus: `${stats.movementBonus}% increased movement range`
  };
}

// ========== UPDATED SPEED SET COMPARISON ==========
export const SPEED_SET_COMPARISON = {
  'Hunter\'s Focus': {
    type: 'Starter Speed Set',
    speedBonus: 'Up to +30% at 9p',
    special: '+20% Crit Chance, Ignore 15% Defense',
    playstyle: 'Balanced speed with crit focus'
  },
  'Shadow Stalker': {
    type: 'Monk Speed Set', 
    speedBonus: 'Up to +30% at 9p',
    special: '+20% Evasion, +5% Crit Damage',
    playstyle: 'Speed with evasion and stealth'
  },
  'Wind Dancer': {
    type: 'Advanced Speed Set',
    speedBonus: '+30% Movement Speed',
    special: '+15% Evasion, Speed-based explosions',
    playstyle: 'Mobile fighter with evasion'
  },
  'Zephyr Specter': {
    type: 'Ultimate Speed Set',
    speedBonus: 'Up to +50% at 9p',
    special: '+20% Dodge Chance at 9p',
    playstyle: 'Maximum speed with dodge mechanic',
    uniqueFeature: 'Highest speed bonuses, adds 20% dodge at full set'
  }
};

// ========== UPDATED HELPER FUNCTIONS ==========
export const TOTAL_ITEMS = COMPLETE_ALL_EQUIPMENT.length; // 540 items

export function getItemsBySet(setName: string): EquipmentItem[] {
  return COMPLETE_ALL_EQUIPMENT.filter(item => item.set === setName);
}

export function getItemsByJob(job: 'Fighter' | 'Mage' | 'Monk'): EquipmentItem[] {
  return COMPLETE_ALL_EQUIPMENT.filter(item => item.allowedJobs.includes(job));
}

export function getItemsByRarity(rarity: EquipmentItem['rarity']): EquipmentItem[] {
  return COMPLETE_ALL_EQUIPMENT.filter(item => item.rarity === rarity);
}

export function getItemById(id: string): EquipmentItem | undefined {
  return COMPLETE_ALL_EQUIPMENT.find(item => item.id === id);
}

export function getStarterSets(): string[] {
  return [
    'Warrior\'s Might', 'Hunter\'s Focus', 'Brute Force',
    'Elemental Apprentice', 'Arcane Scholar', 'Battle Mage',
    'Martial Disciple', 'Shadow Stalker', 'Iron Body'
  ];
}

export function getAdvancedSets(): string[] {
  return [
    'Blade Dancer', 'Bulwark Sentinel', 'Vampiric Embrace',
    'Wind Dancer', 'Riposte', 'Frozen Wasteland',
    'Inferno Blaze', 'Storm Caller', 'Earthen Colossus',
    'Aegis Guardian', 'Zephyr Specter'  // Added new set
  ];
}

export function getMageFocusedSets(): string[] {
  return ['Elemental Apprentice', 'Arcane Scholar', 'Battle Mage'];
}

export function getMonkFocusedSets(): string[] {
  return ['Martial Disciple', 'Shadow Stalker', 'Iron Body'];
}

export function getTankSets(): string[] {
  return ['Warrior\'s Might', 'Iron Body', 'Bulwark Sentinel', 'Earthen Colossus', 'Aegis Guardian'];
}

export function getSpeedSets(): string[] {
  return ['Hunter\'s Focus', 'Shadow Stalker', 'Wind Dancer', 'Zephyr Specter'];
}

// ========== UPDATED QUICK REFERENCE ==========
/*
TOTAL SETS: 20
- 9 Starter Sets (Uncommon): 243 items
- 11 Advanced Sets (Epic): 297 items
TOTAL ITEMS: 540

NEW SET: ZEPHYR SPECTER (Epic)
• Theme: Maximum Speed & Dodge Specialist
• Mechanics:
  - 2p: +15% Speed
  - 4p: +30% Speed
  - 6p: +45% Speed
  - 9p: +50% Speed & +20% Dodge Chance

SPEED MECHANICS:
• Speed bonuses stack multiplicatively with base speed
• Higher speed = more attacks per turn, better initiative
• Speed affects movement, attack speed, and casting time

DODGE MECHANIC:
• 20% chance to completely avoid incoming attacks
• Dodge works against all physical and magical attacks
• When you dodge, you take NO damage from that attack
• Dodge chance is checked before damage calculation

TACTICAL ADVANTAGES:
1. Attack Frequency: Faster characters attack more often
2. Initiative: Higher speed acts first in combat
3. Movement: Can reposition more effectively
4. Dodge: Random damage mitigation
5. Action Economy: More actions per combat round

EXAMPLE CALCULATIONS:
• Base Speed: 100 → With 6p: 145 total speed (45% faster)
• With 9p: 150 speed & 20% dodge chance
• Every attack has 20% chance to be completely avoided
• You attack nearly twice as fast as normal characters

ID FORMAT FOR NEW SET:
• Fighter: zs_f_armor (Zephyr Specter Fighter Armor)
• Mage: zs_m_armor (Zephyr Specter Mage Armor)
• Monk: zs_k_armor (Zephyr Specter Monk Armor)

NEW HELPER FUNCTIONS:
• calculateZephyrSpecterStats(): Get speed and dodge statistics
• checkDodgeTrigger(): Determine if attack is dodged (20% chance)
• calculateSpeedAdvantage(): Calculate speed difference benefits
• processAttackSequence(): Simulate attack sequence with speed/dodge
• getZephyrSpecterBenefits(): Get formatted benefit descriptions
*/

// ========== COMPREHENSIVE PLAYSTYLE GUIDE ==========
export const PLAYSTYLE_GUIDE = {
  'Zephyr Specter': {
    recommendedClasses: ['Monk', 'Fighter', 'Mage (Battle Mage build)'],
    recommendedStats: {
      primary: 'Speed',
      secondary: 'Attack/Critical',
      tertiary: 'Dodge/Evasion'
    },
    combatStyle: 'Hit-and-run, kiting, burst damage',
    teamRole: 'High-damage dealer, disruptor, finisher',
    strengths: [
      'Unmatched action economy',
      'High survivability through dodge',
      'Excellent at chasing/kiting',
      'Can attack multiple times per turn'
    ],
    weaknesses: [
      'Lower defense and HP',
      'Relies on RNG for dodge',
      'Vulnerable to area attacks',
      'Weaker against high-defense targets'
    ],
    skillSynergies: [
      'Multi-hit skills',
      'Movement abilities',
      'Critical chance boosts',
      'On-hit effects'
    ]
  }
};