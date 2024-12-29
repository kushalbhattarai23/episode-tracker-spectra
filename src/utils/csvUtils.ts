export const exportToCSV = (episodes: Array<{ show: string; episode: string; title: string; originalAirDate: string; watched: string }>) => {
  const headers = ['show,episode,title,originalAirDate,watched'];
  const rows = episodes.map(ep => 
    `${ep.show},${ep.episode},${ep.title},${ep.originalAirDate},${ep.watched}`
  );
  const csvContent = [...headers, ...rows].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'episodes.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};