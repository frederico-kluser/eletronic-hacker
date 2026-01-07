import { HudMode } from '../domain/components/HudModeComponent';
import { PowerState } from '../domain/components/PowerComponent';
import { DeviceDiagnosticsSnapshot } from '../data/DeviceSpecifications';

export interface IGameWorld {
  createDeviceEntity(): number;
  setMode(entityId: number, mode: HudMode): void;
  getMode(entityId: number): HudMode;
  setPowerState(entityId: number, state: PowerState): void;
  getPowerState(entityId: number): PowerState;
  updateDiagnostics(entityId: number, deltaTimeMs: number): DeviceDiagnosticsSnapshot;
  getDiagnostics(entityId: number): DeviceDiagnosticsSnapshot;
}
