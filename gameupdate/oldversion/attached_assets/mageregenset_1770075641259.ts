export const MANA_WELLSPRING_BONUSES = {
  // MAGE VERSION (Primary)
  mageBonuses: {
    theme: 'Pure Mana Sustain',
    bonuses: [
      '2p: +20% Maximum MP',
      '4p: +5 MP Regen per turn',
      '6p: +35% Maximum MP',
      '9p: +50% Maximum MP, +10 MP Regen per turn'
    ],
    examples: [
      'Base: 100 MP → 9p: 150 MP (+50 MP)',
      'Regen: 0 → 9p: 10 MP per turn',
      'Every 3 turns: Regain 30 MP (30% of base)',
      'Every 5 turns: Regain 50 MP (half a mana bar)'
    ],
    playstyle: 'Spam spells forever',
    bestFor: 'Pure casters who never want to stop casting'
  },
  
  // NON-MAGE VERSION (Hybrid)
  nonMageBonuses: {
    theme: 'Hybrid Mana & Attack',
    bonuses: [
      '2p: +15% MP & Attack',
      '4p: +3 MP Regen per turn',
      '6p: +25% MP & Attack',
      '9p: +35% MP, +5 MP Regen/turn, +15% Attack'
    ],
    examples: [
      'For Fighter/Monk with mana skills',
      'Balances damage with sustain',
      'Enables hybrid playstyles',
      'Good for characters with occasional spells'
    ],
    playstyle: 'Hybrid fighter with mana sustain',
    bestFor: 'Warrior Mages, Paladins, Spellblades'
  }
};