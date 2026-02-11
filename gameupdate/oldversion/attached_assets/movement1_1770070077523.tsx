// Add this debounce ref at the top of your component:
const lastMoveTime = useRef<number>(0);

// Update the beginning of your move function:
const move = useCallback((dx: number, dy: number) => {
  const now = Date.now();
  if (now - lastMoveTime.current < 50) return; // 50ms debounce (20 moves/sec)
  lastMoveTime.current = now;
  
  // ... rest of your move logic
}, [game, combatState.active, log]);