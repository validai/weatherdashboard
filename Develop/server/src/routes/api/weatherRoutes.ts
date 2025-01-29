import { Router, Request, Response } from 'express';
import WeatherService from "../../service/weatherService.js";
import HistoryService from "../../service/historyService.js";


const router = Router();

// POST Request: Get weather data by city name and save to history
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
    } catch (error) {
        console.error('Error fetching weather data:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Failed to retrieve weather data.' });
    }
});

// GET Request: Retrieve weather history
router.get('/history', async (_: Request, res: Response): Promise<void> => {
    try {
        const history = await HistoryService.getCities();
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching weather history:', error instanceof Error ? error.message : error);
        res.status(500).json({ error: 'Failed to retrieve weather history.' });
    }
});

export default router;
