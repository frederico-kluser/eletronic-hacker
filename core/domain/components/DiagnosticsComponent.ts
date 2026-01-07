import { defineComponent, Types } from 'bitecs';

export const DiagnosticsComponent = defineComponent({
  cpuLoad: Types.f32,
  memoryUsage: Types.f32,
  memoryCapacity: Types.f32,
  networkStrength: Types.f32,
  networkConnection: Types.ui8,
  temperatureC: Types.f32,
  windSpeedKmh: Types.f32,
  windDirection: Types.ui8,
  humidityPercent: Types.f32,
});
