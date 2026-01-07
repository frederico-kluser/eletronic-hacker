using Browline.Hud.Core.Data;
using Browline.Hud.Core.Domain.Components;

namespace Browline.Hud.Core.Interfaces;

public interface IGameWorldPort
{
    int CreateDeviceEntity();
    void SetMode(int entityId, HudMode mode);
    HudMode GetMode(int entityId);
    void SetPowerState(int entityId, PowerState state);
    PowerState GetPowerState(int entityId);
    DeviceDiagnosticsSnapshot UpdateDiagnostics(int entityId, float deltaTimeMs);
    DeviceDiagnosticsSnapshot GetDiagnostics(int entityId);
}
