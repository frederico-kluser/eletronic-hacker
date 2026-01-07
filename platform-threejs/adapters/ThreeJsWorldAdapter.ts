import { addComponent, addEntity, createWorld } from 'bitecs';
import { DiagnosticsComponent } from '../../core/domain/components/DiagnosticsComponent';
import { HudMode, HudModeComponent } from '../../core/domain/components/HudModeComponent';
import { PowerComponent, PowerState } from '../../core/domain/components/PowerComponent';
import { DiagnosticsSystem } from '../../core/domain/systems/DiagnosticsSystem';
import {
  CardinalDirection,
  DeviceDiagnosticsSnapshot,
  DeviceSpecifications,
  NetworkConnectionType,
} from '../../core/data/DeviceSpecifications';
import { IGameWorld } from '../../core/interfaces/IGameWorld';

export class ThreeJsWorldAdapter implements IGameWorld {
  private readonly world = createWorld();
  private readonly diagnosticsSystem = new DiagnosticsSystem();
  private readonly specs = new DeviceSpecifications();
  private readonly diagnosticsCache: Map<number, DeviceDiagnosticsSnapshot> = new Map();

  public createDeviceEntity(): number {
    const entity = addEntity(this.world);
    addComponent(this.world, HudModeComponent, entity);
    addComponent(this.world, PowerComponent, entity);
    addComponent(this.world, DiagnosticsComponent, entity);

    HudModeComponent.value[entity] = HudMode.System;
    PowerComponent.value[entity] = PowerState.On;
    this.applyDiagnostics(entity, this.specs.createDiagnosticsSnapshot());
    return entity;
  }

  public setMode(entityId: number, mode: HudMode): void {
    HudModeComponent.value[entityId] = mode;
  }

  public getMode(entityId: number): HudMode {
    return HudModeComponent.value[entityId] as HudMode;
  }

  public setPowerState(entityId: number, state: PowerState): void {
    PowerComponent.value[entityId] = state;
  }

  public getPowerState(entityId: number): PowerState {
    return PowerComponent.value[entityId] as PowerState;
  }

  public updateDiagnostics(entityId: number, deltaTimeMs: number): DeviceDiagnosticsSnapshot {
    const powerState = this.getPowerState(entityId);
    this.diagnosticsSystem.update(entityId, deltaTimeMs, powerState);
    const snapshot = this.readDiagnostics(entityId);
    this.diagnosticsCache.set(entityId, snapshot);
    return snapshot;
  }

  public getDiagnostics(entityId: number): DeviceDiagnosticsSnapshot {
    const cached = this.diagnosticsCache.get(entityId);
    if (cached) {
      return cached;
    }

    const snapshot = this.readDiagnostics(entityId);
    this.diagnosticsCache.set(entityId, snapshot);
    return snapshot;
  }

  private applyDiagnostics(entityId: number, diagnostics: DeviceDiagnosticsSnapshot): void {
    DiagnosticsComponent.cpuLoad[entityId] = diagnostics.cpuLoad;
    DiagnosticsComponent.memoryUsage[entityId] = diagnostics.memoryUsage;
    DiagnosticsComponent.memoryCapacity[entityId] = diagnostics.memoryCapacity;
    DiagnosticsComponent.networkStrength[entityId] = diagnostics.networkStrength;
    DiagnosticsComponent.networkConnection[entityId] = diagnostics.networkConnection;
    DiagnosticsComponent.temperatureC[entityId] = diagnostics.temperatureC;
    DiagnosticsComponent.windSpeedKmh[entityId] = diagnostics.windSpeedKmh;
    DiagnosticsComponent.windDirection[entityId] = diagnostics.windDirection;
    DiagnosticsComponent.humidityPercent[entityId] = diagnostics.humidityPercent;
  }

  private readDiagnostics(entityId: number): DeviceDiagnosticsSnapshot {
    return {
      cpuLoad: DiagnosticsComponent.cpuLoad[entityId],
      memoryUsage: DiagnosticsComponent.memoryUsage[entityId],
      memoryCapacity: DiagnosticsComponent.memoryCapacity[entityId],
      networkStrength: DiagnosticsComponent.networkStrength[entityId],
      networkConnection: (DiagnosticsComponent.networkConnection[entityId] || NetworkConnectionType.None) as NetworkConnectionType,
      temperatureC: DiagnosticsComponent.temperatureC[entityId],
      windSpeedKmh: DiagnosticsComponent.windSpeedKmh[entityId],
      windDirection: (DiagnosticsComponent.windDirection[entityId] || CardinalDirection.NorthWest) as CardinalDirection,
      humidityPercent: DiagnosticsComponent.humidityPercent[entityId],
    };
  }
}
