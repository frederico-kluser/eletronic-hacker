import { HudMode } from '../domain/components/HudModeComponent';
import { DeviceDiagnosticsSnapshot } from '../data/DeviceSpecifications';

export class HudSnapshot {
  public constructor(
    public readonly mode: HudMode,
    public readonly isPowered: boolean,
    public readonly diagnostics: DeviceDiagnosticsSnapshot,
  ) {}
}
