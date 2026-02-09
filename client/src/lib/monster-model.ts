export function getMonsterModelPath(monster: any): string | null {
  if (monster && typeof monster.modelPath === 'string') {
    return monster.modelPath;
  }
  return null;
}
