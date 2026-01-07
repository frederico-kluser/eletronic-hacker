using Browline.Hud.Core.Data;
using Browline.Hud.Core.Domain.Components;
using UnityEngine;

namespace Browline.Hud.Core.Systems;

public sealed class DiagnosticsSystem
{
    private const float MaxCardinalIndex = 7f;

    public void Update(DeviceDiagnosticsSnapshot snapshot, PowerState powerState, float deltaTimeMs)
    {
        var powerModifier = powerState == PowerState.On ? 1f : -1f;

        snapshot.CpuLoad = Clamp(snapshot.CpuLoad + Noise(deltaTimeMs, 0.08f) + powerModifier * 0.02f, 8f, 96f);
        snapshot.MemoryUsage = Clamp(snapshot.MemoryUsage + Noise(deltaTimeMs, 0.03f) + powerModifier * 0.01f, 6f, snapshot.MemoryCapacity - 2f);
        snapshot.NetworkStrength = Clamp(snapshot.NetworkStrength + Noise(deltaTimeMs, 0.002f), 0f, 1f);
        snapshot.NetworkConnection = snapshot.NetworkStrength > 0.2f ? NetworkConnectionType.Cellular5G : NetworkConnectionType.None;
        snapshot.TemperatureC = Clamp(snapshot.TemperatureC + Noise(deltaTimeMs, 0.001f) + powerModifier * 0.005f, 18f, 36f);
        snapshot.WindSpeedKmh = Clamp(snapshot.WindSpeedKmh + Noise(deltaTimeMs, 0.01f), 2f, 24f);

        if (Random.value > 0.98f)
        {
            var nextDirection = ((int)snapshot.WindDirection + 1) % ((int)MaxCardinalIndex + 1);
            snapshot.WindDirection = (CardinalDirection)nextDirection;
        }

        snapshot.HumidityPercent = Clamp(snapshot.HumidityPercent + Noise(deltaTimeMs, 0.005f), 20f, 70f);
    }

    private static float Noise(float deltaTimeMs, float amplitude)
    {
        var normalized = deltaTimeMs / 16.67f;
        return (Random.value - 0.5f) * 2f * amplitude * normalized;
    }

    private static float Clamp(float value, float min, float max)
    {
        if (value < min)
        {
            return min;
        }

        return value > max ? max : value;
    }
}
