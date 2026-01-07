import { HudMode } from '../domain/components/HudModeComponent';
import { PowerState, toPowerBoolean } from '../domain/components/PowerComponent';
import { DeviceDiagnosticsSnapshot } from '../data/DeviceSpecifications';
import { IGameWorld } from '../interfaces/IGameWorld';
import { HudSnapshot } from './HudSnapshot';

type SimulationListener = () => void;

export class GameSimulation {
  private readonly deviceId: number;
  private readonly listeners: Set<SimulationListener> = new Set();
  private frameHandle = 0;
  private lastTimestamp = 0;
  private running = false;
  private snapshot: HudSnapshot;

  public constructor(private readonly world: IGameWorld) {
    this.deviceId = this.world.createDeviceEntity();
    this.snapshot = this.buildSnapshot();
  }

  public start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.frameHandle = requestAnimationFrame(this.step);
  }

  public stop(): void {
    if (!this.running) {
      return;
    }

    cancelAnimationFrame(this.frameHandle);
    this.running = false;
    this.lastTimestamp = 0;
  }

  public setMode(mode: HudMode): void {
    this.world.setMode(this.deviceId, mode);
    this.snapshot = this.buildSnapshot();
    this.notify();
  }

  public togglePower(): void {
    const current = this.world.getPowerState(this.deviceId);
    const next = current === PowerState.On ? PowerState.Off : PowerState.On;
    this.world.setPowerState(this.deviceId, next);
    this.snapshot = this.buildSnapshot();
    this.notify();
  }

  public getSnapshot(): HudSnapshot {
    return this.snapshot;
  }

  public subscribe(listener: SimulationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private step = (timestamp: number): void => {
    if (!this.running) {
      return;
    }

    const delta = this.lastTimestamp === 0 ? 16 : timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const diagnostics = this.world.updateDiagnostics(this.deviceId, delta);
    this.snapshot = this.buildSnapshot(diagnostics);
    this.notify();
    this.frameHandle = requestAnimationFrame(this.step);
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private buildSnapshot(diagnostics?: DeviceDiagnosticsSnapshot): HudSnapshot {
    const currentDiagnostics = diagnostics ?? this.world.getDiagnostics(this.deviceId);
    const mode = this.world.getMode(this.deviceId);
    const poweredState = this.world.getPowerState(this.deviceId);
    return new HudSnapshot(mode, toPowerBoolean(poweredState), currentDiagnostics);
  }
}
