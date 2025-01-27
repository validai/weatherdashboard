import { Router } from 'express';
import apiRoutes from './api/index';
import htmlRoutes from './htmlRoutes';

const router = Router();

// Use API routes for '/api'
router.use('/api', apiRoutes);

// Use HTML routes for '/'
router.use('/', htmlRoutes);

export default router;
