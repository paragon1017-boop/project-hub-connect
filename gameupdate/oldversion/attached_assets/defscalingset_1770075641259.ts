export const LAST_STAND_BONUSES = {
  theme: 'Defense Boost + Scaling Damage Reduction',
  
  // DUAL BONUSES (Defense + Scaling Reduction)
  dualBonuses: [
    '2p: +15% Defense, Max 10% damage reduction (scales with missing HP)',
    '4p: +25% Defense, Max 20% damage reduction (scales with missing HP)',
    '6p: +35% Defense, Max 30% damage reduction (scales with missing HP)',
    '9p: +50% Defense, Max 40% damage reduction (scales with missing HP)'
  ],
  
  // DEFENSE PROGRESSION
  defenseProgression: [
    '2p: +15% Defense (good early boost)',
    '4p: +25% Defense (strong defense)',
    '6p: +35% Defense (very tanky)',
    '9p: +50% Defense (extremely durable)'
  ],
  
  // SCALING REDUCTION PROGRESSION
  reductionProgression: [
    '2p: Up to 10% reduction at 1% HP',
    '4p: Up to 20% reduction at 1% HP',
    '6p: Up to 30% reduction at 1% HP',
    '9p: Up to 40% reduction at 1% HP'
  ],
  
  // TOTAL DAMAGE REDUCTION CALCULATION
  totalReduction: [
    'Formula:',
    '1. Base Damage × (100 / (100 + Defense)) = Defense-reduced damage',
    '2. Then apply scaling damage reduction based on missing HP',
    '',
    'Example (9p set, 100 base defense, 200 HP, 150 damage attack):',
    'Step 1: Defense = 100 + 50% = 150 defense',
    '        Damage = 150 × (100 / (100 + 150)) = 60 damage',
    '',
    'Step 2: If at 50% HP (100/200):',
    '        Missing HP = 50% → Reduction = 40% × 50% = 20%',
    '        Final Damage = 60 × (1 - 0.20) = 48 damage',
    '',
    'Total Reduction: 150 → 48 = 68% damage reduction!'
  ],
  
  // COMPREHENSIVE EXAMPLE
  comprehensiveExample: `
  Character: 200 HP, 100 base defense, wearing 9p set
  
  Enemy Attack: 200 damage
  
  At 100% HP (200/200):
  - Defense: 100 + 50% = 150 defense
  - Defense Reduction: 200 × (100/250) = 80 damage
  - Scaling Reduction: 0% (0% missing HP)
  - Final Damage: 80 damage
  - Total Reduction: 60% (200 → 80)
  
  At 50% HP (100/200):
  - Defense: 150 defense
  - Defense Reduction: 80 damage
  - Scaling Reduction: 40% × 50% = 20%
  - Final Damage: 80 × 0.80 = 64 damage
  - Total Reduction: 68% (200 → 64)
  
  At 10% HP (20/200):
  - Defense: 150 defense  
  - Defense Reduction: 80 damage
  - Scaling Reduction: 40% × 90% = 36%
  - Final Damage: 80 × 0.64 = 51.2 damage
  - Total Reduction: 74.4% (200 → 51.2)
  
  At 1% HP (2/200):
  - Defense: 150 defense
  - Defense Reduction: 80 damage
  - Scaling Reduction: 40% × 99% = 39.6%
  - Final Damage: 80 × 0.604 = 48.3 damage
  - Total Reduction: 75.85% (200 → 48.3)
  `,
  
  // SYNERGY BETWEEN BONUSES
  synergy: [
    'Defense reduces base damage BEFORE scaling reduction',
    'Lower base damage = scaling reduction works on smaller numbers',
    'Combined effect is multiplicative, not additive',
    'Makes you incredibly tanky at low HP'
  ],
  
  playstyle: 'Become an unkillable fortress that gets stronger as HP drops',
  bestFor: 'Main tanks, solo players, comeback specialists'
};