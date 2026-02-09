import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Monster, MONSTERS } from '@/lib/game-engine';
import { Bug, Skull } from 'lucide-react';

interface MonsterSpawnerProps {
  onSpawnMonster: (monster: Monster) => void;
  disabled?: boolean;
}

export function MonsterSpawner({ onSpawnMonster, disabled }: MonsterSpawnerProps) {
  const [open, setOpen] = useState(false);
  
  // Group monsters by tier for better organization
  const earlyMonsters = MONSTERS.slice(0, 10); // Floors 1-2
  const midMonsters = MONSTERS.slice(10, 18); // Floors 3-5
  const deepMonsters = MONSTERS.slice(18, 23); // Floors 6-8
  const bossMonsters = MONSTERS.slice(23); // Floors 9+

  const handleSpawn = (monster: Monster) => {
    onSpawnMonster(monster);
    setOpen(false);
  };

  const renderMonsterButton = (monster: Monster) => (
    <Button
      key={monster.id}
      variant="outline"
      className="w-full justify-start gap-2 h-auto py-3 px-4 hover:bg-red-900/20 hover:border-red-500/50 transition-all"
      onClick={() => handleSpawn(monster)}
    >
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: monster.color }}
      />
      <div className="flex flex-col items-start">
        <span className="font-medium text-sm">{monster.name}</span>
        <span className="text-xs text-gray-400">
          HP: {monster.hp} | ATK: {monster.attack} | DEF: {monster.defense}
        </span>
      </div>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-purple-900/30 border-purple-500/50 hover:bg-purple-900/50"
          disabled={disabled}
        >
          <Bug className="w-4 h-4" />
          Spawn Monster
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 z-[400]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Skull className="w-6 h-6 text-red-500" />
            Monster Spawner (Debug)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Early Floor Monsters */}
          <div>
            <h3 className="text-sm font-bold text-yellow-400 mb-2 uppercase tracking-wider">
              Early Floors (1-2)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {earlyMonsters.map(renderMonsterButton)}
            </div>
          </div>

          {/* Mid Floor Monsters */}
          <div>
            <h3 className="text-sm font-bold text-orange-400 mb-2 uppercase tracking-wider">
              Mid Floors (3-5)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {midMonsters.map(renderMonsterButton)}
            </div>
          </div>

          {/* Deep Floor Monsters */}
          <div>
            <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">
              Deep Floors (6-8)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {deepMonsters.map(renderMonsterButton)}
            </div>
          </div>

          {/* Boss Monsters */}
          <div>
            <h3 className="text-sm font-bold text-purple-400 mb-2 uppercase tracking-wider">
              Boss Tier (9+)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {bossMonsters.map(renderMonsterButton)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
