import { Router } from 'express';
import historyService from '../../service/historyService.ts';
import weatherService from '../../service/weatherService.ts';
const router = Router();
// Weather data route
router.post('/', async (req, res) => {
    try {
        const city = req.body.city;
        const weatherSvc = weatherService.createWeatherService(city);
        const weatherData = await weatherSvc.getWeatherForCity(city);
        await historyService.addCity(city);
        res.json(weatherData);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
// History routes - moved outside the POST handler
router.get('/history', async (_req, res) => {
    try {
        const cities = await historyService.getCities();
        res.json(cities);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});
router.delete('/history/:id', async (req, res) => {
    try {
        await historyService.removeCity(req.params.id);
        res.json({ message: 'Search deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete history item' });
    }
});
export default router;
