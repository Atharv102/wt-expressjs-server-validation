/**
 * JobApply — Job Routes Definition
 * Maps HTTP verbs (GET, POST, DELETE) to controller actions and validation middleware.
 */

import { Router } from 'express';
import { jobController } from '../controllers/jobController.js';
import { jobApplicationValidationRules, validateJobApplication } from '../middleware/jobValidator.js';

const router = Router();

// Metadata & Positions
router.get('/roles', jobController.getRoles);

// Aggregate Statistics
router.get('/stats', jobController.getStats);

// Application Collection (Read & Create)
router.get('/applications', jobController.getApplications);
router.post('/applications', jobApplicationValidationRules, validateJobApplication, jobController.submitApplication);

// Application Item (Read & Delete)
router.get('/applications/:id', jobController.getApplicationById);
router.delete('/applications/:id', jobController.deleteApplication);

export default router;
