// Memoize expensive calculations in your Game component:
const effectivePartyStats = useMemo(() => 
  game ? game.party.map(char => getEffectiveStats(char)) : []
, [game]);

const xpForNextLevel = useMemo(() => 
  game ? game.party.map(char => xpForLevel(char.level + 1)) : []
, [game]);

// Use these memoized values in your render instead of recalculating