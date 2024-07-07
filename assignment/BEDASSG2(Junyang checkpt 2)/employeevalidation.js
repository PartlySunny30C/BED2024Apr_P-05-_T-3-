const Joi = require("joi");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    

    const validateUser = (req, res, next) => {
        const schema = Joi.object({
          username: Joi.string().min(3).max(50).required(),
          password: Joi.string().min(3).max(50).required(),
        });
      
        const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body
      
        if (validation.error) {
          const errors = validation.error.details.map((error) => error.message);
          res.status(400).json({ message: "Validation error", errors });
          return; // Terminate middleware execution on validation error
        }
      
        next(); // If validation passes, proceed to the next route handler
      };

    // Check for existing username
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    // ... your database logic here ...

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}