import { useState, useEffect, useCallback } from "react";
import { preloadDungeonFloors, getPreloadedFloor, isPreloadReady } from "@/utils/preload";
import { useGameState } from "@/hooks/use-game";
import { createInitialState, GameData } from "@/lib/game-engine";
import { Sword, Play } from "lucide-react";

const LOCAL_STORAGE_KEY = "stone_dungeon_game_state";

function clearLocalGameState(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function navigateTo(path: string) {
  window.location.href = path;
}

export function MainMenu() {
  const { data: savedGame, isLoading: isLoadingSave } = useGameState();
  const [preloadProgress, setPreloadProgress] = useState<number>(0);
  const [preloadReady, setPreloadReady] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(0); // 0 = New Game, 1 = Continue
  const [isStarting, setIsStarting] = useState(false);
  
  const hasSave = savedGame !== null && savedGame !== undefined;
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      // Preload all assets (floors + monsters + drops)
      await preloadDungeonFloors(60, (p) => { if (mounted) setPreloadProgress(p); });
      if (mounted) setPreloadReady(true);
    })();
    return () => { mounted = false; };
  }, []);

  const isReadyForNewGame = preloadReady;
  const readyLabel = isReadyForNewGame ? "Ready" : `Loading... ${preloadProgress}%`;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isStarting) return;
    
    if (e.key === "ArrowUp" || e.key === "w") {
      e.preventDefault();
      setSelectedOption(prev => prev > 0 ? prev - 1 : (hasSave ? 1 : 0));
    } else if (e.key === "ArrowDown" || e.key === "s") {
      e.preventDefault();
      setSelectedOption(prev => (prev < 1 && hasSave) ? prev + 1 : 0);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  }, [hasSave, isStarting, preloadReady, preloadProgress]);
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  
  const handleSelect = () => {
    if (isStarting) return;
    setIsStarting(true);
    
    if (selectedOption === 0) {
      clearLocalGameState();
      navigateTo("/game?new=1");
    } else if (selectedOption === 1 && hasSave) {
      navigateTo("/game?continue=1");
    }
  };
  
  if (isLoadingSave) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-primary font-pixel text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-primary font-pixel mb-2 tracking-wider" style={{ textShadow: '0 0 20px rgba(139, 69, 19, 0.5)' }}>
          STONE DUNGEON
        </h1>
        <p className="text-amber-600 font-pixel text-sm tracking-widest">
          ENTER THE DEPTHS
        </p>
      </div>
      
      {/* Menu Options */}
      <div className="w-full max-w-md">
        {/* New Game */}
        <button
              onClick={() => {
            setSelectedOption(0);
            handleSelect();
          }}
          className={`w-full mb-4 p-6 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 ${
            selectedOption === 0
              ? "border-amber-500 bg-amber-950/50 text-amber-100 shadow-lg shadow-amber-900/30"
              : "border-gray-700 bg-gray-900/50 text-gray-400 hover:border-amber-700 hover:bg-gray-800/50"
          }`}
        >
          <div className={`p-2 rounded-lg ${selectedOption === 0 ? "bg-amber-700" : "bg-gray-700"}`}>
            <Sword className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="font-pixel text-xl font-bold">NEW GAME</div>
            <div className="font-pixel text-xs opacity-70">Start a fresh adventure</div>
          </div>
          {selectedOption === 0 && (
            <div className="ml-auto text-amber-400 animate-pulse">▶</div>
          )}
        </button>
        
        {/* Continue */}
        <button
          onClick={() => {
            setSelectedOption(1);
            handleSelect();
          }}
          disabled={!hasSave || !preloadReady}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 ${
            !hasSave
              ? "border-gray-800 bg-gray-900/30 text-gray-600 cursor-not-allowed opacity-50"
              : selectedOption === 1
                ? "border-amber-500 bg-amber-950/50 text-amber-100 shadow-lg shadow-amber-900/30"
                : "border-gray-700 bg-gray-900/50 text-gray-400 hover:border-amber-700 hover:bg-gray-800/50"
          }`}
        >
          <div className={`p-2 rounded-lg ${!hasSave ? "bg-gray-800" : selectedOption === 1 ? "bg-amber-700" : "bg-gray-700"}`}>
            <Play className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="font-pixel text-xl font-bold">CONTINUE</div>
            <div className="font-pixel text-xs opacity-70">
              {hasSave ? "Resume your adventure" : "No save found"}
            </div>
          </div>
          {hasSave && selectedOption === 1 && (
            <div className="ml-auto text-amber-400 animate-pulse">▶</div>
          )}
        </button>
      </div>
      
      {/* Controls Hint */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 font-pixel text-xs">
          <span className="text-amber-600">↑↓</span> to navigate • <span className="text-amber-600">ENTER</span> to select
        </p>
      </div>
      
      {/* Version */}
      <div className="mt-8 text-gray-700 font-pixel text-xs">
        v1.0.0
      </div>
    </div>
  );
}

export default MainMenu;
