import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { InsertGameState, GameState } from "@shared/routes";
import { useToast } from "./use-toast";
import { createInitialState, GameData } from "@/lib/game-engine";

// ============================================
// GAME STATE HOOKS - LOCAL STORAGE VERSION
// ============================================

const LOCAL_STORAGE_KEY = "stone_dungeon_game_state";

function getLocalGameState(): GameState | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveLocalGameState(state: GameState): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  return useQuery({
    queryKey: ["localGameState"],
    queryFn: async () => {
      const stored = getLocalGameState();
      if (stored) {
        return stored;
      }
      return null;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useSaveGame() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGameState) => {
      const gameState: GameState = {
        id: 1,
        userId: "guest",
        data: data.data as unknown as GameData,
        lastSavedAt: data.lastSavedAt,
        viewportScale: data.viewportScale || "0.7",
      };
      saveLocalGameState(gameState);
      return gameState;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["localGameState"], data);
      toast({
        title: "Game Saved",
        description: "Your progress has been recorded in the chronicles.",
        className: "font-pixel text-xs border-2 border-primary bg-background text-primary",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Save Failed",
        description: err.message,
        variant: "destructive",
        className: "font-pixel text-xs",
      });
    }
  });
}
