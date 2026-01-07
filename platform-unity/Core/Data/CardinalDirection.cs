namespace Browline.Hud.Core.Data;

public enum CardinalDirection
{
    North = 0,
    NorthEast = 1,
    East = 2,
    SouthEast = 3,
    South = 4,
    SouthWest = 5,
    West = 6,
    NorthWest = 7,
}

public static class CardinalDirectionExtensions
{
    private static readonly string[] Labels = { "N", "NE", "E", "SE", "S", "SW", "W", "NW" };

    public static string ToLabel(this CardinalDirection direction)
    {
        var index = (int)direction;
        if (index < 0 || index >= Labels.Length)
        {
            index = 0;
        }

        return Labels[index];
    }
}
