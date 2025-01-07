interface Episode {
  show: string;
  episode: string;
  title: string;
  originalAirDate: string;
  watched: string;
}

export const convertJSONtoCSV = (jsonData: any[]): Episode[] => {
  return jsonData.map(item => ({
    show: item.show || 'Unknown Show',
    episode: item.episode || 'Unknown Episode',
    title: item.title || 'Unknown Title',
    originalAirDate: item.originalAirDate || 'N/A',
    watched: item.watched?.toLowerCase() === 'yes' ? 'yes' : 'no'
  }));
};