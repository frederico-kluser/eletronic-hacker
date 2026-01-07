namespace Browline.Hud.Core.Data;

public class DeviceDiagnosticsSnapshot
{
    public float CpuLoad = 0f;
    public float MemoryUsage = 0f;
    public float MemoryCapacity = 0f;
    public float NetworkStrength = 0f;
    public NetworkConnectionType NetworkConnection = NetworkConnectionType.None;
    public float TemperatureC = 0f;
    public float WindSpeedKmh = 0f;
    public CardinalDirection WindDirection = CardinalDirection.North;
    public float HumidityPercent = 0f;

    public DeviceDiagnosticsSnapshot Clone()
    {
        return new DeviceDiagnosticsSnapshot
        {
            CpuLoad = CpuLoad,
            MemoryUsage = MemoryUsage,
            MemoryCapacity = MemoryCapacity,
            NetworkStrength = NetworkStrength,
            NetworkConnection = NetworkConnection,
            TemperatureC = TemperatureC,
            WindSpeedKmh = WindSpeedKmh,
            WindDirection = WindDirection,
            HumidityPercent = HumidityPercent,
        };
    }
}
