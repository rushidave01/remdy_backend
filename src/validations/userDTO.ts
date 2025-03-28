import Joi from 'joi';

const loginUserSchema = Joi.object({
  mobile: Joi.number().required(),
});

const verifyUserSchema = Joi.object({
  mobile: Joi.number().required(),
  otp: Joi.string().required().messages({
    "number.base": "OTP must be a number.",
    "any.required": "OTP is required.",
  })
});

const getDoctorsByPostalSchema = Joi.object({
  area: Joi.string().required().messages({
    'string.base': 'area must be a string',
    'any.required':'area is required'
  }),
  building: Joi.string().required().messages({
    'string.base': 'building must be a string',
    'any.required':'building is required'
  }),
  postal_code: Joi.string()
    .pattern(/^\d{5}(-\d{4})?$/) // U.S. ZIP code pattern (e.g., 12345 or 12345-6789)
    .message('Invalid postal code format for the U.S.')
    // .alternatives([
    //   Joi.string().pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/).message('Invalid postal code format for Canada'),
    //   Joi.string().pattern(/^\d{4}$/).message('Invalid postal code format for Australia'),
    //   Joi.string().pattern(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/).message('Invalid postal code format for the U.K.')
    // ])
    .required()
    .messages({
      'string.base': 'postal_code must be a string',
      'any.required': 'postal_code is required'
    }),
  userType: Joi.string().optional()
});

const getDoctorsByIdSchema = Joi.object({
  doctor_id: Joi.number().required().messages({
    'string.base': 'doctor_id must be a number',
    'any.required':'doctor_id is required'
  }),
});

const getHospitalByIdSchema = Joi.object({
  hospital_id: Joi.number().required().messages({
    'string.base': 'hospital_id must be a number',
    'any.required':'hospital_id is required'
  }),
});

const locationSchema = Joi.object({
  latitude: Joi
      // .number()
      // .min(-180)
      // .max(180)
      .string()
      .pattern(/^[+-]?(\d+(\.\d*)?|\.\d+)$/)
      .required()
      .messages({
          // 'number.min': 'Longitude must be between -180 and 180.',
          // 'number.max': 'Longitude must be between -180 and 180.',
          'any.required': 'Longitude is required.',
          'number.base': 'Longitude must be a number string.',
      }),
  longitude: Joi
      // .number()
      // .min(-180)
      // .max(180)
      .string()
      .pattern(/^[+-]?(\d+(\.\d*)?|\.\d+)$/)
      .required()
      .messages({
          // 'number.min': 'Longitude must be between -180 and 180.',
          // 'number.max': 'Longitude must be between -180 and 180.',
          'any.required': 'Longitude is required.',
          'number.base': 'Longitude must be a number string.',
      }),
});

export {
  locationSchema,
  getHospitalByIdSchema, 
  getDoctorsByIdSchema,
  loginUserSchema, 
  verifyUserSchema,
  getDoctorsByPostalSchema
}