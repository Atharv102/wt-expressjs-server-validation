/**
 * JobApply — Job Controller
 * Handles incoming HTTP requests and structures HTTP responses with standard status codes.
 */

import { jobStore } from '../models/jobApplicationStore.js';

export const jobController = {
  // GET /api/roles
  getRoles(req, res) {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      roles: jobStore.availableRoles,
      qualifications: jobStore.allowedQualifications,
      timestamp: new Date().toISOString()
    });
  },

  // GET /api/applications
  getApplications(req, res) {
    const { search, role } = req.query;
    let list = jobStore.getAll();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(app => 
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q)
      );
    }

    if (role && role !== 'All') {
      list = list.filter(app => app.jobRole === role);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      count: list.length,
      data: list,
      timestamp: new Date().toISOString()
    });
  },

  // GET /api/applications/:id
  getApplicationById(req, res) {
    const { id } = req.params;
    const application = jobStore.getById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        statusMessage: 'Not Found: Application Record Not Located',
        message: `No candidate application found with ID "${id}"`,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: application,
      timestamp: new Date().toISOString()
    });
  },

  // POST /api/applications
  submitApplication(req, res) {
    const newApplication = jobStore.create(req.body);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      statusMessage: 'Created: Application Successfully Validated and Registered',
      message: `Congratulations ${newApplication.fullName}! Your application has passed server-side validation and is registered under ID ${newApplication.id}.`,
      applicationId: newApplication.id,
      data: newApplication,
      timestamp: new Date().toISOString()
    });
  },

  // DELETE /api/applications/:id
  deleteApplication(req, res) {
    const { id } = req.params;
    const deleted = jobStore.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        statusMessage: 'Not Found',
        message: `Application "${id}" could not be deleted because it does not exist.`,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      statusMessage: 'OK: Application Withdrawn / Deleted',
      message: `Application ID ${id} was successfully withdrawn from the recruitment pipeline.`,
      deletedId: id,
      timestamp: new Date().toISOString()
    });
  },

  // GET /api/stats
  getStats(req, res) {
    const stats = jobStore.getStats();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      stats,
      timestamp: new Date().toISOString()
    });
  }
};
