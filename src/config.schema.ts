import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({

  SERVER_HOST_URI: Joi.string().required(),
  SERVER_HOST_PORT: Joi.string().required(),
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRECT_ACCESS: Joi.string().required(),
  NODE_ENV: Joi.string().valid('development', 'production')
  .default('development'),
  
});