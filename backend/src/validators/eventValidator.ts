import Joi from 'joi';

export const createEventSchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  eventType: Joi.string().min(1).max(255).required(),
  data: Joi.object().required(),
  metadata: Joi.object({
    userAgent: Joi.string().optional(),
    ip: Joi.string().ip().optional(),
  }).optional(),
});

export const createEventBatchSchema = Joi.object({
  events: Joi.array().items(createEventSchema).min(1).max(100).required(),
});

export const eventQuerySchema = Joi.object({
  projectId: Joi.string().uuid().optional(),
  eventType: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  limit: Joi.number().integer().min(1).max(1000).default(100),
  offset: Joi.number().integer().min(0).default(0),
});
