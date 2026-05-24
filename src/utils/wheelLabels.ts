export function formatCityLabel(city: string): string[] {
  const words = city.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [''];
  }

  if (words.length === 1) {
    return [truncateLabel(words[0], 12)];
  }

  if (words.length === 2) {
    return words.map((word) => truncateLabel(word, 11));
  }

  const splitIndex = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, splitIndex).join(' ');
  const secondLine = words.slice(splitIndex).join(' ');
  return [truncateLabel(firstLine, 9), truncateLabel(secondLine, 7)];
}

function truncateLabel(label: string, maxLength: number): string {
  return label.length > maxLength ? `${label.slice(0, Math.max(0, maxLength - 3))}...` : label;
}
