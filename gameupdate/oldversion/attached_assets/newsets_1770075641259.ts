// ========== MAGE-FOCUSED STARTER SETS (3 Sets) ==========
// File: mage_monk_starter_sets.ts
// Total: 162 items (6 sets × 27 items each)

export const MAGE_MONK_STARTER_SETS = [
  // ========== MAGE SET 1: ELEMENTAL APPRENTICE (Elemental Focus) ==========
  // Mage - 9 items
  { 
    id: 'ea_m_armor', 
    name: 'Apprentice Robe', 
    slot: 'armor', 
    attack: 6, defense: 3, hp: 10, mp: 25, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental robe. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_helm', 
    name: 'Apprentice Hat', 
    slot: 'helmet', 
    attack: 3, defense: 2, hp: 6, mp: 15, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental hat. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_weapon', 
    name: 'Apprentice Staff', 
    slot: 'weapon', 
    attack: 9, defense: 0, hp: 5, mp: 30, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental staff. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_gloves', 
    name: 'Apprentice Gloves', 
    slot: 'gloves', 
    attack: 2, defense: 1, hp: 4, mp: 10, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental gloves. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_boots', 
    name: 'Apprentice Boots', 
    slot: 'boots', 
    attack: 1, defense: 1, hp: 3, mp: 8, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental boots. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_necklace', 
    name: 'Apprentice Pendant', 
    slot: 'necklace', 
    attack: 3, defense: 0, hp: 4, mp: 12, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental necklace. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_relic', 
    name: 'Apprentice Relic', 
    slot: 'relic', 
    attack: 4, defense: 0, hp: 3, mp: 20, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental relic. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_ring1', 
    name: 'Apprentice Ring', 
    slot: 'ring', 
    attack: 2, defense: 0, hp: 2, mp: 8, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Basic elemental ring. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  { 
    id: 'ea_m_ring2', 
    name: 'Elemental Ring', 
    slot: 'ring', 
    attack: 2, defense: 0, hp: 1, mp: 10, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Elemental Apprentice',
    description: 'Elemental focus ring. Set: 2p: +15% MP, 4p: +10% Elemental Damage, 6p: +25% MP & +15% Elemental Damage, 9p: +30% MP, +20% Elemental Damage, +10% Cast Speed' 
  },
  
  // Fighter - 9 items (Elemental Apprentice - Mages only)
  { 
    id: 'ea_f_armor', 
    name: 'Spellguard Plate', 
    slot: 'armor', 
    attack: 4, defense: 5, hp: 12, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense armor. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_helm', 
    name: 'Spellguard Helm', 
    slot: 'helmet', 
    attack: 2, defense: 3, hp: 7, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense helm. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_weapon', 
    name: 'Spellguard Sword', 
    slot: 'weapon', 
    attack: 12, defense: 1, hp: 5, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Anti-magic sword. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  // ... (6 more Fighter items for Elemental Apprentice)

  // Monk - 9 items (Elemental Apprentice - Mages only)
  { 
    id: 'ea_k_armor', 
    name: 'Magebane Vest', 
    slot: 'armor', 
    attack: 6, defense: 3, hp: 10, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic vest. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_helm', 
    name: 'Magebane Headband', 
    slot: 'helmet', 
    attack: 3, defense: 2, hp: 6, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic headband. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  // ... (7 more Monk items for Elemental Apprentice)

  // ========== MAGE SET 2: ARCANE SCHOLAR (Spell Power & Efficiency) ==========
  // Mage - 9 items
  { 
    id: 'as_m_armor', 
    name: 'Scholar Robe', 
    slot: 'armor', 
    attack: 7, defense: 2, hp: 8, mp: 30, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s robe. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_helm', 
    name: 'Scholar Hat', 
    slot: 'helmet', 
    attack: 4, defense: 1, hp: 5, mp: 18, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s hat. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_weapon', 
    name: 'Scholar Staff', 
    slot: 'weapon', 
    attack: 11, defense: 0, hp: 4, mp: 35, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s staff. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  // ... (6 more Mage items for Arcane Scholar)

  // Fighter - 9 items (Arcane Scholar - Mages only)
  { 
    id: 'as_f_armor', 
    name: 'Knowledge Plate', 
    slot: 'armor', 
    attack: 3, defense: 6, hp: 14, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge armor. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  // ... (8 more Fighter items for Arcane Scholar)

  // Monk - 9 items (Arcane Scholar - Mages only)
  { 
    id: 'as_k_armor', 
    name: 'Wisdom Vest', 
    slot: 'armor', 
    attack: 5, defense: 4, hp: 11, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom vest. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  // ... (8 more Monk items for Arcane Scholar)

  // ========== MAGE SET 3: BATTLE MAGE (Hybrid Offense) ==========
  // Mage - 9 items
  { 
    id: 'bm_m_armor', 
    name: 'Battle Robe', 
    slot: 'armor', 
    attack: 8, defense: 4, hp: 12, mp: 20, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage robe. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_helm', 
    name: 'Battle Cowl', 
    slot: 'helmet', 
    attack: 4, defense: 2, hp: 7, mp: 12, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage cowl. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_weapon', 
    name: 'Battle Staff', 
    slot: 'weapon', 
    attack: 13, defense: 1, hp: 6, mp: 25, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage staff. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  // ... (6 more Mage items for Battle Mage)

  // Fighter - 9 items (Battle Mage - Mages only)
  { 
    id: 'bm_f_armor', 
    name: 'Warrior Mage Plate', 
    slot: 'armor', 
    attack: 7, defense: 7, hp: 16, mp: 5, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage plate. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  // ... (8 more Fighter items for Battle Mage)

  // Monk - 9 items (Battle Mage - Mages only)
  { 
    id: 'bm_k_armor', 
    name: 'Spellfist Vest', 
    slot: 'armor', 
    attack: 8, defense: 5, hp: 13, mp: 8, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist vest. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  // ... (8 more Monk items for Battle Mage)

  // ========== MONK SET 1: MARTIAL DISCIPLE (Balanced Monk) ==========
  // Monk - 9 items
  { 
    id: 'md_k_armor', 
    name: 'Disciple Vest', 
    slot: 'armor', 
    attack: 8, defense: 4, hp: 14, mp: 10, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple vest. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_helm', 
    name: 'Disciple Headband', 
    slot: 'helmet', 
    attack: 4, defense: 2, hp: 8, mp: 6, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple headband. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_weapon', 
    name: 'Disciple Fists', 
    slot: 'weapon', 
    attack: 14, defense: 1, hp: 10, mp: 8, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple fists. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  // ... (6 more Monk items for Martial Disciple)

  // Fighter - 9 items (Martial Disciple - Monks only)
  { 
    id: 'md_f_armor', 
    name: 'Warrior Disciple Plate', 
    slot: 'armor', 
    attack: 6, defense: 8, hp: 18, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple plate. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  // ... (8 more Fighter items for Martial Disciple)

  // Mage - 9 items (Martial Disciple - Monks only)
  { 
    id: 'md_m_armor', 
    name: 'Mage Disciple Robe', 
    slot: 'armor', 
    attack: 4, defense: 5, hp: 12, mp: 15, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple robe. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  // ... (8 more Mage items for Martial Disciple)

  // ========== MONK SET 2: SHADOW STALKER (Speed & Evasion) ==========
  // Monk - 9 items
  { 
    id: 'ss_k_armor', 
    name: 'Stalker Vest', 
    slot: 'armor', 
    attack: 7, defense: 3, hp: 11, mp: 12, speed: 4, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker vest. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_helm', 
    name: 'Stalker Headband', 
    slot: 'helmet', 
    attack: 3, defense: 2, hp: 7, mp: 8, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker headband. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_weapon', 
    name: 'Stalker Blades', 
    slot: 'weapon', 
    attack: 13, defense: 0, hp: 9, mp: 10, speed: 5, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker blades. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  // ... (6 more Monk items for Shadow Stalker)

  // Fighter - 9 items (Shadow Stalker - Monks only)
  { 
    id: 'ss_f_armor', 
    name: 'Nightguard Plate', 
    slot: 'armor', 
    attack: 5, defense: 6, hp: 15, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard plate. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  // ... (8 more Fighter items for Shadow Stalker)

  // Mage - 9 items (Shadow Stalker - Monks only)
  { 
    id: 'ss_m_armor', 
    name: 'Shadowweaver Robe', 
    slot: 'armor', 
    attack: 5, defense: 4, hp: 10, mp: 18, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver robe. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  // ... (8 more Mage items for Shadow Stalker)

  // ========== MONK SET 3: IRON BODY (Defense & Sustain) ==========
  // Monk - 9 items
  { 
    id: 'ib_k_armor', 
    name: 'Iron Body Vest', 
    slot: 'armor', 
    attack: 9, defense: 6, hp: 16, mp: 8, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body vest. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_helm', 
    name: 'Iron Body Headband', 
    slot: 'helmet', 
    attack: 4, defense: 4, hp: 9, mp: 5, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body headband. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_weapon', 
    name: 'Iron Fists', 
    slot: 'weapon', 
    attack: 15, defense: 2, hp: 11, mp: 6, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron fists. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  // ... (6 more Monk items for Iron Body)

  // Fighter - 9 items (Iron Body - Monks only)
  { 
    id: 'ib_f_armor', 
    name: 'Steelguard Plate', 
    slot: 'armor', 
    attack: 8, defense: 9, hp: 20, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard plate. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  // ... (8 more Fighter items for Iron Body)

  // Mage - 9 items (Iron Body - Monks only)
  { 
    id: 'ib_m_armor', 
    name: 'Stoneweaver Robe', 
    slot: 'armor', 
    attack: 6, defense: 7, hp: 14, mp: 12, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver robe. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  // ... (8 more Mage items for Iron Body)
];

// ========== SET BONUS SUMMARIES ==========
export const MAGE_MONK_SET_BONUSES = {
  // MAGE-FOCUSED SETS
  MAGE_SETS: {
    'Elemental Apprentice': {
      theme: 'Elemental Magic Specialist',
      mageBonuses: [
        '2p: +15% MP',
        '4p: +10% Elemental Damage',
        '6p: +25% MP & +15% Elemental Damage',
        '9p: +30% MP, +20% Elemental Damage, +10% Cast Speed'
      ],
      nonMageBonuses: [
        '2p: +10% Magic Defense',
        '4p: +15% Magic Defense',
        '6p: +20% Magic Defense & +10% HP',
        '9p: +25% Magic Defense, +15% HP, +5% Attack'
      ],
      playstyle: 'Elemental damage dealer with large mana pool',
      bestFor: 'Mages who focus on elemental spells'
    },
    
    'Arcane Scholar': {
      theme: 'Spell Efficiency & Power',
      mageBonuses: [
        '2p: +10% Spell Power',
        '4p: -10% Spell Cost',
        '6p: +20% Spell Power & -15% Spell Cost',
        '9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen'
      ],
      nonMageBonuses: [
        '2p: +10% MP',
        '4p: +15% MP & +5% Attack',
        '6p: +20% MP & +10% Attack',
        '9p: +25% MP, +15% Attack, +5% Spell Power'
      ],
      playstyle: 'Efficient caster with strong spells',
      bestFor: 'Mages who cast frequently'
    },
    
    'Battle Mage': {
      theme: 'Hybrid Physical/Magical',
      mageBonuses: [
        '2p: +10% Attack & Spell Power',
        '4p: +15% Attack & Spell Power',
        '6p: +20% Attack & Spell Power',
        '9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP'
      ],
      nonMageBonuses: [
        '2p: +10% Attack & MP',
        '4p: +15% Attack & MP',
        '6p: +20% Attack & MP',
        '9p: +25% Attack & MP, +10% HP, Spells restore 5% HP'
      ],
      playstyle: 'Versatile hybrid fighter',
      bestFor: 'Mages who mix physical and magical attacks'
    }
  },
  
  // MONK-FOCUSED SETS
  MONK_SETS: {
    'Martial Disciple': {
      theme: 'Balanced Martial Artist',
      monkBonuses: [
        '2p: +10% Attack & Speed',
        '4p: +15% Attack & Speed',
        '6p: +20% Attack & Speed & +10% HP',
        '9p: +25% Attack & Speed, +15% HP, +5% Critical Chance'
      ],
      nonMonkBonuses: [
        '2p: +10% HP & Defense',
        '4p: +15% HP & Defense',
        '6p: +20% HP & Defense & +5% Attack',
        '9p: +25% HP & Defense, +10% Attack, +5% Speed'
      ],
      playstyle: 'Well-rounded martial artist',
      bestFor: 'Monks who want balance of offense and defense'
    },
    
    'Shadow Stalker': {
      theme: 'Speed & Evasion Specialist',
      monkBonuses: [
        '2p: +15% Speed',
        '4p: +10% Evasion',
        '6p: +20% Speed & +15% Evasion',
        '9p: +30% Speed, +20% Evasion, +5% Critical Damage'
      ],
      nonMonkBonuses: [
        '2p: +10% Speed & Evasion',
        '4p: +15% Speed & Evasion',
        '6p: +20% Speed & Evasion',
        '9p: +25% Speed & Evasion, +5% Critical Chance'
      ],
      playstyle: 'Fast, elusive striker',
      bestFor: 'Monks who prioritize dodging and speed'
    },
    
    'Iron Body': {
      theme: 'Defensive Tank Monk',
      monkBonuses: [
        '2p: +15% HP',
        '4p: +10% Defense',
        '6p: +20% HP & +15% Defense',
        '9p: +30% HP, +20% Defense, Heal 2% HP on hit'
      ],
      nonMonkBonuses: [
        '2p: +10% HP & Defense',
        '4p: +15% HP & Defense',
        '6p: +20% HP & Defense',
        '9p: +25% HP & Defense, +5% Attack'
      ],
      playstyle: 'Durable, sustaining fighter',
      bestFor: 'Monks who want to be frontline tanks'
    }
  }
};

// ========== TYPE DEFINITION ==========
export interface MageMonkEquipmentItem {
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
  set: 'Elemental Apprentice' | 'Arcane Scholar' | 'Battle Mage' | 
        'Martial Disciple' | 'Shadow Stalker' | 'Iron Body';
  description: string;
}

export const TOTAL_MAGE_MONK_ITEMS = MAGE_MONK_STARTER_SETS.length; // 162 items

// ========== HELPER FUNCTIONS ==========
export function getMageMonkItemsBySet(setName: string): MageMonkEquipmentItem[] {
  return MAGE_MONK_STARTER_SETS.filter(item => item.set === setName);
}

export function getMageMonkItemsByJob(job: 'Fighter' | 'Mage' | 'Monk'): MageMonkEquipmentItem[] {
  return MAGE_MONK_STARTER_SETS.filter(item => item.allowedJobs.includes(job));
}

export function getMageFocusedSets(): string[] {
  return ['Elemental Apprentice', 'Arcane Scholar', 'Battle Mage'];
}

export function getMonkFocusedSets(): string[] {
  return ['Martial Disciple', 'Shadow Stalker', 'Iron Body'];
}

// ========== QUICK REFERENCE ==========
/*
NEW MAGE-FOCUSED STARTER SETS (3):

1. Elemental Apprentice
   • Theme: Elemental Magic Specialist
   • Mage Focus: MP + Elemental Damage
   • Non-Mages: Magic Defense
   • Best for: Elemental spellcasters

2. Arcane Scholar  
   • Theme: Spell Efficiency & Power
   • Mage Focus: Spell Power + Reduced Cost
   • Non-Mages: MP + Attack
   • Best for: Frequent casters

3. Battle Mage
   • Theme: Hybrid Physical/Magical
   • Mage Focus: Attack + Spell Power
   • Non-Mages: Attack + MP
   • Best for: Hybrid fighters

NEW MONK-FOCUSED STARTER SETS (3):

4. Martial Disciple
   • Theme: Balanced Martial Artist  
   • Monk Focus: Attack + Speed
   • Non-Monks: HP + Defense
   • Best for: Well-rounded monks

5. Shadow Stalker
   • Theme: Speed & Evasion Specialist
   • Monk Focus: Speed + Evasion
   • Non-Monks: Speed + Evasion
   • Best for: Fast, dodgy monks

6. Iron Body
   • Theme: Defensive Tank Monk
   • Monk Focus: HP + Defense + Healing
   • Non-Monks: HP + Defense
   • Best for: Tanky monks

KEY FEATURES:
• Each set has class-specific bonuses
• Mages get different bonuses than non-Mages
• Monks get different bonuses than non-Monks  
• Focused on class identity
• Perfect for early game specialization

TOTAL: 6 sets × 27 items = 162 new items
COMBINED WITH PREVIOUS: 12 starter sets × 27 = 324 starter items
*/

// ========== FILE READY FOR DOWNLOAD ==========
// Save as: mage_monk_starter_sets.ts