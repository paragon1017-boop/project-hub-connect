return (
  <div 
    ref={gameContainerRef}
    tabIndex={-1}
    className={`${isCombatFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen p-4 md:p-8'} flex items-center justify-center relative overflow-hidden outline-none bg-black transition-all duration-300`}>
    
    {/* Stone wall background with grayscale filter */}
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url(${dungeonWallBg})`,
        backgroundSize: '400px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        filter: 'grayscale(100%) brightness(0.35) contrast(1.1)',
        transform: isCombatFullscreen ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 300ms ease-out'
      }} 
    />
    
    {/* Vignette effect - stronger during combat */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: isCombatFullscreen 
        ? 'radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.9) 100%)'
        : 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
      transition: 'background 300ms ease-out'
    }} />
    
    {/* Enhanced torch glow during combat */}
    <div className="absolute top-0 left-0 w-64 h-80 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at top left, rgba(255,150,50,0.3) 0%, transparent 60%)',
      opacity: isCombatFullscreen ? 0.8 : 0.2,
      transition: 'opacity 300ms ease-out'
    }} />
    <div className="absolute top-0 right-0 w-64 h-80 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at top right, rgba(255,150,50,0.3) 0%, transparent 60%)',
      opacity: isCombatFullscreen ? 0.8 : 0.2,
      transition: 'opacity 300ms ease-out'
    }} />
    
    {/* Combat exit button (only shown during combat fullscreen) */}
    {isCombatFullscreen && (
      <button
        onClick={() => {
          if (combatState.active) {
            log("You fled from battle!");
            setCombatState({ active: false, monsters: [], targetIndex: 0, turn: 0, currentCharIndex: 0, turnOrder: [], turnOrderPosition: 0, defending: false });
            setIsCombatFullscreen(false);
          }
        }}
        className="absolute top-4 right-4 z-50 bg-red-600/80 hover:bg-red-700 text-white font-pixel text-sm px-4 py-2 rounded-lg border border-red-800 shadow-lg hover:shadow-red-900/50 transition-all"
        data-testid="button-exit-combat"
      >
        FLEE BATTLE (ESC)
      </button>
    )}
    
    {/* Escape key to exit combat */}
    useKey('Escape', () => {
      if (isCombatFullscreen && combatState.active) {
        log("You fled from battle!");
        setCombatState({ active: false, monsters: [], targetIndex: 0, turn: 0, currentCharIndex: 0, turnOrder: [], turnOrderPosition: 0, defending: false });
        setIsCombatFullscreen(false);
      }
    }, {}, [isCombatFullscreen, combatState.active]);

    <div className={`${isCombatFullscreen ? 'w-full h-full p-0' : 'max-w-5xl w-full'} relative z-10 space-y-4 transition-all duration-300`}>
      <div className={`${isCombatFullscreen ? 'h-full grid grid-cols-1 lg:grid-cols-12 gap-0' : 'grid grid-cols-1 lg:grid-cols-12 gap-4'}`}>
        
        {/* LEFT COLUMN: Hide during combat fullscreen */}
        {!isCombatFullscreen && (
          <div className="lg:col-span-2 space-y-2 order-2 lg:order-1">
            {/* ... keep your existing left column code ... */}
          </div>
        )}
        
        {/* CENTER COLUMN: Full width during combat */}
        <div className={`${isCombatFullscreen ? 'lg:col-span-12 h-full' : 'lg:col-span-8 order-1 lg:order-2'}`}>
          {/* Settings button - hide during combat */}
          {!isCombatFullscreen && (
            <div className="flex justify-end mb-2">
              {/* ... keep your settings button code ... */}
            </div>
          )}
          
          <RetroCard className={`${isCombatFullscreen ? 'h-full rounded-none border-0 bg-transparent' : 'p-1'}`}>
            <div className={`${isCombatFullscreen ? 'h-full relative' : 'relative aspect-[4/3] w-full'} bg-black overflow-hidden ${isCombatFullscreen ? 'rounded-none' : 'rounded-lg'}`}>
              {/* Always show dungeon view as background, but hide during combat */}
              {!isCombatFullscreen && (
                <DungeonView 
                  gameData={game} 
                  className="w-full h-full" 
                  renderWidth={RESOLUTION_PRESETS[graphicsQuality].width}
                  renderHeight={RESOLUTION_PRESETS[graphicsQuality].height}
                />
              )}
              
              {/* Mini Map - hide during combat */}
              {showMiniMap && !isCombatFullscreen && (
                // ... keep your mini map code ...
              )}
              
              {/* Monster overlay during combat - UPDATED FOR FULLSCREEN */}
              {combatState.active && combatState.monsters.length > 0 && (
                <>
                  {/* Darker combat overlay for fullscreen */}
                  <div 
                    className="absolute inset-0 z-[5] pointer-events-none animate-in fade-in duration-500"
                    style={{
                      background: isCombatFullscreen 
                        ? 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(100,0,0,0.2) 0%, rgba(50,0,0,0.5) 30%, rgba(0,0,0,0.9) 80%)'
                        : 'radial-gradient(ellipse 60% 50% at 50% 45%, transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)'
                    }}
                  />
                  
                  {/* Pulsing combat border effect */}
                  {isCombatFullscreen && (
                    <div className="absolute inset-0 z-[6] pointer-events-none border-[4px] border-red-500/30 animate-pulse rounded-none" />
                  )}
                  
                  {/* Enhanced monster positioning with front/back rows - UPDATED FOR FULLSCREEN */}
                  <div className={`absolute inset-0 z-10 flex items-end justify-center pointer-events-none ${
                    isCombatFullscreen ? 'pb-32' : 'pb-24'
                  }`}>
                    <div className={`relative w-full ${
                      isCombatFullscreen ? 'max-w-6xl h-[500px]' : 'max-w-4xl h-[400px]'
                    }`}>
                      {/* Back Row (positions 4-7) */}
                      <div className={`absolute ${
                        isCombatFullscreen ? 'bottom-[80px]' : 'bottom-[60px]'
                      } left-0 right-0 flex items-end justify-center gap-4`}>
                        {combatState.monsters.slice(4, 8).map((monster, idx) => {
                          const actualIdx = idx + 4;
                          return (
                            <div 
                              key={monster.id} 
                              className={`relative cursor-pointer transition-all duration-200 ${
                                monster.hp <= 0 ? 'opacity-30 grayscale' : ''
                              } ${actualIdx === combatState.targetIndex && monster.hp > 0 ? 'scale-110 z-20' : 'scale-90 z-10'}`}
                              onClick={() => monster.hp > 0 && setCombatState(prev => ({ ...prev, targetIndex: actualIdx }))}
                              style={{ 
                                pointerEvents: 'auto',
                                transform: `translateY(${monster.hp <= 0 ? '20px' : '0'})`,
                                filter: monster.hp <= 0 ? 'brightness(0.5)' : 'none'
                              }}
                            >
                              {/* Target indicator for back row */}
                              {actualIdx === combatState.targetIndex && monster.hp > 0 && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce z-30">
                                  <ChevronDown className="w-5 h-5" />
                                </div>
                              )}
                              
                              {monster.image ? (
                                <>
                                  <TransparentMonster 
                                    src={monster.image} 
                                    alt={monster.name} 
                                    className={`object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] ${
                                      isCombatFullscreen 
                                        ? combatState.monsters.length <= 4 ? 'w-64 h-64' :
                                          combatState.monsters.length <= 6 ? 'w-48 h-48' : 'w-40 h-40'
                                        : combatState.monsters.length <= 4 ? 'w-52 h-52' :
                                          combatState.monsters.length <= 6 ? 'w-40 h-40' : 'w-32 h-32'
                                    }`}
                                    animationState={monsterAnimations[actualIdx] || 'idle'}
                                    isFlying={isFlying(monster.name)}
                                  />
                                  {/* Lighter ground shadow for back row */}
                                  <div 
                                    className={`absolute bottom-0 left-1/2 rounded-[50%] bg-black/40 blur-md ${
                                      isCombatFullscreen 
                                        ? combatState.monsters.length <= 4 ? 'w-48 h-6' :
                                          combatState.monsters.length <= 6 ? 'w-36 h-5' : 'w-28 h-4'
                                        : combatState.monsters.length <= 4 ? 'w-40 h-6' :
                                          combatState.monsters.length <= 6 ? 'w-32 h-5' : 'w-24 h-4'
                                    }`}
                                    style={{ transform: 'translateX(-50%) translateY(10px)' }}
                                  />
                                </>
                              ) : (
                                <Skull className={`text-red-500 drop-shadow-lg ${
                                  isCombatFullscreen 
                                    ? combatState.monsters.length <= 4 ? 'w-40 h-40' :
                                      combatState.monsters.length <= 6 ? 'w-32 h-32' : 'w-24 h-24'
                                    : combatState.monsters.length <= 4 ? 'w-32 h-32' :
                                      combatState.monsters.length <= 6 ? 'w-24 h-24' : 'w-20 h-20'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Front Row (positions 0-3) */}
                      <div className={`absolute ${
                        isCombatFullscreen ? 'bottom-[30px]' : 'bottom-[20px]'
                      } left-0 right-0 flex items-end justify-center gap-6`}>
                        {combatState.monsters.slice(0, 4).map((monster, idx) => (
                          <div 
                            key={monster.id} 
                            className={`relative cursor-pointer transition-all duration-200 ${
                              monster.hp <= 0 ? 'opacity-40 grayscale' : ''
                            } ${idx === combatState.targetIndex && monster.hp > 0 ? 'scale-115 z-30' : 'scale-100 z-20'}`}
                            onClick={() => monster.hp > 0 && setCombatState(prev => ({ ...prev, targetIndex: idx }))}
                            style={{ 
                              pointerEvents: 'auto',
                              transform: `translateY(${monster.hp <= 0 ? '10px' : '0'})`,
                              filter: monster.hp <= 0 ? 'brightness(0.6)' : 'none'
                            }}
                          >
                            {/* Target indicator for front row */}
                            {idx === combatState.targetIndex && monster.hp > 0 && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce z-40">
                                <ChevronDown className="w-6 h-6" />
                              </div>
                            )}
                            
                            {monster.image ? (
                              <>
                                <TransparentMonster 
                                  src={monster.image} 
                                  alt={monster.name} 
                                  className={`object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.9)] ${
                                    isCombatFullscreen
                                      ? combatState.monsters.length <= 2 ? 'w-96 h-96' :
                                        combatState.monsters.length === 3 ? 'w-80 h-80' :
                                        combatState.monsters.length <= 6 ? 'w-64 h-64' : 'w-56 h-56'
                                      : combatState.monsters.length <= 2 ? 'w-72 h-72' :
                                        combatState.monsters.length === 3 ? 'w-60 h-60' :
                                        combatState.monsters.length <= 6 ? 'w-48 h-48' : 'w-40 h-40'
                                  }`}
                                  animationState={monsterAnimations[idx] || 'idle'}
                                  isFlying={isFlying(monster.name)}
                                />
                                {/* Darker ground shadow for front row */}
                                <div 
                                  className={`absolute bottom-0 left-1/2 rounded-[50%] bg-black/60 blur-md ${
                                    isCombatFullscreen
                                      ? combatState.monsters.length <= 2 ? 'w-72 h-8' :
                                        combatState.monsters.length === 3 ? 'w-56 h-7' :
                                        combatState.monsters.length <= 6 ? 'w-48 h-6' : 'w-40 h-5'
                                      : combatState.monsters.length <= 2 ? 'w-56 h-8' :
                                        combatState.monsters.length === 3 ? 'w-44 h-7' :
                                        combatState.monsters.length <= 6 ? 'w-36 h-6' : 'w-32 h-5'
                                  }`}
                                  style={{ transform: 'translateX(-50%) translateY(12px)' }}
                                />
                              </>
                            ) : (
                              <Skull className={`text-red-500 drop-shadow-lg ${
                                isCombatFullscreen
                                  ? combatState.monsters.length <= 2 ? 'w-56 h-56' :
                                    combatState.monsters.length === 3 ? 'w-48 h-48' :
                                    combatState.monsters.length <= 6 ? 'w-36 h-36' : 'w-32 h-32'
                                  : combatState.monsters.length <= 2 ? 'w-40 h-40' :
                                    combatState.monsters.length === 3 ? 'w-32 h-32' :
                                    combatState.monsters.length <= 6 ? 'w-28 h-28' : 'w-24 h-24'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Row indicators */}
                      {combatState.monsters.length > 4 && isCombatFullscreen && (
                        <>
                          <div className="absolute bottom-[180px] left-1/2 -translate-x-1/2 text-xs text-gray-400/60 font-pixel tracking-wider opacity-70">
                            BACK ROW
                          </div>
                          <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 text-xs text-gray-400/60 font-pixel tracking-wider opacity-70">
                            FRONT ROW
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Combat UI overlay at bottom - UPDATED FOR FULLSCREEN */}
                  <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/75 to-transparent ${
                    isCombatFullscreen ? 'p-6 pt-10' : 'p-4 pt-8'
                  }`}>
                    <div className="space-y-4">
                      {/* All Monsters HP bars - Grid layout */}
                      <div className={`grid ${
                        combatState.monsters.length <= 4 ? 'grid-cols-4' :
                        combatState.monsters.length <= 8 ? 'grid-cols-4' : 'grid-cols-5'
                      } gap-3 ${isCombatFullscreen ? 'max-h-32' : 'max-h-24'} overflow-y-auto pr-2`}>
                        {combatState.monsters.map((monster, idx) => (
                          <div 
                            key={monster.id} 
                            className={`p-2 rounded-lg border cursor-pointer transition-all ${
                              idx === combatState.targetIndex ? 'border-yellow-400 bg-yellow-400/15 shadow-lg shadow-yellow-900/30' : 'border-primary/40 bg-black/50'
                            } ${monster.hp <= 0 ? 'opacity-50' : ''} ${
                              idx < 4 ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-blue-500'
                            }`}
                            onClick={() => monster.hp > 0 && setCombatState(prev => ({ ...prev, targetIndex: idx }))}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${idx < 4 ? 'bg-amber-400' : 'bg-blue-400'}`} />
                              <h2 className="font-pixel text-destructive text-sm truncate flex-1">
                                {monster.name}
                                {idx < 4 && <span className="ml-1 text-[10px] text-amber-400">(Front)</span>}
                                {idx >= 4 && <span className="ml-1 text-[10px] text-blue-400">(Back)</span>}
                              </h2>
                            </div>
                            <StatBar 
                              label="HP" 
                              current={Math.max(0, monster.hp)} 
                              max={monster.maxHp} 
                              color={monster.color} 
                              showNumbers={true}
                              size={isCombatFullscreen ? 'md' : 'sm'}
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Current Character Turn - Enhanced for fullscreen */}
                      {game.party[combatState.currentCharIndex] && game.party[combatState.currentCharIndex].hp > 0 && (
                        <div className="bg-gradient-to-r from-black/70 to-black/40 p-4 rounded-xl border border-primary/50 shadow-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-12 bg-primary/60 rounded-full animate-pulse" />
                              <div>
                                <span className="font-pixel text-lg text-primary block">
                                  {game.party[combatState.currentCharIndex].name}'s Turn
                                </span>
                                {combatState.monsters.length > 0 && combatState.monsters[combatState.targetIndex] && (
                                  <span className="font-retro text-sm text-yellow-300 block">
                                    Targeting: <span className="text-yellow-400 font-bold">{combatState.monsters[combatState.targetIndex].name}</span>
                                    {combatState.targetIndex < 4 ? ' (Front Row)' : ' (Back Row)'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-retro text-sm text-blue-400">
                                MP: {game.party[combatState.currentCharIndex].mp}/{getEffectiveStats(game.party[combatState.currentCharIndex]).maxMp}
                              </div>
                              <div className="text-xs text-green-400 mt-1">
                                HP: {game.party[combatState.currentCharIndex].hp}/{getEffectiveStats(game.party[combatState.currentCharIndex]).maxHp}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {getAbilitiesForJob(game.party[combatState.currentCharIndex].job).map((ability) => (
                              <RetroButton 
                                key={ability.id}
                                onClick={() => useAbility(ability, combatState.currentCharIndex)} 
                                className={`px-4 py-2 ${isCombatFullscreen ? 'text-sm' : 'text-xs'}`}
                                disabled={ability.mpCost > game.party[combatState.currentCharIndex].mp}
                                data-testid={`button-${ability.id}`}
                                variant={ability.type === 'attack' ? 'default' : ability.type === 'heal' ? 'success' : 'ghost'}
                              >
                                <span className="font-bold">{ability.name}</span>
                                {ability.mpCost > 0 && <span className="ml-2 text-blue-300 font-mono">({ability.mpCost} MP)</span>}
                              </RetroButton>
                            ))}
                            <RetroButton 
                              onClick={handleRun} 
                              variant="danger" 
                              className={`px-4 py-2 ${isCombatFullscreen ? 'text-sm' : 'text-xs'}`} 
                              data-testid="button-run"
                            >
                              FLEE BATTLE
                            </RetroButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Message Log - Different styling for combat */}
            {!isCombatFullscreen ? (
              <div className="h-32 bg-gradient-to-t from-black/90 to-black/60 border-t border-white/10 p-4 text-base overflow-hidden flex flex-col justify-end">
                {logs.map((msg, i) => (
                  <div key={i} className={`transition-opacity ${i === 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`} style={{ opacity: 1 - i * 0.2 }}>
                    {i === 0 ? '▸ ' : '  '}{msg}
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute top-4 left-4 right-4 z-30">
                <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 max-w-md">
                  <div className="text-xs text-amber-400 font-pixel mb-1 tracking-wider">BATTLE LOG</div>
                  <div className="h-24 overflow-y-auto pr-2">
                    {logs.slice(0, 6).map((msg, i) => (
                      <div key={i} className={`text-sm mb-1 ${i === 0 ? 'text-white font-medium' : 'text-gray-300'}`}>
                        {i === 0 ? '⚔️ ' : '  '}{msg}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Movement Controls - Hide during combat */}
            {!isCombatFullscreen && (
              <div className="bg-black/40 backdrop-blur-sm p-4 border-t border-white/10 flex justify-center gap-8 items-center">
                {/* ... keep your movement controls code ... */}
              </div>
            )}
          </RetroCard>
        </div>

        {/* RIGHT COLUMN: Hide during combat fullscreen */}
        {!isCombatFullscreen && (
          <div className="lg:col-span-2 order-3">
            {/* ... keep your right column code ... */}
          </div>
        )}
      </div>
    </div>
  </div>
);