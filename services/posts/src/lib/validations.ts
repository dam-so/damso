import * as Joi from 'joi';

export const isUrl = (url: string): boolean => {
  return /^https?:\/\//.test(url);
};

export const validEmail = Joi.string()
  .email()
  .required();

export const validPassword = Joi.string()
  .min(6)
  .max(20)
  .required();

export const validDisplayName = Joi.string()
  .regex(/^\S*$/)
  .regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/)
  .required();

export const validNull = Joi.any().allow('', null);

export const validNotNull = Joi.required();
