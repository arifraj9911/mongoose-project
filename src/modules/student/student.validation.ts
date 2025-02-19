import Joi from "joi";

// creating schema for joi validator
export const studentValidationSchema = Joi.object({
    id: Joi.string().required().messages({
      "any.required": "ID is required",
    }),

    name: Joi.object({
      firstName: Joi.string().required().messages({
        "any.required": "First Name is required",
      }),
      middleName: Joi.string().optional(),
      lastName: Joi.string()
        .regex(/^[A-Za-z]+$/)
        .required()
        .messages({
          "any.required": "Last Name is required",
          "string.pattern.base": "Last Name must contain only letters",
        }),
    }).required(),

    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),

    avatar: Joi.string().uri().optional(),

    age: Joi.number().integer().min(15).max(40).required().messages({
      "any.required": "Age is required",
      "number.min": "Minimum age should be 15",
      "number.max": "Maximum age should be 40",
    }),

    gender: Joi.string()
      .valid("Male", "Female", "Other")
      .required()
      .messages({
        "any.required": "Gender is required",
        "any.only": "Gender must be Male, Female, or Other",
      }),

    phone: Joi.string()
      .pattern(/^\d{11}$/)
      .required()
      .messages({
        "any.required": "Phone number is required",
        "string.pattern.base": "Phone number must be exactly 11 digits",
      }),

    address: Joi.string().required().messages({
      "any.required": "Address is required",
    }),

    department: Joi.string().required().messages({
      "any.required": "Department is required",
    }),

    rollNumber: Joi.string().required().messages({
      "any.required": "Roll Number is required",
    }),

    registrationNumber: Joi.string().required().messages({
      "any.required": "Registration Number is required",
    }),

    admissionYear: Joi.number()
      .integer()
      .min(2000)
      .max(new Date().getFullYear())
      .required()
      .messages({
        "any.required": "Admission Year is required",
        "number.min": "Admission year must be 2000 or later",
        "number.max": "Admission year cannot be in the future",
      }),

    guardian: Joi.object({
      guardianName: Joi.string().required().messages({
        "any.required": "Guardian Name is required",
      }),
      contact: Joi.string()
        .pattern(/^\d{11}$/)
        .required()
        .messages({
          "any.required": "Guardian Contact is required",
          "string.pattern.base":
            "Guardian phone number must be exactly 11 digits",
        }),
      email: Joi.string().email().optional().messages({
        "string.email": "Invalid email format",
      }),
      address: Joi.string().optional(),
    }).required(),
  });