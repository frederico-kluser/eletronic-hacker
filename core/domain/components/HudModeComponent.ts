import { defineComponent, Types } from 'bitecs';

export enum HudMode {
  System = 0,
  Navigation = 1,
  Analysis = 2,
}

export const HudModeComponent = defineComponent({
  value: Types.ui8,
});

export function hudModeToLabel(mode: HudMode): string {
  switch (mode) {
    case HudMode.System:
      return 'System';
    case HudMode.Navigation:
      return 'Navigation';
    case HudMode.Analysis:
      return 'Analysis';
    default:
      return 'Unknown';
  }
}
