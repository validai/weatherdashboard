import { Router, Request, Response } from 'express';
import WeatherService from '../../service/weatherService';
import HistoryService from '../../service/historyService';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { cityName } = req.body;

  if (!cityName) {
    res.status(400).json({ error: 'City name is required.' });
    return;
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    res.status(200).json(weatherData);
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to retrieve weather data.' });
  }
});


export default router;
