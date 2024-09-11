const Joi = require('joi');

const creatPostValid = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title should be a type of text',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title should have a minimum length of 3 characters',
      'string.max': 'Title should have a maximum length of 100 characters',
      'any.required': 'Title is a required field',
    }),

  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description should have a minimum length of 10 characters',
      'string.max': 'Description should have a maximum length of 500 characters',
      'any.required': 'Description is a required field',
    }),
    image: Joi.object({
      buffer: Joi.binary().messages({
        'binary.base': 'Image file data must be provided',
    
      }),
      mimetype: Joi.string().regex(/^image\//).messages({
        'string.base': 'Image type must be a string',
        'string.pattern.base': 'Invalid image type',
  
      }),
     
    })
    .messages({
      'object.base': 'Image must be an object',
  
    })
  
        
});

const updatePostValid =Joi.object({
  title: Joi.string()
  .min(3)
  .max(100)
  .messages({
    'string.base': 'Title should be a type of text',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title should have a minimum length of 3 characters',
    'string.max': 'Title should have a maximum length of 100 characters',
  }),

description: Joi.string()
  .min(10)
  .max(500)
  .messages({
    'string.base': 'Description should be a type of text',
    'string.empty': 'Description cannot be empty',
    'string.min': 'Description should have a minimum length of 10 characters',
    'string.max': 'Description should have a maximum length of 500 characters',
  }),


  image: Joi.alternatives().try(
    Joi.object({
      buffer: Joi.binary().messages({
        'binary.base': 'Image file data must be provided as binary',
      }),
      mimetype: Joi.string().regex(/^image\//).messages({
        'string.base': 'Image type must be a string',
        'string.pattern.base': 'Invalid image type',
      }),
    }).messages({
      'object.base': 'Image must be an object containing buffer and mimetype',
    }),
    Joi.string().messages({
      'string.base': 'Image must be a string',
    })
  ).messages({
    'alternatives.base': 'Image must be either an object or a string (like a URL)',
  })
  
})

module.exports= {creatPostValid,updatePostValid};