using Browline.Hud.Core.Data;
using Browline.Hud.Core.Domain.Components;
using Browline.Hud.Core.Interfaces;
using Browline.Hud.Core.Systems;

namespace Browline.Hud.PlatformUnity.Adapters;

/// <summary>
/// Unity-side implementation of IGameWorld that mirrors the Three.js adapter.
/// Plug this class into a MonoBehaviour, dependency injection container, or DOTS system.
/// </summary>
public sealed class UnityGameWorldAdapter : IGameWorldPort
{
    private readonly DiagnosticsSystem _diagnosticsSystem = new();
    private readonly DeviceSpecifications _specifications = new();
    private readonly Dictionary<int, HudMode> _modes = new();
    private readonly Dictionary<int, PowerState> _powerStates = new();
    private readonly Dictionary<int, DeviceDiagnosticsSnapshot> _diagnostics = new();

    private int _nextEntityId = 1;

    public int CreateDeviceEntity()
    {
        var entityId = _nextEntityId++;
        _modes[entityId] = HudMode.System;
        _powerStates[entityId] = PowerState.On;
        _diagnostics[entityId] = _specifications.CreateDiagnosticsSnapshot();
        return entityId;
    }

    public void SetMode(int entityId, HudMode mode)
    {
        _modes[entityId] = mode;
    }

    public HudMode GetMode(int entityId)
    {
        return _modes.TryGetValue(entityId, out var mode) ? mode : HudMode.System;
    }

    public void SetPowerState(int entityId, PowerState state)
    {
        _powerStates[entityId] = state;
    }

    public PowerState GetPowerState(int entityId)
    {
        return _powerStates.TryGetValue(entityId, out var state) ? state : PowerState.Off;
    }

    public DeviceDiagnosticsSnapshot UpdateDiagnostics(int entityId, float deltaTimeMs)
    {
        var snapshot = ReadDiagnostics(entityId);
        var state = GetPowerState(entityId);
        _diagnosticsSystem.Update(snapshot, state, deltaTimeMs);
        return snapshot;
    }

    public DeviceDiagnosticsSnapshot GetDiagnostics(int entityId)
    {
        return ReadDiagnostics(entityId);
    }

    private DeviceDiagnosticsSnapshot ReadDiagnostics(int entityId)
    {
        if (_diagnostics.TryGetValue(entityId, out var snapshot))
        {
            return snapshot;
        }

        var fallback = _specifications.CreateDiagnosticsSnapshot();
        _diagnostics[entityId] = fallback;
        return fallback;
    }
}
