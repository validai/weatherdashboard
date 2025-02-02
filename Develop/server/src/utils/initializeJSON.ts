import fs from 'fs';
import path from 'path';

const searchHistoryPath = path.resolve(__dirname, '../../db/searchHistory.json');

export function initializeSearchHistory() {
  if (!fs.existsSync(searchHistoryPath)) {
    fs.writeFileSync(searchHistoryPath, JSON.stringify([]));
    console.log('Initialized searchHistory.json as an empty array.');
  }
}
