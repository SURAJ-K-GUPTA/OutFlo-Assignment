import { Router } from 'express';
import { messageController } from '../controllers/message.controller';

const router = Router();

// Message generation route
router.post('/personalized-message', messageController.generatePersonalizedMessage);

export default router; 