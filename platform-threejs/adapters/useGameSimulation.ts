import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { HudMode } from '../../core/domain/components/HudModeComponent';
import { GameSimulation } from '../../core/state/GameSimulation';
import { ThreeJsWorldAdapter } from './ThreeJsWorldAdapter';

export function useGameSimulation() {
  const simulation = useMemo(() => new GameSimulation(new ThreeJsWorldAdapter()), []);

  const snapshot = useSyncExternalStore(
    (listener) => simulation.subscribe(listener),
    () => simulation.getSnapshot(),
  );

  useEffect(() => {
    simulation.start();
    return () => simulation.stop();
  }, [simulation]);

  function setMode(mode: HudMode): void {
    simulation.setMode(mode);
  }

  function togglePower(): void {
    simulation.togglePower();
  }

  return { snapshot, setMode, togglePower };
}
