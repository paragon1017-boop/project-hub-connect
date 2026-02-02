// Replace your current move function (~line 85) with this optimized version:
const move = useCallback((dx: number, dy: number) => {
  if (!game || combatState.active) return;
  
  const nx = game.x + dx;
  const ny = game.y + dy;

  // Check bounds
  if (ny < 0 || ny >= game.map.length || nx < 0 || nx >= game.map[0].length) {
    log("Blocked.");
    return;
  }

  const tile = game.map[ny][nx];
  // Wall/door collision (1 = wall, 2 = door) - can walk on floor, ladder down, ladder up
  if (tile === TILE_WALL || tile === TILE_DOOR) {
    log("Blocked.");
    return;
  }

  // IMMEDIATE state update (no batching delay)
  setGame(prev => {
    if (!prev) return null;
    const newGame = { ...prev, x: nx, y: ny };
    
    // Check for ladder tiles and show prompt
    if (tile === TILE_LADDER_DOWN) {
      setTimeout(() => log("A ladder leading deeper! Press SPACE to descend."), 10);
    } else if (tile === TILE_LADDER_UP && prev.level > 1) {
      setTimeout(() => log("A ladder leading up! Press SPACE to climb."), 10);
    }

    // Random Encounter Chance (10%) - not on ladder tiles
    if (tile === TILE_FLOOR && Math.random() < 0.1) {
      // Spawn 1-4 monsters base, more on deeper floors
      const baseCount = 1 + Math.floor(Math.random() * 3); // 1-4
      const bonusMonsters = Math.floor(newGame.level / 3); // Slower progression
      const monsterCount = Math.min(8, baseCount + (Math.random() < 0.25 ? bonusMonsters : 0));
      const monsters: Monster[] = [];
      for (let i = 0; i < monsterCount; i++) {
        monsters.push(getRandomMonster(newGame.level));
      }
      
      // Calculate turn order based on speed (highest speed goes first)
      const partyWithSpeed = newGame.party
        .map((char, idx) => ({ idx, speed: char.hp > 0 ? getEffectiveStats(char).speed : -1 }))
        .filter(c => c.speed >= 0)
        .sort((a, b) => b.speed - a.speed);
      const turnOrder = partyWithSpeed.map(c => c.idx);
      const firstCharIdx = turnOrder.length > 0 ? turnOrder[0] : 0;
      
      setTimeout(() => {
        setCombatState({ 
          active: true, 
          monsters, 
          targetIndex: 0, 
          turn: 0, 
          currentCharIndex: firstCharIdx,
          turnOrder,
          turnOrderPosition: 0,
          defending: false 
        });
        setIsCombatFullscreen(true);
        
        // Trigger entrance animation for all monsters
        monsters.forEach((_, idx) => {
          setTimeout(() => {
            triggerMonsterAnimation(idx, 'entrance', 800);
          }, idx * 100);
        });
        
        if (monsterCount === 1) {
          log(`A wild ${monsters[0].name} appeared!`);
        } else {
          log(`${monsterCount} monsters appeared!`);
        }
      }, 50); // Small delay to ensure state is updated
    }
    
    return newGame;
  });

}, [game, combatState.active, log]);