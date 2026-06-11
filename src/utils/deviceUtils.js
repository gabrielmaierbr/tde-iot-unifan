export const getDerivedStatus = (fillLevel) => {
  if (typeof fillLevel !== 'number') return 'normal';
  if (fillLevel >= 85) return 'cheia';
  if (fillLevel >= 70) return 'atencao';
  return 'normal';
};
