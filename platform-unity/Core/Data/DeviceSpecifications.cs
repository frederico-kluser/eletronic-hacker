namespace Browline.Hud.Core.Data;

public sealed class DeviceSpecifications
{
    private readonly DeviceDiagnosticsSnapshot _defaultSnapshot = new()
    {
        CpuLoad = 42f,
        MemoryUsage = 12f,
        MemoryCapacity = 64f,
        NetworkStrength = 0.9f,
        NetworkConnection = NetworkConnectionType.Cellular5G,
        TemperatureC = 24f,
        WindSpeedKmh = 12f,
        WindDirection = CardinalDirection.NorthWest,
        HumidityPercent = 45f,
    };

    public DeviceDiagnosticsSnapshot CreateDiagnosticsSnapshot()
    {
        return _defaultSnapshot.Clone();
    }
}
