// Parse M3U playlist text to channel array
export function parseM3U(data) {
  const lines = data.split('\n');
  const result = [];
  let current = {};
  let id = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF:')) {
      current = {};
      current.id = String(id++);
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      if (logoMatch) current.logo = logoMatch[1];
      const groupMatch = line.match(/group-title="(.*?)"/);
      current.category = groupMatch ? groupMatch[1] : 'Others';
      const numMatch = line.match(/tvg-chno="(\d+)"/);
      current.number = numMatch ? numMatch[1] : String(id);
      const nameMatch = line.match(/,(.+)$/);
      current.name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
    } else if (line.startsWith('http') && current.name) {
      current.url = line;
      result.push({ ...current });
      current = {};
    }
  }
  return result;
}

