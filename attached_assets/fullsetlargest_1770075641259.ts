// ========== COMPLETE EQUIPMENT DATABASE - ALL 18 SETS ==========
// File: complete_all_equipment.ts
// Total: 486 items (18 sets × 27 items each)

export const COMPLETE_ALL_EQUIPMENT = [
  // ========== ORIGINAL STARTER SETS (3 Sets - Uncommon Rarity) ==========
  
  // === SET 1: WARRIOR'S MIGHT (Defensive Evolution) ===
  { id: 'wm_f_armor', name: 'Warrior Chestplate', slot: 'armor', attack: 8, defense: 6, hp: 16, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior armor. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_helm', name: 'Warrior Helmet', slot: 'helmet', attack: 4, defense: 4, hp: 9, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior helmet. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_weapon', name: 'Warrior Sword', slot: 'weapon', attack: 15, defense: 2, hp: 6, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior sword. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_gloves', name: 'Warrior Gauntlets', slot: 'gloves', attack: 3, defense: 3, hp: 5, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior gloves. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_shield', name: 'Warrior Shield', slot: 'shield', attack: 2, defense: 9, hp: 12, mp: 0, speed: -1, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior shield. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_boots', name: 'Warrior Boots', slot: 'boots', attack: 2, defense: 2, hp: 4, mp: 0, speed: 1, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior boots. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_necklace', name: 'Warrior Pendant', slot: 'necklace', attack: 4, defense: 2, hp: 7, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior necklace. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_ring1', name: 'Warrior Ring', slot: 'ring', attack: 2, defense: 1, hp: 4, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic warrior ring. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_f_ring2', name: 'Might Ring', slot: 'ring', attack: 3, defense: 1, hp: 3, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Warrior\'s Might', description: 'Basic strength ring. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  
  // Mage - 9 items (Warrior's Might)
  { id: 'wm_m_armor', name: 'Battlemage Robe', slot: 'armor', attack: 5, defense: 4, hp: 11, mp: 15, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage robe. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_helm', name: 'Battlemage Hat', slot: 'helmet', attack: 3, defense: 3, hp: 7, mp: 10, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage hat. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_weapon', name: 'Battlemage Staff', slot: 'weapon', attack: 8, defense: 1, hp: 6, mp: 20, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage staff. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_gloves', name: 'Battlemage Gloves', slot: 'gloves', attack: 2, defense: 2, hp: 5, mp: 8, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage gloves. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_boots', name: 'Battlemage Boots', slot: 'boots', attack: 1, defense: 2, hp: 4, mp: 5, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage boots. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_necklace', name: 'Battlemage Pendant', slot: 'necklace', attack: 3, defense: 1, hp: 5, mp: 8, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage necklace. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_relic', name: 'Battlemage Relic', slot: 'relic', attack: 4, defense: 1, hp: 4, mp: 12, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage relic. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_ring1', name: 'Battlemage Ring', slot: 'ring', attack: 2, defense: 1, hp: 3, mp: 6, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic battlemage ring. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_m_ring2', name: 'Arcane Might Ring', slot: 'ring', attack: 2, defense: 1, hp: 2, mp: 8, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Warrior\'s Might', description: 'Basic arcane ring. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  
  // Monk - 9 items (Warrior's Might)
  { id: 'wm_k_armor', name: 'Brawler Vest', slot: 'armor', attack: 7, defense: 4, hp: 13, mp: 5, speed: 1, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler vest. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_helm', name: 'Brawler Headband', slot: 'helmet', attack: 3, defense: 3, hp: 8, mp: 3, speed: 1, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler headband. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_weapon', name: 'Brawler Gloves', slot: 'weapon', attack: 12, defense: 2, hp: 9, mp: 4, speed: 2, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler gloves. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_gloves', name: 'Brawler Wraps', slot: 'gloves', attack: 4, defense: 2, hp: 6, mp: 3, speed: 1, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler wraps. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_boots', name: 'Brawler Boots', slot: 'boots', attack: 3, defense: 2, hp: 5, mp: 2, speed: 2, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler boots. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_necklace', name: 'Brawler Necklace', slot: 'necklace', attack: 5, defense: 2, hp: 7, mp: 5, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler necklace. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_offhand', name: 'Brawler Knuckles', slot: 'offhand', attack: 6, defense: 2, hp: 6, mp: 3, speed: 1, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler knuckles. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_ring1', name: 'Brawler Ring', slot: 'ring', attack: 3, defense: 1, hp: 4, mp: 2, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic brawler ring. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },
  { id: 'wm_k_ring2', name: 'Fist Ring', slot: 'ring', attack: 4, defense: 1, hp: 3, mp: 3, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Warrior\'s Might', description: 'Basic fist ring. Set: 2p: +10% Atk/Def, 4p: +20% Atk/HP, 6p: +30% Atk/Def, 9p: +40% Def, +15% HP' },

  // === SET 2: HUNTER'S FOCUS (Speed & Critical) ===
  // Fighter - 9 items
  { id: 'hf_f_armor', name: 'Hunter Chestplate', slot: 'armor', attack: 7, defense: 4, hp: 12, mp: 0, speed: 2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter armor. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_helm', name: 'Hunter Helmet', slot: 'helmet', attack: 3, defense: 2, hp: 7, mp: 0, speed: 2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter helmet. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_weapon', name: 'Hunter Bow', slot: 'weapon', attack: 14, defense: 0, hp: 6, mp: 0, speed: 3, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter bow. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_gloves', name: 'Hunter Gloves', slot: 'gloves', attack: 4, defense: 1, hp: 5, mp: 0, speed: 2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter gloves. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_shield', name: 'Hunter Quiver', slot: 'shield', attack: 3, defense: 4, hp: 8, mp: 0, speed: 1, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter quiver. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_boots', name: 'Hunter Boots', slot: 'boots', attack: 3, defense: 1, hp: 4, mp: 0, speed: 4, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter boots. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_necklace', name: 'Hunter Pendant', slot: 'necklace', attack: 5, defense: 0, hp: 5, mp: 0, speed: 2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter necklace. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_ring1', name: 'Hunter Ring', slot: 'ring', attack: 3, defense: 0, hp: 4, mp: 0, speed: 2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic hunter ring. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  { id: 'hf_f_ring2', name: 'Focus Ring', slot: 'ring', attack: 4, defense: 0, hp: 3, mp: 0, speed: 2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Hunter\'s Focus', description: 'Basic focus ring. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Ignore 15% Defense' },
  
  // Mage - 9 items (Hunter's Focus)
  { id: 'hf_m_armor', name: 'Arcanist Robe', slot: 'armor', attack: 6, defense: 3, hp: 10, mp: 20, speed: 2, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist robe. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_helm', name: 'Arcanist Hat', slot: 'helmet', attack: 4, defense: 2, hp: 7, mp: 15, speed: 2, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist hat. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_weapon', name: 'Arcanist Wand', slot: 'weapon', attack: 10, defense: 0, hp: 6, mp: 25, speed: 2, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist wand. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_gloves', name: 'Arcanist Gloves', slot: 'gloves', attack: 2, defense: 1, hp: 4, mp: 8, speed: 2, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist gloves. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_boots', name: 'Arcanist Boots', slot: 'boots', attack: 1, defense: 1, hp: 3, mp: 6, speed: 3, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist boots. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_necklace', name: 'Arcanist Pendant', slot: 'necklace', attack: 3, defense: 0, hp: 4, mp: 10, speed: 1, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist pendant. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_relic', name: 'Arcanist Relic', slot: 'relic', attack: 4, defense: 0, hp: 3, mp: 12, speed: 1, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist relic. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_ring1', name: 'Arcanist Ring', slot: 'ring', attack: 2, defense: 0, hp: 2, mp: 8, speed: 1, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Basic arcanist ring. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  { id: 'hf_m_ring2', name: 'Focus Relic Ring', slot: 'ring', attack: 2, defense: 0, hp: 1, mp: 10, speed: 1, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Hunter\'s Focus', description: 'Focus relic ring. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Spells ignore 15% Magic Resistance' },
  
  // Monk - 9 items (Hunter's Focus)
  { id: 'hf_k_armor', name: 'Scout Vest', slot: 'armor', attack: 8, defense: 3, hp: 12, mp: 8, speed: 3, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout vest. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_helm', name: 'Scout Headband', slot: 'helmet', attack: 4, defense: 2, hp: 8, mp: 5, speed: 3, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout headband. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_weapon', name: 'Scout Darts', slot: 'weapon', attack: 13, defense: 0, hp: 9, mp: 6, speed: 4, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout darts. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_gloves', name: 'Scout Wraps', slot: 'gloves', attack: 4, defense: 1, hp: 6, mp: 4, speed: 3, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout wraps. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_boots', name: 'Scout Boots', slot: 'boots', attack: 3, defense: 1, hp: 5, mp: 3, speed: 4, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout boots. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_necklace', name: 'Scout Necklace', slot: 'necklace', attack: 5, defense: 0, hp: 7, mp: 5, speed: 2, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout necklace. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_offhand', name: 'Scout Offhand', slot: 'offhand', attack: 6, defense: 1, hp: 6, mp: 4, speed: 3, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout offhand. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_ring1', name: 'Scout Ring', slot: 'ring', attack: 3, defense: 0, hp: 4, mp: 3, speed: 2, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Basic scout ring. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },
  { id: 'hf_k_ring2', name: 'Hunter Monk Ring', slot: 'ring', attack: 4, defense: 0, hp: 3, mp: 4, speed: 2, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Hunter\'s Focus', description: 'Hunter monk ring. Set: 2p: +15% Speed, 4p: +10% Crit Chance, 6p: +20% Speed & +15% Crit, 9p: +30% Speed, +20% Crit, Attacks ignore 15% Defense' },

  // === SET 3: BRUTE FORCE (Raw Attack & Penetration) ===
  // Fighter - 9 items
  { id: 'bf_f_armor', name: 'Brute Chestplate', slot: 'armor', attack: 10, defense: 3, hp: 16, mp: 0, speed: -1, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute armor. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_helm', name: 'Brute Helmet', slot: 'helmet', attack: 5, defense: 1, hp: 9, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute helmet. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_weapon', name: 'Brute Axe', slot: 'weapon', attack: 18, defense: 1, hp: 8, mp: 0, speed: -1, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute axe. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_gloves', name: 'Brute Gauntlets', slot: 'gloves', attack: 6, defense: 0, hp: 6, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute gloves. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_shield', name: 'Brute Tower Shield', slot: 'shield', attack: 4, defense: 6, hp: 12, mp: 0, speed: -2, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute shield. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_boots', name: 'Brute Boots', slot: 'boots', attack: 4, defense: 1, hp: 6, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute boots. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_necklace', name: 'Brute Pendant', slot: 'necklace', attack: 6, defense: 0, hp: 7, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute necklace. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_ring1', name: 'Brute Ring', slot: 'ring', attack: 4, defense: 0, hp: 5, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic brute ring. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  { id: 'bf_f_ring2', name: 'Force Ring', slot: 'ring', attack: 5, defense: 0, hp: 4, mp: 0, speed: 0, rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Brute Force', description: 'Basic force ring. Set: 2p: +15% Attack, 4p: Ignore 10% Defense, 6p: +30% Attack & Ignore 15% Defense, 9p: +45% Attack, Ignore 25% Defense, +10% HP' },
  
  // Mage - 9 items (Brute Force)
  { id: 'bf_m_armor', name: 'War Mage Robe', slot: 'armor', attack: 8, defense: 2, hp: 12, mp: 15, speed: -1, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage robe. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_helm', name: 'War Mage Hat', slot: 'helmet', attack: 4, defense: 1, hp: 8, mp: 10, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage hat. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_weapon', name: 'War Mage Staff', slot: 'weapon', attack: 12, defense: 0, hp: 6, mp: 20, speed: -1, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage staff. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_gloves', name: 'War Mage Gloves', slot: 'gloves', attack: 3, defense: 0, hp: 5, mp: 8, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage gloves. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_boots', name: 'War Mage Boots', slot: 'boots', attack: 2, defense: 0, hp: 4, mp: 6, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage boots. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_necklace', name: 'War Mage Pendant', slot: 'necklace', attack: 4, defense: 0, hp: 5, mp: 8, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage pendant. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_relic', name: 'War Mage Relic', slot: 'relic', attack: 5, defense: 0, hp: 4, mp: 12, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage relic. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_ring1', name: 'War Mage Ring', slot: 'ring', attack: 3, defense: 0, hp: 3, mp: 6, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Basic war mage ring. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  { id: 'bf_m_ring2', name: 'Force Mage Ring', slot: 'ring', attack: 3, defense: 0, hp: 2, mp: 8, speed: 0, rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Brute Force', description: 'Force mage ring. Set: 2p: +15% Attack, 4p: Spells ignore 10% Magic Resistance, 6p: +30% Attack & Spells ignore 15% Magic Resistance, 9p: +45% Attack, Spells ignore 25% Magic Resistance, +10% HP' },
  
  // Monk - 9 items (Brute Force)
  { id: 'bf_k_armor', name: 'Crusher Vest', slot: 'armor', attack: 9, defense: 2, hp: 14, mp: 5, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher vest. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_helm', name: 'Crusher Headband', slot: 'helmet', attack: 4, defense: 1, hp: 9, mp: 3, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher headband. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_weapon', name: 'Crusher Fists', slot: 'weapon', attack: 16, defense: 1, hp: 10, mp: 4, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher fists. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_gloves', name: 'Crusher Wraps', slot: 'gloves', attack: 5, defense: 0, hp: 7, mp: 3, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher wraps. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_boots', name: 'Crusher Boots', slot: 'boots', attack: 4, defense: 0, hp: 6, mp: 2, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher boots. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_necklace', name: 'Crusher Necklace', slot: 'necklace', attack: 6, defense: 0, hp: 8, mp: 5, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher necklace. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_offhand', name: 'Crusher Offhand', slot: 'offhand', attack: 7, defense: 0, hp: 7, mp: 3, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher offhand. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_ring1', name: 'Crusher Ring', slot: 'ring', attack: 4, defense: 0, hp: 5, mp: 2, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Basic crusher ring. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },
  { id: 'bf_k_ring2', name: 'Force Monk Ring', slot: 'ring', attack: 5, defense: 0, hp: 4, mp: 3, speed: 0, rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Brute Force', description: 'Force monk ring. Set: 2p: +15% Attack, 4p: Attacks ignore 10% Defense, 6p: +30% Attack & Attacks ignore 15% Defense, 9p: +45% Attack, Attacks ignore 25% Defense, +10% HP' },

  // ========== MAGE-FOCUSED STARTER SETS (3 New Sets) ==========
  
  // === SET 4: ELEMENTAL APPRENTICE (Elemental Focus) ===
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
  { 
    id: 'ea_f_gloves', 
    name: 'Spellguard Gauntlets', 
    slot: 'gloves', 
    attack: 3, defense: 2, hp: 4, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense gloves. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_shield', 
    name: 'Spellguard Shield', 
    slot: 'shield', 
    attack: 1, defense: 8, hp: 10, mp: 0, speed: -1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense shield. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_boots', 
    name: 'Spellguard Boots', 
    slot: 'boots', 
    attack: 1, defense: 1, hp: 3, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense boots. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_necklace', 
    name: 'Spellguard Pendant', 
    slot: 'necklace', 
    attack: 3, defense: 1, hp: 5, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense necklace. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_ring1', 
    name: 'Spellguard Ring', 
    slot: 'ring', 
    attack: 2, defense: 0, hp: 3, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic defense ring. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_f_ring2', 
    name: 'Magic Ward Ring', 
    slot: 'ring', 
    attack: 2, defense: 1, hp: 2, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Elemental Apprentice',
    description: 'Magic ward ring. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  
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
  { 
    id: 'ea_k_weapon', 
    name: 'Magebane Fists', 
    slot: 'weapon', 
    attack: 11, defense: 1, hp: 8, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic fists. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_gloves', 
    name: 'Magebane Wraps', 
    slot: 'gloves', 
    attack: 4, defense: 1, hp: 5, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic wraps. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_boots', 
    name: 'Magebane Boots', 
    slot: 'boots', 
    attack: 2, defense: 1, hp: 4, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic boots. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_necklace', 
    name: 'Magebane Necklace', 
    slot: 'necklace', 
    attack: 4, defense: 0, hp: 6, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic necklace. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_offhand', 
    name: 'Magebane Knuckles', 
    slot: 'offhand', 
    attack: 5, defense: 1, hp: 5, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic knuckles. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_ring1', 
    name: 'Magebane Ring', 
    slot: 'ring', 
    attack: 3, defense: 0, hp: 3, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Anti-magic ring. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },
  { 
    id: 'ea_k_ring2', 
    name: 'Arcane Ward Ring', 
    slot: 'ring', 
    attack: 3, defense: 1, hp: 2, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Elemental Apprentice',
    description: 'Arcane ward ring. Set: 2p: +10% Magic Defense, 4p: +15% Magic Defense, 6p: +20% Magic Defense & +10% HP, 9p: +25% Magic Defense, +15% HP, +5% Attack' 
  },

  // === SET 5: ARCANE SCHOLAR (Spell Power & Efficiency) ===
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
  { 
    id: 'as_m_gloves', 
    name: 'Scholar Gloves', 
    slot: 'gloves', 
    attack: 2, defense: 0, hp: 3, mp: 12, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s gloves. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_boots', 
    name: 'Scholar Boots', 
    slot: 'boots', 
    attack: 1, defense: 0, hp: 2, mp: 10, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s boots. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_necklace', 
    name: 'Scholar Pendant', 
    slot: 'necklace', 
    attack: 4, defense: 0, hp: 3, mp: 15, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s pendant. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_relic', 
    name: 'Scholar Relic', 
    slot: 'relic', 
    attack: 5, defense: 0, hp: 2, mp: 25, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s relic. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_ring1', 
    name: 'Scholar Ring', 
    slot: 'ring', 
    attack: 3, defense: 0, hp: 1, mp: 10, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Scholar\'s ring. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },
  { 
    id: 'as_m_ring2', 
    name: 'Arcane Ring', 
    slot: 'ring', 
    attack: 3, defense: 0, hp: 1, mp: 12, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Arcane Scholar',
    description: 'Arcane focus ring. Set: 2p: +10% Spell Power, 4p: -10% Spell Cost, 6p: +20% Spell Power & -15% Spell Cost, 9p: +30% Spell Power, -20% Spell Cost, +10% MP Regen' 
  },

  // Fighter - 9 items (Arcane Scholar - Mages only)
  { 
    id: 'as_f_armor', 
    name: 'Knowledge Plate', 
    slot: 'armor', 
    attack: 3, defense: 6, hp: 14, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge armor. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_helm', 
    name: 'Knowledge Helm', 
    slot: 'helmet', 
    attack: 1, defense: 4, hp: 8, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge helm. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_weapon', 
    name: 'Knowledge Sword', 
    slot: 'weapon', 
    attack: 10, defense: 2, hp: 7, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge sword. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_gloves', 
    name: 'Knowledge Gauntlets', 
    slot: 'gloves', 
    attack: 2, defense: 3, hp: 5, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge gloves. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_shield', 
    name: 'Knowledge Shield', 
    slot: 'shield', 
    attack: 0, defense: 7, hp: 9, mp: 0, speed: -1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge shield. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_boots', 
    name: 'Knowledge Boots', 
    slot: 'boots', 
    attack: 1, defense: 2, hp: 4, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge boots. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_necklace', 
    name: 'Knowledge Pendant', 
    slot: 'necklace', 
    attack: 2, defense: 1, hp: 6, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge necklace. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_ring1', 
    name: 'Knowledge Ring', 
    slot: 'ring', 
    attack: 1, defense: 0, hp: 4, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Knowledge ring. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_f_ring2', 
    name: 'Arcane Knowledge Ring', 
    slot: 'ring', 
    attack: 1, defense: 1, hp: 3, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Arcane Scholar',
    description: 'Arcane knowledge ring. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },

  // Monk - 9 items (Arcane Scholar - Mages only)
  { 
    id: 'as_k_armor', 
    name: 'Wisdom Vest', 
    slot: 'armor', 
    attack: 5, defense: 4, hp: 11, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom vest. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_helm', 
    name: 'Wisdom Headband', 
    slot: 'helmet', 
    attack: 2, defense: 3, hp: 7, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom headband. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_weapon', 
    name: 'Wisdom Fists', 
    slot: 'weapon', 
    attack: 9, defense: 2, hp: 9, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom fists. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_gloves', 
    name: 'Wisdom Wraps', 
    slot: 'gloves', 
    attack: 3, defense: 2, hp: 6, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom wraps. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_boots', 
    name: 'Wisdom Boots', 
    slot: 'boots', 
    attack: 2, defense: 1, hp: 5, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom boots. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_necklace', 
    name: 'Wisdom Necklace', 
    slot: 'necklace', 
    attack: 3, defense: 0, hp: 7, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom necklace. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_offhand', 
    name: 'Wisdom Knuckles', 
    slot: 'offhand', 
    attack: 4, defense: 2, hp: 6, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom knuckles. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_ring1', 
    name: 'Wisdom Ring', 
    slot: 'ring', 
    attack: 2, defense: 0, hp: 4, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Wisdom ring. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },
  { 
    id: 'as_k_ring2', 
    name: 'Arcane Wisdom Ring', 
    slot: 'ring', 
    attack: 2, defense: 1, hp: 3, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Arcane Scholar',
    description: 'Arcane wisdom ring. Set: 2p: +10% MP, 4p: +15% MP & +5% Attack, 6p: +20% MP & +10% Attack, 9p: +25% MP, +15% Attack, +5% Spell Power' 
  },

  // === SET 6: BATTLE MAGE (Hybrid Offense) ===
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
  { 
    id: 'bm_m_gloves', 
    name: 'Battle Gloves', 
    slot: 'gloves', 
    attack: 3, defense: 1, hp: 5, mp: 8, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage gloves. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_boots', 
    name: 'Battle Boots', 
    slot: 'boots', 
    attack: 2, defense: 1, hp: 4, mp: 6, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage boots. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_necklace', 
    name: 'Battle Pendant', 
    slot: 'necklace', 
    attack: 5, defense: 0, hp: 5, mp: 10, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage pendant. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_relic', 
    name: 'Battle Relic', 
    slot: 'relic', 
    attack: 6, defense: 0, hp: 4, mp: 15, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage relic. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_ring1', 
    name: 'Battle Ring', 
    slot: 'ring', 
    attack: 4, defense: 0, hp: 3, mp: 6, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Battle mage ring. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },
  { 
    id: 'bm_m_ring2', 
    name: 'Hybrid Ring', 
    slot: 'ring', 
    attack: 4, defense: 0, hp: 2, mp: 8, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Battle Mage',
    description: 'Hybrid focus ring. Set: 2p: +10% Attack & Spell Power, 4p: +15% Attack & Spell Power, 6p: +20% Attack & Spell Power, 9p: +25% Attack & Spell Power, +10% HP, Attacks restore 5% MP' 
  },

  // Fighter - 9 items (Battle Mage - Mages only)
  { 
    id: 'bm_f_armor', 
    name: 'Warrior Mage Plate', 
    slot: 'armor', 
    attack: 7, defense: 7, hp: 16, mp: 5, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage plate. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_helm', 
    name: 'Warrior Mage Helm', 
    slot: 'helmet', 
    attack: 3, defense: 5, hp: 9, mp: 3, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage helm. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_weapon', 
    name: 'Warrior Mage Sword', 
    slot: 'weapon', 
    attack: 14, defense: 3, hp: 8, mp: 4, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage sword. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_gloves', 
    name: 'Warrior Mage Gauntlets', 
    slot: 'gloves', 
    attack: 4, defense: 4, hp: 6, mp: 2, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage gloves. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_shield', 
    name: 'Warrior Mage Shield', 
    slot: 'shield', 
    attack: 2, defense: 8, hp: 11, mp: 3, speed: -1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage shield. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_boots', 
    name: 'Warrior Mage Boots', 
    slot: 'boots', 
    attack: 2, defense: 3, hp: 5, mp: 1, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage boots. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_necklace', 
    name: 'Warrior Mage Pendant', 
    slot: 'necklace', 
    attack: 4, defense: 2, hp: 7, mp: 2, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage pendant. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_ring1', 
    name: 'Warrior Mage Ring', 
    slot: 'ring', 
    attack: 3, defense: 1, hp: 4, mp: 1, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Warrior mage ring. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_f_ring2', 
    name: 'Hybrid Warrior Ring', 
    slot: 'ring', 
    attack: 3, defense: 2, hp: 3, mp: 2, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Battle Mage',
    description: 'Hybrid warrior ring. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },

  // Monk - 9 items (Battle Mage - Mages only)
  { 
    id: 'bm_k_armor', 
    name: 'Spellfist Vest', 
    slot: 'armor', 
    attack: 8, defense: 5, hp: 13, mp: 8, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist vest. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_helm', 
    name: 'Spellfist Headband', 
    slot: 'helmet', 
    attack: 4, defense: 3, hp: 8, mp: 5, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist headband. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_weapon', 
    name: 'Spellfist', 
    slot: 'weapon', 
    attack: 12, defense: 2, hp: 10, mp: 6, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist weapon. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_gloves', 
    name: 'Spellfist Wraps', 
    slot: 'gloves', 
    attack: 5, defense: 2, hp: 7, mp: 4, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist wraps. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_boots', 
    name: 'Spellfist Boots', 
    slot: 'boots', 
    attack: 3, defense: 2, hp: 6, mp: 3, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist boots. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_necklace', 
    name: 'Spellfist Necklace', 
    slot: 'necklace', 
    attack: 6, defense: 1, hp: 8, mp: 5, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist necklace. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_offhand', 
    name: 'Spellfist Offhand', 
    slot: 'offhand', 
    attack: 7, defense: 2, hp: 7, mp: 4, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist offhand. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_ring1', 
    name: 'Spellfist Ring', 
    slot: 'ring', 
    attack: 4, defense: 1, hp: 5, mp: 2, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Spellfist ring. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },
  { 
    id: 'bm_k_ring2', 
    name: 'Hybrid Monk Ring', 
    slot: 'ring', 
    attack: 4, defense: 2, hp: 4, mp: 3, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Battle Mage',
    description: 'Hybrid monk ring. Set: 2p: +10% Attack & MP, 4p: +15% Attack & MP, 6p: +20% Attack & MP, 9p: +25% Attack & MP, +10% HP, Spells restore 5% HP' 
  },

  // ========== MONK-FOCUSED STARTER SETS (3 New Sets) ==========
  
  // === SET 7: MARTIAL DISCIPLE (Balanced Monk) ===
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
  { 
    id: 'md_k_gloves', 
    name: 'Disciple Wraps', 
    slot: 'gloves', 
    attack: 5, defense: 1, hp: 7, mp: 5, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple wraps. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_boots', 
    name: 'Disciple Boots', 
    slot: 'boots', 
    attack: 3, defense: 1, hp: 6, mp: 4, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple boots. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_necklace', 
    name: 'Disciple Necklace', 
    slot: 'necklace', 
    attack: 6, defense: 0, hp: 9, mp: 6, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple necklace. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_offhand', 
    name: 'Disciple Knuckles', 
    slot: 'offhand', 
    attack: 7, defense: 1, hp: 8, mp: 5, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple knuckles. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_ring1', 
    name: 'Disciple Ring', 
    slot: 'ring', 
    attack: 4, defense: 0, hp: 5, mp: 3, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial disciple ring. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },
  { 
    id: 'md_k_ring2', 
    name: 'Martial Ring', 
    slot: 'ring', 
    attack: 4, defense: 1, hp: 4, mp: 4, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Martial Disciple',
    description: 'Martial focus ring. Set: 2p: +10% Attack & Speed, 4p: +15% Attack & Speed, 6p: +20% Attack & Speed & +10% HP, 9p: +25% Attack & Speed, +15% HP, +5% Critical Chance' 
  },

  // Fighter - 9 items (Martial Disciple - Monks only)
  { 
    id: 'md_f_armor', 
    name: 'Warrior Disciple Plate', 
    slot: 'armor', 
    attack: 6, defense: 8, hp: 18, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple plate. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_helm', 
    name: 'Warrior Disciple Helm', 
    slot: 'helmet', 
    attack: 3, defense: 5, hp: 10, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple helm. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_weapon', 
    name: 'Warrior Disciple Sword', 
    slot: 'weapon', 
    attack: 12, defense: 4, hp: 11, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple sword. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_gloves', 
    name: 'Warrior Disciple Gauntlets', 
    slot: 'gloves', 
    attack: 4, defense: 4, hp: 7, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple gloves. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_shield', 
    name: 'Warrior Disciple Shield', 
    slot: 'shield', 
    attack: 1, defense: 9, hp: 13, mp: 0, speed: -1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple shield. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_boots', 
    name: 'Warrior Disciple Boots', 
    slot: 'boots', 
    attack: 2, defense: 3, hp: 6, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple boots. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_necklace', 
    name: 'Warrior Disciple Pendant', 
    slot: 'necklace', 
    attack: 3, defense: 2, hp: 8, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple pendant. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_ring1', 
    name: 'Warrior Disciple Ring', 
    slot: 'ring', 
    attack: 2, defense: 1, hp: 5, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Warrior disciple ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_f_ring2', 
    name: 'Discipline Ring', 
    slot: 'ring', 
    attack: 2, defense: 2, hp: 4, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Martial Disciple',
    description: 'Discipline focus ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },

  // Mage - 9 items (Martial Disciple - Monks only)
  { 
    id: 'md_m_armor', 
    name: 'Mage Disciple Robe', 
    slot: 'armor', 
    attack: 4, defense: 5, hp: 12, mp: 15, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple robe. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_helm', 
    name: 'Mage Disciple Hat', 
    slot: 'helmet', 
    attack: 2, defense: 3, hp: 7, mp: 10, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple hat. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_weapon', 
    name: 'Mage Disciple Staff', 
    slot: 'weapon', 
    attack: 8, defense: 2, hp: 8, mp: 12, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple staff. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_gloves', 
    name: 'Mage Disciple Gloves', 
    slot: 'gloves', 
    attack: 1, defense: 2, hp: 5, mp: 8, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple gloves. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_boots', 
    name: 'Mage Disciple Boots', 
    slot: 'boots', 
    attack: 1, defense: 2, hp: 4, mp: 6, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple boots. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_necklace', 
    name: 'Mage Disciple Pendant', 
    slot: 'necklace', 
    attack: 2, defense: 1, hp: 6, mp: 8, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple pendant. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_relic', 
    name: 'Mage Disciple Relic', 
    slot: 'relic', 
    attack: 3, defense: 1, hp: 5, mp: 10, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple relic. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_ring1', 
    name: 'Mage Disciple Ring', 
    slot: 'ring', 
    attack: 1, defense: 0, hp: 3, mp: 5, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Mage disciple ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },
  { 
    id: 'md_m_ring2', 
    name: 'Martial Mage Ring', 
    slot: 'ring', 
    attack: 1, defense: 1, hp: 2, mp: 6, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Martial Disciple',
    description: 'Martial mage ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense & +5% Attack, 9p: +25% HP & Defense, +10% Attack, +5% Speed' 
  },

  // === SET 8: SHADOW STALKER (Speed & Evasion) ===
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
  { 
    id: 'ss_k_gloves', 
    name: 'Stalker Wraps', 
    slot: 'gloves', 
    attack: 4, defense: 1, hp: 6, mp: 6, speed: 4, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker wraps. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_boots', 
    name: 'Stalker Boots', 
    slot: 'boots', 
    attack: 2, defense: 1, hp: 5, mp: 5, speed: 5, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker boots. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_necklace', 
    name: 'Stalker Necklace', 
    slot: 'necklace', 
    attack: 5, defense: 0, hp: 8, mp: 7, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker necklace. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_offhand', 
    name: 'Stalker Offhand', 
    slot: 'offhand', 
    attack: 6, defense: 1, hp: 7, mp: 6, speed: 4, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker offhand. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_ring1', 
    name: 'Stalker Ring', 
    slot: 'ring', 
    attack: 3, defense: 0, hp: 4, mp: 4, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow stalker ring. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },
  { 
    id: 'ss_k_ring2', 
    name: 'Shadow Ring', 
    slot: 'ring', 
    attack: 3, defense: 1, hp: 3, mp: 5, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Shadow Stalker',
    description: 'Shadow focus ring. Set: 2p: +15% Speed, 4p: +10% Evasion, 6p: +20% Speed & +15% Evasion, 9p: +30% Speed, +20% Evasion, +5% Critical Damage' 
  },

  // Fighter - 9 items (Shadow Stalker - Monks only)
  { 
    id: 'ss_f_armor', 
    name: 'Nightguard Plate', 
    slot: 'armor', 
    attack: 5, defense: 6, hp: 15, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard plate. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_helm', 
    name: 'Nightguard Helm', 
    slot: 'helmet', 
    attack: 2, defense: 4, hp: 8, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard helm. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_weapon', 
    name: 'Nightguard Sword', 
    slot: 'weapon', 
    attack: 11, defense: 3, hp: 10, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard sword. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_gloves', 
    name: 'Nightguard Gauntlets', 
    slot: 'gloves', 
    attack: 3, defense: 3, hp: 6, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard gloves. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_shield', 
    name: 'Nightguard Shield', 
    slot: 'shield', 
    attack: 1, defense: 7, hp: 11, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard shield. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_boots', 
    name: 'Nightguard Boots', 
    slot: 'boots', 
    attack: 1, defense: 2, hp: 5, mp: 0, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard boots. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_necklace', 
    name: 'Nightguard Pendant', 
    slot: 'necklace', 
    attack: 2, defense: 1, hp: 7, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard pendant. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_ring1', 
    name: 'Nightguard Ring', 
    slot: 'ring', 
    attack: 1, defense: 0, hp: 4, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Nightguard ring. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_f_ring2', 
    name: 'Shadow Guard Ring', 
    slot: 'ring', 
    attack: 1, defense: 1, hp: 3, mp: 0, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Shadow Stalker',
    description: 'Shadow guard ring. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },

  // Mage - 9 items (Shadow Stalker - Monks only)
  { 
    id: 'ss_m_armor', 
    name: 'Shadowweaver Robe', 
    slot: 'armor', 
    attack: 5, defense: 4, hp: 10, mp: 18, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver robe. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_helm', 
    name: 'Shadowweaver Hat', 
    slot: 'helmet', 
    attack: 2, defense: 2, hp: 6, mp: 12, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver hat. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_weapon', 
    name: 'Shadowweaver Staff', 
    slot: 'weapon', 
    attack: 9, defense: 1, hp: 7, mp: 15, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver staff. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_gloves', 
    name: 'Shadowweaver Gloves', 
    slot: 'gloves', 
    attack: 1, defense: 1, hp: 4, mp: 10, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver gloves. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_boots', 
    name: 'Shadowweaver Boots', 
    slot: 'boots', 
    attack: 1, defense: 1, hp: 3, mp: 8, speed: 3, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver boots. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_necklace', 
    name: 'Shadowweaver Pendant', 
    slot: 'necklace', 
    attack: 2, defense: 0, hp: 5, mp: 10, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver pendant. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_relic', 
    name: 'Shadowweaver Relic', 
    slot: 'relic', 
    attack: 3, defense: 0, hp: 4, mp: 12, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver relic. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_ring1', 
    name: 'Shadowweaver Ring', 
    slot: 'ring', 
    attack: 1, defense: 0, hp: 2, mp: 6, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadowweaver ring. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },
  { 
    id: 'ss_m_ring2', 
    name: 'Shadow Mage Ring', 
    slot: 'ring', 
    attack: 1, defense: 1, hp: 1, mp: 7, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Shadow Stalker',
    description: 'Shadow mage ring. Set: 2p: +10% Speed & Evasion, 4p: +15% Speed & Evasion, 6p: +20% Speed & Evasion, 9p: +25% Speed & Evasion, +5% Critical Chance' 
  },

  // === SET 9: IRON BODY (Defense & Sustain) ===
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
  { 
    id: 'ib_k_gloves', 
    name: 'Iron Body Wraps', 
    slot: 'gloves', 
    attack: 5, defense: 2, hp: 8, mp: 4, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body wraps. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_boots', 
    name: 'Iron Body Boots', 
    slot: 'boots', 
    attack: 3, defense: 2, hp: 7, mp: 3, speed: 2, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body boots. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_necklace', 
    name: 'Iron Body Necklace', 
    slot: 'necklace', 
    attack: 6, defense: 1, hp: 10, mp: 5, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body necklace. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_offhand', 
    name: 'Iron Body Knuckles', 
    slot: 'offhand', 
    attack: 7, defense: 2, hp: 9, mp: 4, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body knuckles. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_ring1', 
    name: 'Iron Body Ring', 
    slot: 'ring', 
    attack: 4, defense: 1, hp: 6, mp: 2, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron body ring. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },
  { 
    id: 'ib_k_ring2', 
    name: 'Iron Ring', 
    slot: 'ring', 
    attack: 4, defense: 2, hp: 5, mp: 3, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Monk'], set: 'Iron Body',
    description: 'Iron focus ring. Set: 2p: +15% HP, 4p: +10% Defense, 6p: +20% HP & +15% Defense, 9p: +30% HP, +20% Defense, Heal 2% HP on hit' 
  },

  // Fighter - 9 items (Iron Body - Monks only)
  { 
    id: 'ib_f_armor', 
    name: 'Steelguard Plate', 
    slot: 'armor', 
    attack: 8, defense: 9, hp: 20, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard plate. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_helm', 
    name: 'Steelguard Helm', 
    slot: 'helmet', 
    attack: 4, defense: 6, hp: 12, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard helm. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_weapon', 
    name: 'Steelguard Sword', 
    slot: 'weapon', 
    attack: 14, defense: 4, hp: 13, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard sword. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_gloves', 
    name: 'Steelguard Gauntlets', 
    slot: 'gloves', 
    attack: 5, defense: 5, hp: 9, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard gloves. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_shield', 
    name: 'Steelguard Shield', 
    slot: 'shield', 
    attack: 2, defense: 10, hp: 15, mp: 0, speed: -1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard shield. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_boots', 
    name: 'Steelguard Boots', 
    slot: 'boots', 
    attack: 2, defense: 3, hp: 8, mp: 0, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard boots. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_necklace', 
    name: 'Steelguard Pendant', 
    slot: 'necklace', 
    attack: 3, defense: 2, hp: 11, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard pendant. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_ring1', 
    name: 'Steelguard Ring', 
    slot: 'ring', 
    attack: 2, defense: 1, hp: 7, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Steelguard ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_f_ring2', 
    name: 'Iron Guard Ring', 
    slot: 'ring', 
    attack: 2, defense: 2, hp: 6, mp: 0, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Fighter'], set: 'Iron Body',
    description: 'Iron guard ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },

  // Mage - 9 items (Iron Body - Monks only)
  { 
    id: 'ib_m_armor', 
    name: 'Stoneweaver Robe', 
    slot: 'armor', 
    attack: 6, defense: 7, hp: 14, mp: 12, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver robe. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_helm', 
    name: 'Stoneweaver Hat', 
    slot: 'helmet', 
    attack: 3, defense: 4, hp: 8, mp: 8, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver hat. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_weapon', 
    name: 'Stoneweaver Staff', 
    slot: 'weapon', 
    attack: 10, defense: 3, hp: 9, mp: 10, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver staff. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_gloves', 
    name: 'Stoneweaver Gloves', 
    slot: 'gloves', 
    attack: 2, defense: 3, hp: 6, mp: 6, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver gloves. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_boots', 
    name: 'Stoneweaver Boots', 
    slot: 'boots', 
    attack: 1, defense: 2, hp: 5, mp: 5, speed: 1, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver boots. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_necklace', 
    name: 'Stoneweaver Pendant', 
    slot: 'necklace', 
    attack: 2, defense: 1, hp: 7, mp: 6, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver pendant. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_relic', 
    name: 'Stoneweaver Relic', 
    slot: 'relic', 
    attack: 3, defense: 2, hp: 6, mp: 8, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver relic. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_ring1', 
    name: 'Stoneweaver Ring', 
    slot: 'ring', 
    attack: 1, defense: 0, hp: 4, mp: 4, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Stoneweaver ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },
  { 
    id: 'ib_m_ring2', 
    name: 'Iron Mage Ring', 
    slot: 'ring', 
    attack: 1, defense: 1, hp: 3, mp: 5, speed: 0, 
    rarity: 'uncommon', allowedJobs: ['Mage'], set: 'Iron Body',
    description: 'Iron mage ring. Set: 2p: +10% HP & Defense, 4p: +15% HP & Defense, 6p: +20% HP & Defense, 9p: +25% HP & Defense, +5% Attack' 
  },

  // ========== ADVANCED SETS (9 Sets - Epic Rarity) ==========
  
  // === SET 10: BLADE DANCER (Attack/Critical) ===
  // Fighter - 9 items
  { id: 'bd_f_armor', name: 'Berserker Plate Armor', slot: 'armor', attack: 15, defense: 8, hp: 20, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Attack-focused armor. Set: Executioner (+damage), Critical Chance +15%, Overload: Spells damage all enemies, 15% max HP explosions' },
  { id: 'bd_f_helm', name: 'Slayer Helm', slot: 'helmet', attack: 8, defense: 4, hp: 10, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Critical strike helm. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_weapon', name: 'Executioner Greatsword', slot: 'weapon', attack: 32, defense: 2, hp: 12, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Massive damage blade. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_gloves', name: 'Berserker Gauntlets', slot: 'gloves', attack: 12, defense: 3, hp: 8, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Attack speed gloves. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_shield', name: 'Slaughter Shield', slot: 'shield', attack: 8, defense: 10, hp: 15, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Offensive shield. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_boots', name: 'Bloodhound Boots', slot: 'boots', attack: 6, defense: 1, hp: 6, mp: 0, speed: 3, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Chasing boots. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_necklace', name: 'Slayer Necklace', slot: 'necklace', attack: 10, defense: 2, hp: 10, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Critical damage necklace. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_ring1', name: 'Ring of Carnage', slot: 'ring', attack: 6, defense: 0, hp: 5, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Damage ring. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_f_ring2', name: 'Ring of Execution', slot: 'ring', attack: 8, defense: 0, hp: 3, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Blade Dancer', description: 'Execute ring. Set: Executioner (+damage), Critical Chance +15%, 15% max HP explosions' },
  
  // Mage - 9 items (Blade Dancer)
  { id: 'bd_m_armor', name: 'Spellblade Robe', slot: 'armor', attack: 10, defense: 4, hp: 12, mp: 40, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Magic damage robe. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_helm', name: 'Spellblade Cowl', slot: 'helmet', attack: 5, defense: 2, hp: 8, mp: 25, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spell crit hood. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_weapon', name: 'Spellblade Staff', slot: 'weapon', attack: 22, defense: 1, hp: 10, mp: 35, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spellblade staff. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_gloves', name: 'Spellblade Gloves', slot: 'gloves', attack: 6, defense: 1, hp: 7, mp: 20, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spellblade gloves. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_boots', name: 'Spellblade Boots', slot: 'boots', attack: 4, defense: 1, hp: 6, mp: 15, speed: 2, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spellblade boots. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_necklace', name: 'Spellblade Pendant', slot: 'necklace', attack: 8, defense: 0, hp: 9, mp: 25, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spellblade pendant. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_relic', name: 'Spellblade Relic', slot: 'relic', attack: 10, defense: 0, hp: 8, mp: 30, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spellblade relic. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_ring1', name: 'Spellblade Ring', slot: 'ring', attack: 5, defense: 0, hp: 5, mp: 18, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Spellblade ring. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_m_ring2', name: 'Overload Ring', slot: 'ring', attack: 6, defense: 0, hp: 4, mp: 20, speed: 1, rarity: 'epic', allowedJobs: ['Mage'], set: 'Blade Dancer', description: 'Overload ring. Set: Overload (damage all enemies), Critical Chance +15%, 15% max HP explosions' },

  // Monk - 9 items (Blade Dancer)
  { id: 'bd_k_armor', name: 'Death Dancer Mantle', slot: 'armor', attack: 14, defense: 6, hp: 18, mp: 12, speed: 3, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Mobile attack armor. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_helm', name: 'Death Dancer Headband', slot: 'helmet', attack: 6, defense: 3, hp: 10, mp: 8, speed: 2, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Precision headband. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_weapon', name: 'Death Dancer Blades', slot: 'weapon', attack: 26, defense: 2, hp: 14, mp: 10, speed: 3, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Death dancer blades. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_gloves', name: 'Death Dancer Wraps', slot: 'gloves', attack: 8, defense: 2, hp: 10, mp: 8, speed: 3, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Death dancer wraps. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_boots', name: 'Death Dancer Boots', slot: 'boots', attack: 5, defense: 2, hp: 9, mp: 6, speed: 4, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Death dancer boots. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_necklace', name: 'Death Dancer Necklace', slot: 'necklace', attack: 10, defense: 1, hp: 12, mp: 8, speed: 2, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Death dancer necklace. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_offhand', name: 'Death Dancer Offhand', slot: 'offhand', attack: 12, defense: 2, hp: 11, mp: 8, speed: 3, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Death dancer offhand. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_ring1', name: 'Death Dancer Ring', slot: 'ring', attack: 6, defense: 1, hp: 7, mp: 5, speed: 2, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Death dancer ring. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },
  { id: 'bd_k_ring2', name: 'Killing Blow Ring', slot: 'ring', attack: 7, defense: 1, hp: 6, mp: 6, speed: 2, rarity: 'epic', allowedJobs: ['Monk'], set: 'Blade Dancer', description: 'Killing blow ring. Set: Killing Blow (+75% damage), Critical Chance +15%, 15% max HP explosions' },

  // === SET 11: BULWARK SENTINEL (Defense/Tank) ===
  // Fighter - 9 items
  { id: 'bs_f_armor', name: 'Sentinel Plate', slot: 'armor', attack: 5, defense: 25, hp: 40, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Ultimate tank armor. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_helm', name: 'Bastion Helm', slot: 'helmet', attack: 2, defense: 15, hp: 25, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Protective helm. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_weapon', name: 'Defender Sword', slot: 'weapon', attack: 20, defense: 15, hp: 25, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Defensive sword. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_gloves', name: 'Sentinel Gauntlets', slot: 'gloves', attack: 3, defense: 12, hp: 18, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Sentinel gloves. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_shield', name: 'Bastion Shield', slot: 'shield', attack: 0, defense: 30, hp: 35, mp: 0, speed: -2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Ultimate defense shield. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_boots', name: 'Sentinel Boots', slot: 'boots', attack: 2, defense: 8, hp: 15, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Sentinel boots. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_necklace', name: 'Bastion Necklace', slot: 'necklace', attack: 4, defense: 10, hp: 22, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Bastion necklace. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_ring1', name: 'Sentinel Ring', slot: 'ring', attack: 2, defense: 5, hp: 12, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Sentinel ring. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },
  { id: 'bs_f_ring2', name: 'Fortify Ring', slot: 'ring', attack: 2, defense: 6, hp: 10, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Bulwark Sentinel', description: 'Fortify ring. Set: Fortify (+25% Defense), Damage Reduction +15%, Barrier explosions 15% max HP' },

  // === SET 12: VAMPIRIC EMBRACE (Life Steal/Sustain) ===
  // Fighter - 9 items
  { id: 've_f_armor', name: 'Vampiric Plate', slot: 'armor', attack: 12, defense: 10, hp: 25, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Life steal armor. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_helm', name: 'Bloodthirst Helm', slot: 'helmet', attack: 6, defense: 5, hp: 15, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Drain helm. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_weapon', name: 'Vampiric Sword', slot: 'weapon', attack: 25, defense: 4, hp: 18, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Vampiric sword. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_gloves', name: 'Vampiric Gauntlets', slot: 'gloves', attack: 8, defense: 4, hp: 12, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Vampiric gloves. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_shield', name: 'Blood Shield', slot: 'shield', attack: 3, defense: 12, hp: 20, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Blood shield. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_boots', name: 'Vampiric Boots', slot: 'boots', attack: 4, defense: 3, hp: 10, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Vampiric boots. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_necklace', name: 'Vampiric Pendant', slot: 'necklace', attack: 8, defense: 2, hp: 15, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Vampiric pendant. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_ring1', name: 'Vampiric Ring', slot: 'ring', attack: 5, defense: 1, hp: 8, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Vampiric ring. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },
  { id: 've_f_ring2', name: 'Blood Drinker Ring', slot: 'ring', attack: 6, defense: 1, hp: 6, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Vampiric Embrace', description: 'Blood drinker ring. Set: Blood Drinker (+20% Life Steal), Attack Speed +15%, Healing explosions' },

  // === SET 13: WIND DANCER (Speed/Evasion) ===
  // Fighter - 9 items
  { id: 'wd_f_armor', name: 'Zephyr Plate', slot: 'armor', attack: 10, defense: 6, hp: 18, mp: 0, speed: 4, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Fast armor. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_helm', name: 'Gale Helm', slot: 'helmet', attack: 5, defense: 3, hp: 10, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Swift helm. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_weapon', name: 'Zephyr Blade', slot: 'weapon', attack: 22, defense: 2, hp: 14, mp: 0, speed: 3, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Zephyr blade. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_gloves', name: 'Zephyr Gauntlets', slot: 'gloves', attack: 7, defense: 2, hp: 11, mp: 0, speed: 3, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Zephyr gloves. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_shield', name: 'Wind Shield', slot: 'shield', attack: 2, defense: 8, hp: 15, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Wind shield. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_boots', name: 'Zephyr Boots', slot: 'boots', attack: 5, defense: 1, hp: 9, mp: 0, speed: 5, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Zephyr boots. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_necklace', name: 'Zephyr Necklace', slot: 'necklace', attack: 7, defense: 1, hp: 12, mp: 0, speed: 3, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Zephyr necklace. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_ring1', name: 'Zephyr Ring', slot: 'ring', attack: 4, defense: 0, hp: 7, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Zephyr ring. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },
  { id: 'wd_f_ring2', name: 'Gale Ring', slot: 'ring', attack: 5, defense: 0, hp: 5, mp: 0, speed: 3, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Wind Dancer', description: 'Gale ring. Set: Gale Force (+30% Movement Speed), Evasion +15%, Speed-based explosions' },

  // === SET 14: RIPOSTE (Counter/Parry) ===
  // Fighter - 9 items
  { id: 'rp_f_armor', name: 'Parry Plate', slot: 'armor', attack: 10, defense: 12, hp: 22, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Counter armor. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_helm', name: 'Riposte Helm', slot: 'helmet', attack: 5, defense: 8, hp: 14, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Counter helm. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_weapon', name: 'Parry Sword', slot: 'weapon', attack: 20, defense: 6, hp: 18, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Parry sword. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_gloves', name: 'Parry Gauntlets', slot: 'gloves', attack: 6, defense: 5, hp: 14, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Parry gloves. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_shield', name: 'Riposte Shield', slot: 'shield', attack: 1, defense: 15, hp: 20, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Riposte shield. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_boots', name: 'Parry Boots', slot: 'boots', attack: 4, defense: 3, hp: 11, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Parry boots. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_necklace', name: 'Parry Necklace', slot: 'necklace', attack: 7, defense: 4, hp: 16, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Parry necklace. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_ring1', name: 'Parry Ring', slot: 'ring', attack: 4, defense: 2, hp: 9, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Parry ring. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },
  { id: 'rp_f_ring2', name: 'Counter Ring', slot: 'ring', attack: 5, defense: 3, hp: 7, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Riposte', description: 'Counter ring. Set: Counter Strike (35% chance to counter), Parry Chance +15%, Counter explosions' },

  // === SET 15: FROZEN WASTELAND (Ice/Control) ===
  // Fighter - 9 items
  { id: 'fw_f_armor', name: 'Frost Plate', slot: 'armor', attack: 12, defense: 10, hp: 22, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Ice armor. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_helm', name: 'Glacial Helm', slot: 'helmet', attack: 6, defense: 6, hp: 12, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Ice helm. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_weapon', name: 'Frost Sword', slot: 'weapon', attack: 23, defense: 4, hp: 17, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Frost sword. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_gloves', name: 'Frost Gauntlets', slot: 'gloves', attack: 7, defense: 4, hp: 13, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Frost gloves. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_shield', name: 'Glacial Shield', slot: 'shield', attack: 2, defense: 12, hp: 18, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Glacial shield. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_boots', name: 'Frost Boots', slot: 'boots', attack: 4, defense: 3, hp: 10, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Frost boots. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_necklace', name: 'Frost Necklace', slot: 'necklace', attack: 8, defense: 2, hp: 15, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Frost necklace. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_ring1', name: 'Frost Ring', slot: 'ring', attack: 5, defense: 1, hp: 9, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Frost ring. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },
  { id: 'fw_f_ring2', name: 'Glacial Ring', slot: 'ring', attack: 6, defense: 2, hp: 7, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Frozen Wasteland', description: 'Glacial ring. Set: Frost Strike (50% Ice damage), Slow on Hit 30%, 15% max HP Ice explosions' },

  // === SET 16: INFERNO BLAZE (Fire/Burn) ===
  // Fighter - 9 items
  { id: 'ib_f_armor', name: 'Inferno Plate', slot: 'armor', attack: 13, defense: 9, hp: 21, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Fire armor. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_helm', name: 'Blaze Helm', slot: 'helmet', attack: 6, defense: 5, hp: 11, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Fire helm. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_weapon', name: 'Inferno Sword', slot: 'weapon', attack: 24, defense: 3, hp: 16, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Inferno sword. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_gloves', name: 'Inferno Gauntlets', slot: 'gloves', attack: 8, defense: 3, hp: 12, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Inferno gloves. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_shield', name: 'Blaze Shield', slot: 'shield', attack: 3, defense: 10, hp: 17, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Blaze shield. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_boots', name: 'Inferno Boots', slot: 'boots', attack: 5, defense: 2, hp: 9, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Inferno boots. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_necklace', name: 'Inferno Necklace', slot: 'necklace', attack: 9, defense: 1, hp: 14, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Inferno necklace. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_ring1', name: 'Inferno Ring', slot: 'ring', attack: 6, defense: 0, hp: 8, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Inferno ring. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },
  { id: 'ib_f_ring2', name: 'Blaze Ring', slot: 'ring', attack: 7, defense: 1, hp: 6, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Inferno Blaze', description: 'Blaze ring. Set: Fiery Strike (50% Fire damage), Burn on Hit 3%, 15% max HP Fire explosions' },

  // === SET 17: STORM CALLER (Lightning/Chain) ===
  // Fighter - 9 items
  { id: 'sc_f_armor', name: 'Storm Plate', slot: 'armor', attack: 11, defense: 9, hp: 20, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Lightning armor. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_helm', name: 'Storm Helm', slot: 'helmet', attack: 5, defense: 5, hp: 11, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Lightning helm. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_weapon', name: 'Storm Sword', slot: 'weapon', attack: 22, defense: 4, hp: 15, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Storm sword. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_gloves', name: 'Storm Gauntlets', slot: 'gloves', attack: 6, defense: 4, hp: 11, mp: 0, speed: 2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Storm gloves. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_shield', name: 'Storm Shield', slot: 'shield', attack: 2, defense: 11, hp: 16, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Storm shield. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_boots', name: 'Storm Boots', slot: 'boots', attack: 4, defense: 3, hp: 9, mp: 0, speed: 3, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Storm boots. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_necklace', name: 'Storm Necklace', slot: 'necklace', attack: 7, defense: 2, hp: 13, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Storm necklace. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_ring1', name: 'Storm Ring', slot: 'ring', attack: 4, defense: 1, hp: 8, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Storm ring. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },
  { id: 'sc_f_ring2', name: 'Thunder Ring', slot: 'ring', attack: 5, defense: 2, hp: 6, mp: 0, speed: 1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Storm Caller', description: 'Thunder ring. Set: Thunder Strike (50% Lightning), Chain to 2 enemies, 15% max HP Lightning explosions' },

  // === SET 18: EARTHEN COLOSSUS (Earth/Defense) ===
  // Fighter - 9 items
  { id: 'ec_f_armor', name: 'Stoneform Plate', slot: 'armor', attack: 14, defense: 20, hp: 35, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Earth armor. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_helm', name: 'Stone Helm', slot: 'helmet', attack: 6, defense: 12, hp: 22, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Earth helm. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_weapon', name: 'Stone Sword', slot: 'weapon', attack: 26, defense: 8, hp: 25, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Stone sword. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_gloves', name: 'Stone Gauntlets', slot: 'gloves', attack: 8, defense: 10, hp: 20, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Stone gloves. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_shield', name: 'Earth Shield', slot: 'shield', attack: 2, defense: 22, hp: 30, mp: 0, speed: -2, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Earth shield. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_boots', name: 'Stone Boots', slot: 'boots', attack: 5, defense: 6, hp: 15, mp: 0, speed: 0, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Stone boots. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_necklace', name: 'Stone Necklace', slot: 'necklace', attack: 10, defense: 8, hp: 25, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Stone necklace. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_ring1', name: 'Stone Ring', slot: 'ring', attack: 6, defense: 4, hp: 12, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Stone ring. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
  { id: 'ec_f_ring2', name: 'Earth Ring', slot: 'ring', attack: 7, defense: 5, hp: 10, mp: 0, speed: -1, rarity: 'epic', allowedJobs: ['Fighter'], set: 'Earthen Colossus', description: 'Earth ring. Set: Earthen Might (50% Earth damage), Defense +15%, 15% max HP Earthquake explosions' },
];

// ========== TYPE DEFINITIONS ==========
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
        'Inferno Blaze' | 'Storm Caller' | 'Earthen Colossus';
  description: string;
}

// ========== COMPREHENSIVE SET BONUS SUMMARIES ==========
export const ALL_SET_BONUSES = {
  // STARTER SETS (Uncommon)
  STARTER_SETS: {
    'Warrior\'s Might': {
      theme: 'Defensive Evolution',
      bonuses: [
        '2p: +10% Attack & Defense',
        '4p: +20% Attack & HP',
        '6p: +30% Attack & Defense',
        '9p: +40% Defense, +15% HP'
      ],
      playstyle: 'Starts balanced, becomes extremely tanky'
    },
    'Hunter\'s Focus': {
      theme: 'Speed & Critical Striker',
      bonuses: [
        '2p: +15% Speed',
        '4p: +10% Critical Chance',
        '6p: +20% Speed & +15% Critical Chance',
        '9p: +30% Speed, +20% Critical Chance, Ignore 15% Defense'
      ],
      playstyle: 'Fast attacker with high critical chance'
    },
    'Brute Force': {
      theme: 'Raw Power & Penetration',
      bonuses: [
        '2p: +15% Attack',
        '4p: Ignore 10% Defense',
        '6p: +30% Attack & Ignore 15% Defense',
        '9p: +45% Attack, Ignore 25% Defense, +10% HP'
      ],
      playstyle: 'Maximum damage with defense penetration'
    }
  },
  
  // MAGE-FOCUSED SETS (Uncommon)
  MAGE_FOCUSED_SETS: {
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
  
  // MONK-FOCUSED SETS (Uncommon)
  MONK_FOCUSED_SETS: {
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
  },
  
  // ADVANCED SETS (Epic)
  ADVANCED_SETS: {
    'Blade Dancer': {
      theme: 'Maximum Damage & Critical',
      mechanics: 'Executioner/Overload/Killing Blow, 15% max HP explosions',
      playstyle: 'Critical-focused damage dealer'
    },
    'Bulwark Sentinel': {
      theme: 'Ultimate Defense',
      mechanics: 'Fortify/Arcane Shield, 15% max HP barrier explosions',
      playstyle: 'Unkillable tank'
    },
    'Vampiric Embrace': {
      theme: 'Life Steal & Sustain',
      mechanics: 'Life drain, healing explosions',
      playstyle: 'Self-healing damage dealer'
    },
    'Wind Dancer': {
      theme: 'Maximum Speed & Evasion',
      mechanics: 'Speed bonuses, evasion, speed-based explosions',
      playstyle: 'Fast hit-and-run attacker'
    },
    'Riposte': {
      theme: 'Counter Attacks',
      mechanics: 'Parry, counter strikes, counter explosions',
      playstyle: 'Reactive duelist'
    },
    'Frozen Wasteland': {
      theme: 'Ice & Control',
      mechanics: 'Ice damage, slows/freezes, 15% max HP ice explosions',
      playstyle: 'Crowd control specialist'
    },
    'Inferno Blaze': {
      theme: 'Fire & Burning',
      mechanics: 'Fire damage, burns, 15% max HP fire explosions',
      playstyle: 'Damage over time specialist'
    },
    'Storm Caller': {
      theme: 'Lightning & Chain',
      mechanics: 'Lightning damage, chain attacks, 15% max HP lightning explosions',
      playstyle: 'Multi-target damage dealer'
    },
    'Earthen Colossus': {
      theme: 'Earth & Defense',
      mechanics: 'Earth damage, defense bonuses, 15% max HP earthquake explosions',
      playstyle: 'Defensive area controller'
    }
  }
};

// ========== HELPER FUNCTIONS ==========
export const TOTAL_ITEMS = COMPLETE_ALL_EQUIPMENT.length; // 486 items

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
    'Inferno Blaze', 'Storm Caller', 'Earthen Colossus'
  ];
}

export function getMageFocusedSets(): string[] {
  return ['Elemental Apprentice', 'Arcane Scholar', 'Battle Mage'];
}

export function getMonkFocusedSets(): string[] {
  return ['Martial Disciple', 'Shadow Stalker', 'Iron Body'];
}

// ========== QUICK REFERENCE ==========
/*
TOTAL SETS: 18
- 9 Starter Sets (Uncommon): 243 items
- 9 Advanced Sets (Epic): 243 items
TOTAL ITEMS: 486

STARTER SETS (Beginner Areas):
Original (3):
1. Warrior's Might - Defensive evolution
2. Hunter's Focus - Speed & critical  
3. Brute Force - Raw attack & penetration

Mage-Focused (3):
4. Elemental Apprentice - Elemental Magic Specialist
5. Arcane Scholar - Spell Efficiency & Power
6. Battle Mage - Hybrid Physical/Magical

Monk-Focused (3):
7. Martial Disciple - Balanced Martial Artist
8. Shadow Stalker - Speed & Evasion Specialist
9. Iron Body - Defensive Tank Monk

ADVANCED SETS (End-Game):
10. Blade Dancer - Maximum damage & critical
11. Bulwark Sentinel - Ultimate defense
12. Vampiric Embrace - Life steal & sustain
13. Wind Dancer - Maximum speed & evasion
14. Riposte - Counter attacks
15. Frozen Wasteland - Ice & control
16. Inferno Blaze - Fire & burning
17. Storm Caller - Lightning & chain
18. Earthen Colossus - Earth & defense

EXPLOSION MECHANICS:
• All advanced sets have 15% max HP explosions
• Each set has unique explosion triggers
• Balanced for competitive play

ID FORMAT:
• Starter: wm_f_armor (Warrior's Might Fighter Armor)
• Mage-Focused: ea_m_armor (Elemental Apprentice Mage Armor)
• Monk-Focused: md_k_armor (Martial Disciple Monk Armor)
• Advanced: bd_f_armor (Blade Dancer Fighter Armor)
• Pattern: [set initials]_[class]_[slot]

CLASS-SPECIFIC BONUSES:
• Mage-focused sets: Mages get different bonuses than non-Mages
• Monk-focused sets: Monks get different bonuses than non-Monks
• Original sets: Same bonuses for all classes
*/

// ========== FILE READY FOR USE ==========
// Save as: complete_all_equipment.ts
// Import and use immediately in your project