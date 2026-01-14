import Joi from 'joi';

export const metricsQuerySchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  metricType: Joi.string().optional(),
  timeWindow: Joi.string().valid('1min', '5min', '1h', '1d').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  groupBy: Joi.string().optional(),
});

export const timeSeriesQuerySchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  metricType: Joi.string().required(),
  timeWindow: Joi.string().valid('1min', '5min', '1h', '1d').required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});
