export const parseCSV = (text: string) => {
  // Split into lines and remove empty ones
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return [];

  // Parse each line, handling quoted values and different formats
  return lines.map(line => {
    // Handle quoted values properly
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    // Try to map values to episode fields, with fallbacks
    return {
      show: values[0] || 'Unknown Show',
      episode: values[1] || 'Unknown Episode',
      title: values[2] || 'Unknown Title',
      originalAirDate: values[3] || 'N/A',
      watched: values[4]?.toLowerCase() === 'yes' ? 'yes' : 'no'
    };
  });
};