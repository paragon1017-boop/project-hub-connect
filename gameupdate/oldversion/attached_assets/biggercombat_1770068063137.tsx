// Add this state variable near other states (around line 60):
const [isCombatFullscreen, setIsCombatFullscreen] = useState(false);

// Update the combatState setter to enable fullscreen:
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
setIsCombatFullscreen(true); // ADD THIS LINE

// Update combat end to disable fullscreen (in handleRun and victory condition):
setCombatState({ active: false, monsters: [], targetIndex: 0, turn: 0, currentCharIndex: 0, turnOrder: [], turnOrderPosition: 0, defending: false });
setIsCombatFullscreen(false); // ADD THIS LINE