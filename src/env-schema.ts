import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('test', 'development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().integer().default(3001),

  JWT_ACCESS_SIGNING_SECRET: Joi.string().required(),
  JWT_REFRESH_SIGNING_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL_MINUTES: Joi.number().default(15),
  JWT_REFRESH_TOKEN_TTL_HOURS: Joi.number().default(24),

  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().integer().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),

  RUN_MIGRATIONS: Joi.boolean().default(false),
});
