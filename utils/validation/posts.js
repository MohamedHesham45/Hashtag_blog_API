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

  tags: Joi.array()
    .items(Joi.string().messages({
      'string.base': 'Each tag should be a type of text',
    }))
    .max(10)
    .messages({
      'array.base': 'Tags should be an array of strings',
      'array.max': 'Tags cannot contain more than 10 items',
    }),
    image: Joi.object({
      buffer: Joi.binary().required().messages({
        'binary.base': 'Image file data must be provided',
        'any.required': 'Image file is required'
      }),
      mimetype: Joi.string().regex(/^image\//).required().messages({
        'string.base': 'Image type must be a string',
        'string.pattern.base': 'Invalid image type',
        'any.required': 'Image type is required'
      }),
      
    }).required()
    .messages({
      'object.base': 'Image must be an object',
      'any.required': 'Image is a required field'
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

tags: Joi.array()
  .items(Joi.string().messages({
    'string.base': 'Each tag should be a type of text',
  }))
  .max(10)
  .messages({
    'array.base': 'Tags should be an array of strings',
    'array.max': 'Tags cannot contain more than 10 items',
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
})

module.exports= {creatPostValid,updatePostValid};