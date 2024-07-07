const Joi = require("joi");



const validateAvailability = (req, res, next) => {
  const schema = Joi.object({
    username : Joi.string().required(),
    passwordHash: Joi.string().required(),
    book_id: Joi.required(),
    availability: Joi.string().valid('Y', 'N').required()
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return;
  }

  next();
};

module.exports = { validateAvailability };