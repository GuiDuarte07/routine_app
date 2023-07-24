export function getRandomColor(): string {
  const minLightness = 50; // Minimum lightness value (0-100)
  const maxLightness = 80; // Maximum lightness value (0-100)

  const hue = Math.random() * 360; // Random hue value (0-360)
  const saturation = Math.random() * 50 + 50; // Random saturation value (50-100)
  const lightness = Math.random() * (maxLightness - minLightness) + minLightness; // Random lightness value (50-80)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}