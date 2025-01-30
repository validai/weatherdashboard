import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyFilePath = path.join(__dirname, '../../db/searchHistory.json');

class HistoryService {
  async readHistory(): Promise<string[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error reading history file:', error.message);
      } else {
        console.error('Unknown error reading history file:', error);
      }
      return [];
    }
  }

  async writeHistory(cities: string[]): Promise<void> {
    try {
      await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error writing to history file:', error.message);
      } else {
        console.error('Unknown error writing to history file:', error);
      }
    }
  }

  async addCity(city: string): Promise<void> {
    const cities = await this.readHistory();
    if (!cities.includes(city)) {
      cities.push(city);
      await this.writeHistory(cities);
    }
  }

  async getCities(): Promise<string[]> {
    return await this.readHistory();
  }

  async removeCity(city: string): Promise<void> {
    const cities = await this.readHistory();
    const updatedCities = cities.filter((c: string) => c !== city);
    await this.writeHistory(updatedCities);
  }
}

export default HistoryService;
