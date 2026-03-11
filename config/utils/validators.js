const Joi = require('joi');

const signupSchema = Joi.object({
    fullName: Joi.string().min(3).required().messages({
        'string.empty': 'Naam likhna zaroori hai',
        'string.min': 'Naam kam se kam 3 characters ka ho'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email sahi format mein nahi hai'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password kam se kam 8 digits ka hona chahiye'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { signupSchema, loginSchema };