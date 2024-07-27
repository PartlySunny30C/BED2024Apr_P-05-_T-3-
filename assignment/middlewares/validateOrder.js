const Joi = require("joi");

const validateOrder = (req, res, next) => {
  const schema = Joi.object({
      status: Joi.string().valid("Pending", "Delivering", "Delivered").required(),
      manager: Joi.string().min(3).max(50),
      branch_number: Joi.number().integer().min(1),
      items: Joi.array().items(
          Joi.object({
              item_name: Joi.string().min(3).max(50),
              quantity: Joi.number().integer().min(1)
          })
      ).min(1)
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      return res.status(400).json({ message: "Validation error", errors });
  }

  next();
};

module.exports = validateOrder;