export type HubNameDisplay = {
  lines: string[];
  size: 'normal' | 'small' | 'tiny';
};

export function formatHubName(name: string): HubNameDisplay {
  const trimmed = name.trim();
  if (!trimmed) {
    return { lines: ['Drop'], size: 'normal' };
  }

  const words = trimmed.split(/\s+/);
  const longestWord = Math.max(...words.map((word) => word.length));

  if (words.length === 1) {
    return {
      lines: [trimmed],
      size: longestWord > 12 ? 'tiny' : longestWord > 8 ? 'small' : 'normal',
    };
  }

  const splitIndex = Math.ceil(words.length / 2);
  const lines = [words.slice(0, splitIndex).join(' '), words.slice(splitIndex).join(' ')];
  const longestLine = Math.max(...lines.map((line) => line.length));

  return {
    lines,
    size: longestLine > 12 ? 'tiny' : longestLine > 8 ? 'small' : 'normal',
  };
}
