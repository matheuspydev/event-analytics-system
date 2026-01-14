import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const eventLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 1000, // 1000 events per minute
  message: 'Too many events, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit per API key
    return req.headers['x-api-key'] as string || req.ip || 'unknown';
  },
});
