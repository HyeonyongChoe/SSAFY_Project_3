import { useEffect } from 'react';
import { useScoreStore } from '../store';

export const useScoreAutoScroll = () => {
  const { isPlaying, nextLine } = useScoreStore();

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextLine();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);
};
