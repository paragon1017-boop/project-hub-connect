import { useState } from "react";
import { ChevronRight, Swords, Shield, DoorOpen, Zap, Skull, Wand2, Hand } from "lucide-react";
import type { GameData, Monster, Player, Ability } from "@/lib/game-engine";

interface EffectiveStats {
  attack: number;
  defense: number;
  maxHp: number;
  maxMp: number;
  speed: number;
}

interface BattleViewProps {
  game: GameData;
  combatState: {
    active: boolean;
    monsters: Monster[];
    currentCharIndex: number;
    targetIndex: number;
  };
  onTargetSelect: (index: number) => void;
  onAbilityUse: (ability: Ability, charIndex: number) => void;
  onFlee: () => void;
  getAbilitiesForJob: (job: string) => Ability[];
  getEffectiveStats: (char: Player) => EffectiveStats;
  monsterAnimations: Record<number, string>;
  logs: string[];
}

const JOB_COLORS: Record<string, string> = {
  fighter: "#ef4444",
  mage: "#3b82f6",
  monk: "#22c55e"
};

function JobIcon({ job, className }: { job: string; className?: string }) {
  const normalizedJob = job.toLowerCase();
  switch (normalizedJob) {
    case 'fighter':
      return <Swords className={className} />;
    case 'mage':
      return <Wand2 className={className} />;
    case 'monk':
      return <Hand className={className} />;
    default:
      return <Swords className={className} />;
  }
}

function TransparentMonster({ 
  src, 
  alt, 
  className,
  animationState = 'idle',
  isFlying = false
}: { 
  src: string; 
  alt: string; 
  className?: string;
  animationState?: 'idle' | 'attacking' | 'hit';
  isFlying?: boolean;
}) {
  const getAnimationStyle = () => {
    switch (animationState) {
      case 'attacking':
        return { transform: 'translateX(30px) scale(1.1)', filter: 'brightness(1.3)' };
      case 'hit':
        return { transform: 'translateX(-10px)', filter: 'brightness(1.5) hue-rotate(30deg)' };
      default:
        return {};
    }
  };

  return (
    <div 
      className={`relative transition-all duration-200 ${isFlying ? 'animate-float' : ''}`}
      style={getAnimationStyle()}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`${className} object-contain`}
        style={{ 
          filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))',
          imageRendering: 'auto'
        }}
      />
    </div>
  );
}

function isFlying(name: string): boolean {
  const flyingTypes = ['bat', 'bird', 'dragon', 'fairy', 'ghost', 'spirit', 'wisp', 'eye', 'floating'];
  return flyingTypes.some(type => name.toLowerCase().includes(type));
}

export function BattleView({
  game,
  combatState,
  onTargetSelect,
  onAbilityUse,
  onFlee,
  getAbilitiesForJob,
  getEffectiveStats,
  monsterAnimations,
  logs
}: BattleViewProps) {
  const [menuMode, setMenuMode] = useState<'main' | 'fight' | 'tactics'>('main');
  
  const currentChar = game.party[combatState.currentCharIndex];
  const aliveParty = game.party.filter(c => c.hp > 0);
  
  const floorThemes = [
    { bg: 'from-green-900 via-green-800 to-emerald-900', ground: 'bg-gradient-to-b from-green-700 to-green-900' },
    { bg: 'from-amber-900 via-orange-800 to-red-900', ground: 'bg-gradient-to-b from-amber-700 to-amber-900' },
    { bg: 'from-slate-800 via-slate-700 to-gray-900', ground: 'bg-gradient-to-b from-slate-600 to-slate-800' },
    { bg: 'from-purple-900 via-violet-800 to-indigo-900', ground: 'bg-gradient-to-b from-purple-700 to-purple-900' },
    { bg: 'from-cyan-900 via-teal-800 to-blue-900', ground: 'bg-gradient-to-b from-cyan-700 to-cyan-900' },
  ];
  
  const theme = floorThemes[Math.min(game.level - 1, floorThemes.length - 1)] || floorThemes[0];

  return (
    <div className="relative w-full h-full overflow-hidden" data-testid="battle-view">
      {/* Sky/Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bg}`} />
      
      {/* Distant mountains/hills silhouette */}
      <div className="absolute bottom-[40%] left-0 right-0 h-32">
        <svg viewBox="0 0 1200 200" className="w-full h-full opacity-30" preserveAspectRatio="none">
          <path d="M0,200 L0,120 Q150,60 300,100 T600,80 T900,110 T1200,90 L1200,200 Z" fill="currentColor" className="text-black/40" />
          <path d="M0,200 L0,140 Q200,100 400,130 T800,100 T1200,120 L1200,200 Z" fill="currentColor" className="text-black/30" />
        </svg>
      </div>
      
      {/* Ground/grass area */}
      <div className={`absolute bottom-0 left-0 right-0 h-[45%] ${theme.ground}`}>
        {/* Ground texture lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute left-0 right-0 h-px bg-black/30"
              style={{ top: `${(i + 1) * 12}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Battle Speed indicator (top) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/60 px-4 py-1.5 rounded-lg border border-white/20" data-testid="panel-battle-speed">
        <span className="text-white/80 text-sm font-medium">Battle</span>
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 text-sm font-bold" data-testid="text-battle-speed">Normal</span>
      </div>
      
      {/* Monster(s) in center-left area */}
      <div className="absolute left-[15%] top-[20%] bottom-[45%] flex items-center justify-center">
        <div className="flex items-end gap-4">
          {combatState.monsters.slice(0, 3).map((monster, idx) => {
            const monsterSize = combatState.monsters.length === 1 
              ? 'w-64 h-64 md:w-80 md:h-80' 
              : combatState.monsters.length === 2 
                ? 'w-48 h-48 md:w-64 md:h-64' 
                : 'w-40 h-40 md:w-52 md:h-52';
            
            return (
              <div 
                key={monster.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  monster.hp <= 0 ? 'opacity-40 grayscale' : ''
                } ${idx === combatState.targetIndex && monster.hp > 0 ? 'scale-110 z-10' : ''}`}
                onClick={() => monster.hp > 0 && onTargetSelect(idx)}
                data-testid={`monster-target-${idx}`}
              >
                {/* Target indicator */}
                {idx === combatState.targetIndex && monster.hp > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                    <ChevronRight className="w-8 h-8 rotate-90" />
                  </div>
                )}
                
                {monster.image ? (
                  <TransparentMonster
                    src={monster.image}
                    alt={monster.name}
                    className={monsterSize}
                    animationState={monsterAnimations[idx] as 'idle' | 'attacking' | 'hit' || 'idle'}
                    isFlying={isFlying(monster.name)}
                  />
                ) : (
                  <div className={`${monsterSize} bg-red-500/50 rounded-lg flex items-center justify-center`}>
                    <Skull className="w-16 h-16 text-red-400" />
                  </div>
                )}
                
                {/* Monster shadow */}
                <div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/40 rounded-[50%] blur-sm"
                />
                
                {/* Monster name & HP (shown below monster) */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                  <div className="text-white text-xs font-bold drop-shadow-lg">{monster.name}</div>
                  <div className="w-24 h-2 bg-black/60 rounded-full mt-1 overflow-hidden border border-white/20">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, (monster.hp / monster.maxHp) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Party member sprite (right side) - showing current active character */}
      <div className="absolute right-[10%] bottom-[48%] flex flex-col items-center">
        {currentChar && (
          <div className="relative">
            {/* Character sprite placeholder - would be replaced with actual sprites */}
            <div 
              className="w-32 h-48 md:w-40 md:h-56 flex items-end justify-center relative"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
            >
              {/* Simple character representation */}
              <div className="relative w-full h-full flex flex-col items-center justify-end pb-4">
                {/* Character body silhouette */}
                <div 
                  className="w-20 h-32 md:w-24 md:h-40 rounded-t-3xl border-4 flex items-center justify-center"
                  style={{ 
                    backgroundColor: JOB_COLORS[currentChar.job.toLowerCase()] + '40',
                    borderColor: JOB_COLORS[currentChar.job.toLowerCase()]
                  }}
                >
                  <JobIcon job={currentChar.job} className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
                
                {/* Weapon/stance indicator */}
                <div className="absolute -right-4 top-1/3 transform -rotate-45">
                  <JobIcon job={currentChar.job} className="w-8 h-8 text-white/60" />
                </div>
              </div>
            </div>
            
            {/* Character shadow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/40 rounded-[50%] blur-sm" />
          </div>
        )}
      </div>
      
      {/* Party HP/MP display (right side panel) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 space-y-2">
        {aliveParty.map((char, idx) => {
          const stats = getEffectiveStats(char);
          const isCurrentTurn = game.party.indexOf(char) === combatState.currentCharIndex;
          
          return (
            <div 
              key={char.name}
              className={`bg-black/70 backdrop-blur-sm rounded-lg p-2 border-2 transition-all min-w-[140px] ${
                isCurrentTurn ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 'border-white/20'
              }`}
              data-testid={`party-stats-${idx}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-bold text-sm">{char.name}</span>
                {isCurrentTurn && (
                  <ChevronRight className="w-4 h-4 text-yellow-400 animate-pulse" />
                )}
              </div>
              
              {/* HP Bar */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-xs font-bold w-6">HP</span>
                <div className="flex-1 h-3 bg-black/60 rounded overflow-hidden border border-green-600/50">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                    style={{ width: `${(char.hp / stats.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-green-300 text-xs font-mono w-12 text-right">{char.hp}</span>
              </div>
              
              {/* MP Bar */}
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-xs font-bold w-6">MP</span>
                <div className="flex-1 h-3 bg-black/60 rounded overflow-hidden border border-blue-600/50">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                    style={{ width: `${(char.mp / stats.maxMp) * 100}%` }}
                  />
                </div>
                <span className="text-blue-300 text-xs font-mono w-12 text-right">{char.mp}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Command Menu (bottom-left) */}
      <div className="absolute left-3 bottom-3 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border-2 border-white/30 overflow-hidden min-w-[160px]">
          {menuMode === 'main' && (
            <div className="p-1">
              <button
                onClick={() => setMenuMode('fight')}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-3 rounded"
                data-testid="button-fight-menu"
              >
                <Swords className="w-5 h-5 text-red-400" />
                <span className="font-bold">Fight</span>
              </button>
              <button
                onClick={() => setMenuMode('tactics')}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-3 rounded"
                data-testid="button-tactics-menu"
              >
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold">Tactics</span>
              </button>
              <button
                onClick={onFlee}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-3 rounded"
                data-testid="button-flee"
              >
                <DoorOpen className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">Flee</span>
              </button>
            </div>
          )}
          
          {menuMode === 'fight' && currentChar && (
            <div className="p-1">
              <div className="px-3 py-1 text-xs text-white/60 border-b border-white/20 mb-1">
                {currentChar.name}'s Actions
              </div>
              {getAbilitiesForJob(currentChar.job).map((ability) => {
                const canUse = ability.mpCost <= currentChar.mp;
                return (
                  <button
                    key={ability.id}
                    onClick={() => {
                      if (canUse) {
                        onAbilityUse(ability, combatState.currentCharIndex);
                        setMenuMode('main');
                      }
                    }}
                    disabled={!canUse}
                    className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between rounded ${
                      canUse ? 'text-white hover:bg-white/20' : 'text-white/40 cursor-not-allowed'
                    }`}
                    data-testid={`button-ability-${ability.id}`}
                  >
                    <span className="font-medium">{ability.name}</span>
                    {ability.mpCost > 0 && (
                      <span className="text-blue-400 text-sm">{ability.mpCost} MP</span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setMenuMode('main')}
                className="w-full text-left px-4 py-2 text-white/60 hover:bg-white/20 transition-colors rounded mt-1 border-t border-white/20"
                data-testid="button-back"
              >
                ← Back
              </button>
            </div>
          )}
          
          {menuMode === 'tactics' && (
            <div className="p-1">
              <div className="px-3 py-1 text-xs text-white/60 border-b border-white/20 mb-1">
                Tactics
              </div>
              <button
                onClick={() => setMenuMode('main')}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors rounded"
                data-testid="button-defend"
              >
                Defend
              </button>
              <button
                onClick={() => setMenuMode('main')}
                className="w-full text-left px-4 py-2 text-white/60 hover:bg-white/20 transition-colors rounded mt-1 border-t border-white/20"
                data-testid="button-back-tactics"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Combat Log (bottom center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-md w-full px-4">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg border border-white/20 p-3">
          <div className="text-white text-sm font-medium text-center" data-testid="text-combat-log">
            {logs[0] || "Battle Start!"}
          </div>
        </div>
      </div>
      
      {/* Control hints (bottom) */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-4 text-white/60 text-xs">
        <div className="flex items-center gap-1">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">ESC</span>
          <span>Flee</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Tab</span>
          <span>Target</span>
        </div>
      </div>
    </div>
  );
}
