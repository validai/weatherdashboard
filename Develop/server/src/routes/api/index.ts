import { Router } from 'express';

const router = Router();

import weatherRoutes from './weatherRoutes.js';

router.use('/weather', weatherRoutes);
router.use

export default router;
