// Add near the top of your component (after state declarations):
const [keyRepeat, setKeyRepeat] = useState<{key: string, timestamp: number} | null>(null);

// Add this effect for smooth key repeats:
useEffect(() => {
  if (!keyRepeat || !game || combatState.active) return;
  
  const now = Date.now();
  const delay = now - keyRepeat.timestamp > 300 ? 50 : 100; // Initial delay 300ms, then 50ms
  
  const timer = setTimeout(() => {
    switch (keyRepeat.key) {
      case 'ArrowUp':
      case 'w':
        if (game.dir === NORTH) move(0, -1);
        if (game.dir === SOUTH) move(0, 1);
        if (game.dir === EAST) move(1, 0);
        if (game.dir === WEST) move(-1, 0);
        break;
      case 'ArrowDown':
      case 's':
        if (game.dir === NORTH) move(0, 1);
        if (game.dir === SOUTH) move(0, -1);
        if (game.dir === EAST) move(-1, 0);
        if (game.dir === WEST) move(1, 0);
        break;
      case 'ArrowLeft':
      case 'a':
        rotate('left');
        break;
      case 'ArrowRight':
      case 'd':
        rotate('right');
        break;
    }
    setKeyRepeat({ key: keyRepeat.key, timestamp: now });
  }, delay);
  
  return () => clearTimeout(timer);
}, [keyRepeat, game, combatState.active, move, rotate]);

// Update your key handlers to use the repeat system:
useKey('ArrowUp', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'ArrowUp', timestamp: Date.now() });
  if (game.dir === NORTH) move(0, -1);
  if (game.dir === SOUTH) move(0, 1);
  if (game.dir === EAST) move(1, 0);
  if (game.dir === WEST) move(-1, 0);
}, {}, [game]);

useKey('ArrowDown', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'ArrowDown', timestamp: Date.now() });
  if (game.dir === NORTH) move(0, 1);
  if (game.dir === SOUTH) move(0, -1);
  if (game.dir === EAST) move(-1, 0);
  if (game.dir === WEST) move(1, 0);
}, {}, [game]);

useKey('ArrowLeft', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'ArrowLeft', timestamp: Date.now() });
  rotate('left');
}, {}, [game]);

useKey('ArrowRight', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'ArrowRight', timestamp: Date.now() });
  rotate('right');
}, {}, [game]);

// Same for WASD keys
useKey('w', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'w', timestamp: Date.now() });
  if (game.dir === NORTH) move(0, -1);
  if (game.dir === SOUTH) move(0, 1);
  if (game.dir === EAST) move(1, 0);
  if (game.dir === WEST) move(-1, 0);
}, {}, [game]);

useKey('s', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 's', timestamp: Date.now() });
  if (game.dir === NORTH) move(0, 1);
  if (game.dir === SOUTH) move(0, -1);
  if (game.dir === EAST) move(-1, 0);
  if (game.dir === WEST) move(1, 0);
}, {}, [game]);

useKey('a', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'a', timestamp: Date.now() });
  rotate('left');
}, {}, [game]);

useKey('d', () => {
  if (!game || combatState.active) return;
  setKeyRepeat({ key: 'd', timestamp: Date.now() });
  rotate('right');
}, {}, [game]);

// Clear key repeat on key up
useKeyUp('ArrowUp', () => setKeyRepeat(null), {}, []);
useKeyUp('ArrowDown', () => setKeyRepeat(null), {}, []);
useKeyUp('ArrowLeft', () => setKeyRepeat(null), {}, []);
useKeyUp('ArrowRight', () => setKeyRepeat(null), {}, []);
useKeyUp('w', () => setKeyRepeat(null), {}, []);
useKeyUp('s', () => setKeyRepeat(null), {}, []);
useKeyUp('a', () => setKeyRepeat(null), {}, []);
useKeyUp('d', () => setKeyRepeat(null), {}, []);