import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyFilePath = path.join(__dirname, '../../db/searchHistory.json');

class HistoryService {
  // Read the history file
  async readHistory() {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      const err = error;
      console.error('Error reading history file:', err.message);
      return [];
    }
  }

  // Write to the history file
  async writeHistory(cities) {
    try {
      await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      const err = error;
      console.error('Error writing to history file:', err.message);
    }
  }

  // Add a city to the search history
  async addCity(city) {
    const cities = await this.readHistory();
    if (!cities.includes(city)) {
      cities.push(city);
      await this.writeHistory(cities);
    }
  }

  // Get all cities from the search history
  async getCities() {
    return await this.readHistory();
  }

  // Remove a city from the search history
  async removeCity(city) {
    const cities = await this.readHistory();
    const updatedCities = cities.filter((c) => c !== city);
    await this.writeHistory(updatedCities);
  }
}

export default new HistoryService();
