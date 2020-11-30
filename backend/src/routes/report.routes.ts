import {Router} from 'express';
const router = Router();

import {
    getReports,
    addReport
} from '../controllers/report.controller'

// Report Routes
router.get('/', getReports)
router.post('/', addReport)

export default router