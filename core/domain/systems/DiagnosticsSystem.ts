import { DiagnosticsComponent } from '../components/DiagnosticsComponent';
import { PowerState } from '../components/PowerComponent';
import { CardinalDirection, NetworkConnectionType } from '../../data/DeviceSpecifications';

const MAX_CARDINAL_INDEX = 7;

export class DiagnosticsSystem {
  public update(entityId: number, deltaTimeMs: number, powerState: PowerState): void {
    const powerModifier = powerState === PowerState.On ? 1 : -1;

    DiagnosticsComponent.cpuLoad[entityId] = this.clamp(
      DiagnosticsComponent.cpuLoad[entityId] + this.noise(deltaTimeMs, 0.08) + powerModifier * 0.02,
      8,
      96,
    );

    DiagnosticsComponent.memoryUsage[entityId] = this.clamp(
      DiagnosticsComponent.memoryUsage[entityId] + this.noise(deltaTimeMs, 0.03) + powerModifier * 0.01,
      6,
      DiagnosticsComponent.memoryCapacity[entityId] - 2,
    );

    DiagnosticsComponent.networkStrength[entityId] = this.clamp(
      DiagnosticsComponent.networkStrength[entityId] + this.noise(deltaTimeMs, 0.002),
      0,
      1,
    );

    DiagnosticsComponent.networkConnection[entityId] =
      DiagnosticsComponent.networkStrength[entityId] > 0.2
        ? NetworkConnectionType.Cellular5G
        : NetworkConnectionType.None;

    DiagnosticsComponent.temperatureC[entityId] = this.clamp(
      DiagnosticsComponent.temperatureC[entityId] + this.noise(deltaTimeMs, 0.001) + powerModifier * 0.005,
      18,
      36,
    );

    DiagnosticsComponent.windSpeedKmh[entityId] = this.clamp(
      DiagnosticsComponent.windSpeedKmh[entityId] + this.noise(deltaTimeMs, 0.01),
      2,
      24,
    );

    const shouldShiftDirection = Math.random() > 0.98;
    if (shouldShiftDirection) {
      const currentDirection = DiagnosticsComponent.windDirection[entityId];
      const nextDirection = (Math.round(currentDirection) + 1) % (MAX_CARDINAL_INDEX + 1);
      DiagnosticsComponent.windDirection[entityId] = nextDirection as CardinalDirection;
    }

    DiagnosticsComponent.humidityPercent[entityId] = this.clamp(
      DiagnosticsComponent.humidityPercent[entityId] + this.noise(deltaTimeMs, 0.005),
      20,
      70,
    );
  }

  private noise(deltaTimeMs: number, amplitude: number): number {
    const normalized = deltaTimeMs / 16.67;
    return (Math.random() - 0.5) * 2 * amplitude * normalized;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
