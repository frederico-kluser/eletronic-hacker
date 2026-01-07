export enum NetworkConnectionType {
  None = 0,
  Cellular5G = 1,
}

export enum CardinalDirection {
  North = 0,
  NorthEast = 1,
  East = 2,
  SouthEast = 3,
  South = 4,
  SouthWest = 5,
  West = 6,
  NorthWest = 7,
}

export interface DeviceDiagnosticsSnapshot {
  cpuLoad: number;
  memoryUsage: number;
  memoryCapacity: number;
  networkStrength: number;
  networkConnection: NetworkConnectionType;
  temperatureC: number;
  windSpeedKmh: number;
  windDirection: CardinalDirection;
  humidityPercent: number;
}

export class DeviceSpecifications {
  private readonly defaultSnapshot: DeviceDiagnosticsSnapshot = {
    cpuLoad: 42,
    memoryUsage: 12,
    memoryCapacity: 64,
    networkStrength: 0.9,
    networkConnection: NetworkConnectionType.Cellular5G,
    temperatureC: 24,
    windSpeedKmh: 12,
    windDirection: CardinalDirection.NorthWest,
    humidityPercent: 45,
  };

  public createDiagnosticsSnapshot(): DeviceDiagnosticsSnapshot {
    return { ...this.defaultSnapshot };
  }
}

export function cardinalDirectionToLabel(direction: CardinalDirection): string {
  switch (direction) {
    case CardinalDirection.North:
      return 'N';
    case CardinalDirection.NorthEast:
      return 'NE';
    case CardinalDirection.East:
      return 'E';
    case CardinalDirection.SouthEast:
      return 'SE';
    case CardinalDirection.South:
      return 'S';
    case CardinalDirection.SouthWest:
      return 'SW';
    case CardinalDirection.West:
      return 'W';
    case CardinalDirection.NorthWest:
      return 'NW';
    default:
      return 'N';
  }
}

export function networkConnectionToLabel(connection: NetworkConnectionType): string {
  switch (connection) {
    case NetworkConnectionType.Cellular5G:
      return '5G';
    case NetworkConnectionType.None:
    default:
      return 'Offline';
  }
}
