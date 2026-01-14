import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional().allow('', null),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(1000).optional().allow('', null),
}).min(1);

export const projectIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
