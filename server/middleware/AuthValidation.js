const Joi = require('joi');


const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),

    // 👇 ADD THIS
    role: Joi.string()
      .valid("jobseeker", "employer")
      .optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};


const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    role: Joi.string().optional().allow(null, "") // 👈 Allow role field to be optional/empty
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation
};
