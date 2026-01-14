import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { EventService } from '../services/EventService';
import { EventRepository } from '../repositories/EventRepository';
import { pool } from '../config/database';
import { validate } from '../middlewares/validator';
import { authenticate } from '../middlewares/auth';
import { eventLimiter } from '../middlewares/rateLimiter';
import { createEventSchema, createEventBatchSchema, eventQuerySchema } from '../validators/eventValidator';

const router = Router();

// Initialize dependencies
const eventRepo = new EventRepository(pool);
const eventService = new EventService(eventRepo);
const eventController = new EventController(eventService);

// All event routes require authentication
router.use(authenticate);

router.post('/', eventLimiter, validate(createEventSchema), eventController.createEvent);
router.post('/batch', eventLimiter, validate(createEventBatchSchema), eventController.createEventBatch);
router.get('/', validate(eventQuerySchema, 'query'), eventController.getEvents);

export default router;
