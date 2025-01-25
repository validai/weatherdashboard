import fs from 'fs/promises';
import path from 'path';

const historyFilePath = path.join(__dirname, '../../db/searchHistory.json');

class HistoryService {
  // Read the history file
  private async readHistory(): Promise<string[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      const err = error as Error;
      console.error('Error reading history file:', err.message);
      return [];
    }
  }

  // Write to the history file
  private async writeHistory(cities: string[]) {
    try {
      await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      const err = error as Error;
      console.error('Error writing to history file:', err.message);
    }
  }

  // Add a city to the search history
  public async addCity(city: string) {
    const cities = await this.readHistory();
    if (!cities.includes(city)) {
      cities.push(city);
      await this.writeHistory(cities);
    }
  }

  // Get all cities from the search history
  public async getCities(): Promise<string[]> {
    return await this.readHistory();
  }

  // Remove a city from the search history
  public async removeCity(city: string) {
    const cities = await this.readHistory();
    const updatedCities = cities.filter((c) => c !== city);
    await this.writeHistory(updatedCities);
  }
}

export default new HistoryService();
