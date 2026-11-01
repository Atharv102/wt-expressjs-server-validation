/**
 * JobApply — Server-Side Validation Middleware
 * Uses express-validator and custom sanitizers for strict input integrity.
 */

import { body, validationResult } from 'express-validator';
import { jobStore } from '../models/jobApplicationStore.js';

export const jobApplicationValidationRules = [
  // 1. Full Name
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full Name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Full Name must be between 3 and 50 characters')
    .matches(/^[A-Za-z]+([ A-Za-z.'-]+)*$/).withMessage('Full Name must only contain letters, spaces, hyphens, or dots'),

  // 2. Email Address
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address (e.g., candidate@example.com)')
    .normalizeEmail()
    .custom((email, { req }) => {
      // Check if candidate already applied with this email
      const existing = jobStore.findByEmail(email);
      if (existing) {
        throw new Error(`An application with email "${email}" has already been submitted (ID: ${existing.id})`);
      }
      return true;
    }),

  // 3. Contact Phone Number
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Phone number must be a valid 10-digit Indian mobile number starting with 6-9'),

  // 4. Date of Birth & Age validation (>= 18 and <= 65)
  body('dob')
    .trim()
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().withMessage('Date of Birth must be in YYYY-MM-DD format')
    .custom((dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        throw new Error('Invalid date provided');
      }
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new Error(`Applicant must be at least 18 years old (Current age calculated: ${age} years)`);
      }
      if (age > 65) {
        throw new Error(`Applicant age exceeds the maximum limit of 65 years (Current age calculated: ${age} years)`);
      }
      return true;
    }),

  // 5. Job Role
  body('jobRole')
    .trim()
    .notEmpty().withMessage('Job Role must be selected')
    .custom((role) => {
      const validTitles = jobStore.availableRoles.map(r => r.title);
      if (!validTitles.includes(role)) {
        throw new Error(`Invalid Job Role selected. Must be one of: ${validTitles.join(', ')}`);
      }
      return true;
    }),

  // 6. Educational Qualification
  body('qualification')
    .trim()
    .notEmpty().withMessage('Educational Qualification is required')
    .custom((qual) => {
      if (!jobStore.allowedQualifications.includes(qual)) {
        throw new Error('Invalid educational qualification selected from the permitted degrees');
      }
      return true;
    }),

  // 7. Total Relevant Experience (Years)
  body('experience')
    .notEmpty().withMessage('Years of experience is required')
    .isFloat({ min: 0, max: 40 }).withMessage('Experience must be a positive number between 0 and 40 years'),

  // 8. Key Technical Skills
  body('skills')
    .trim()
    .notEmpty().withMessage('Technical Skills are required')
    .isLength({ min: 3, max: 200 }).withMessage('Skills summary must be between 3 and 200 characters')
    .custom((val) => {
      const items = val.split(',').map(s => s.trim()).filter(Boolean);
      if (items.length < 2) {
        throw new Error('Please specify at least 2 comma-separated technical skills (e.g., JavaScript, Node.js)');
      }
      return true;
    }),

  // 9. Portfolio / GitHub URL (Optional, but must be valid if provided)
  body('portfolioUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Portfolio URL must be a valid web link starting with http:// or https://'),

  // 10. Cover Letter / Brief Summary (Optional, max 500 characters)
  body('coverLetter')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cover letter must not exceed 500 characters'),

  // 11. Terms & Declarations
  body('termsAccepted')
    .custom((val) => {
      if (val === true || val === 'true' || val === 1 || val === 'on') {
        return true;
      }
      throw new Error('You must accept the terms, code of conduct, and accuracy declaration to apply');
    })
];

/**
 * Middleware to intercept validation errors and respond with HTTP 400 Bad Request
 */
export const validateJobApplication = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      value: err.value,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      statusCode: 400,
      statusMessage: 'Bad Request: Server-Side Validation Failed',
      errorCount: formattedErrors.length,
      errors: formattedErrors,
      timestamp: new Date().toISOString()
    });
  }

  // Sanitize numerical fields
  req.body.experience = parseFloat(req.body.experience);
  req.body.termsAccepted = true;
  next();
};
