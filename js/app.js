/**
 * JobApply — Client Application & API Bridge
 * Connects frontend form to ExpressJS Server-Side Validation Endpoints.
 * Includes fallback simulator for GitHub Pages static deployment.
 */

// Global State
let applicationsData = [];
let isLiveServer = false;

// DOM Elements
const form = document.getElementById('jobApplicationForm');
const btnSubmit = document.getElementById('btnSubmit');
const submitSpinner = document.getElementById('submitSpinner');
const responseStatusBadge = document.getElementById('responseStatusBadge');
const responseAlertBanner = document.getElementById('responseAlertBanner');
const alertHeading = document.getElementById('alertHeading');
const alertText = document.getElementById('alertText');
const alertErrorList = document.getElementById('alertErrorList');
const jsonResponseDisplay = document.getElementById('jsonResponseDisplay');
const serverStatusText = document.getElementById('serverStatusText');
const serverStatusBadge = document.getElementById('serverStatusBadge');
const applicationsTableBody = document.getElementById('applicationsTableBody');
const tabCount = document.getElementById('tabCount');
const statTotalApps = document.getElementById('statTotalApps');
const statAvgExp = document.getElementById('statAvgExp');

// Preset Buttons
const btnFillValid = document.getElementById('btnFillValid');
const btnFillFresher = document.getElementById('btnFillFresher');
const btnFillErrors = document.getElementById('btnFillErrors');
const btnClearForm = document.getElementById('btnClearForm');
const btnCopyJson = document.getElementById('btnCopyJson');
const btnRefreshRegistry = document.getElementById('btnRefreshRegistry');
const registrySearch = document.getElementById('registrySearch');
const registryRoleFilter = document.getElementById('registryRoleFilter');

// Tab Buttons
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Initial Setup
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupPresets();
  setupEventListeners();
  await checkServerHealth();
  await loadApplications();
});

// Tab Switcher
function setupTabs() {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// Check if Express backend is running
async function checkServerHealth() {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      isLiveServer = true;
      serverStatusText.textContent = 'Express Server Online';
      serverStatusBadge.querySelector('.status-indicator').classList.add('online');
      return;
    }
  } catch (e) {
    // Fallback: Running on GitHub Pages or static host
    isLiveServer = false;
    serverStatusText.textContent = 'Express Simulator (Static Demo)';
    serverStatusBadge.querySelector('.status-indicator').classList.add('online');
  }
}

// Load applications from server or local seed
async function loadApplications() {
  if (isLiveServer) {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        applicationsData = data.data;
        renderApplicationsTable(applicationsData);
        updateStats();
        return;
      }
    } catch (e) {
      console.warn('API fetch failed, falling back to local memory store', e);
    }
  }

  // Fallback initial data
  if (applicationsData.length === 0) {
    applicationsData = [
      {
        id: 'APP-1001',
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '9823456781',
        dob: '2001-05-14',
        jobRole: 'Full Stack Developer',
        qualification: 'B.Tech / B.E. (Computer / IT / EnTC)',
        experience: 2,
        skills: 'JavaScript, Node.js, Express, React, MongoDB',
        portfolioUrl: 'https://aarav-portfolio.dev',
        status: 'Under Review',
        submittedAt: '2026-10-28T09:30:00.000Z'
      },
      {
        id: 'APP-1002',
        fullName: 'Priya Deshmukh',
        email: 'priya.deshmukh@example.org',
        phone: '9890123456',
        dob: '1999-08-22',
        jobRole: 'Backend Node.js Engineer',
        qualification: 'M.Tech / M.E. (Computer / IT)',
        experience: 4,
        skills: 'Node.js, Express.js, PostgreSQL, Redis, Docker, Kafka',
        portfolioUrl: 'https://github.com/priyadeshmukh',
        status: 'Shortlisted',
        submittedAt: '2026-10-29T14:15:00.000Z'
      },
      {
        id: 'APP-1003',
        fullName: 'Rohan Patil',
        email: 'rohan.patil@example.com',
        phone: '9765432109',
        dob: '2002-11-03',
        jobRole: 'Cloud / DevOps Architect',
        qualification: 'B.Tech / B.E. (Computer / IT / EnTC)',
        experience: 1,
        skills: 'AWS, Kubernetes, Terraform, CI/CD, Linux, Docker',
        portfolioUrl: 'https://rohanpatil.cloud',
        status: 'Under Review',
        submittedAt: '2026-10-30T11:45:00.000Z'
      }
    ];
  }

  renderApplicationsTable(applicationsData);
  updateStats();
}

// Render Registry Table
function renderApplicationsTable(list) {
  applicationsTableBody.innerHTML = '';
  tabCount.textContent = list.length;

  if (list.length === 0) {
    applicationsTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">
          No candidates match your search filter.
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(app => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="app-id-tag">${escapeHtml(app.id)}</span></td>
      <td>
        <div style="font-weight: 600; color: #fff;">${escapeHtml(app.fullName)}</div>
        <div style="font-size: 0.68rem; color: var(--text-muted);">${escapeHtml(app.email)} | ${escapeHtml(app.phone)}</div>
      </td>
      <td>
        <div>${escapeHtml(app.jobRole)}</div>
        <div style="font-size: 0.68rem; color: var(--text-dim);">${escapeHtml(app.qualification || '')}</div>
      </td>
      <td>${app.experience} yrs</td>
      <td>
        <span class="status-badge ${app.status === 'Shortlisted' ? 'status-shortlisted' : 'status-review'}">
          ${escapeHtml(app.status || 'Under Review')}
        </span>
      </td>
      <td>
        <button type="button" class="btn-action-delete" data-id="${app.id}">Withdraw</button>
      </td>
    `;
    applicationsTableBody.appendChild(tr);
  });

  // Attach delete handlers
  document.querySelectorAll('.btn-action-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      await deleteApplication(id);
    });
  });
}

// Delete Application
async function deleteApplication(id) {
  if (!confirm(`Are you sure you want to withdraw application ${id}?`)) return;

  if (isLiveServer) {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        displayResponse(200, data);
        await loadApplications();
        return;
      }
    } catch (e) {
      console.warn('Live delete failed, using simulator', e);
    }
  }

  // Fallback simulator delete
  applicationsData = applicationsData.filter(a => a.id !== id);
  displayResponse(200, {
    success: true,
    statusCode: 200,
    statusMessage: 'OK: Application Withdrawn / Deleted',
    message: `Application ID ${id} was successfully withdrawn from the recruitment pipeline.`,
    deletedId: id,
    timestamp: new Date().toISOString()
  });
  renderApplicationsTable(applicationsData);
  updateStats();
}

// Update Portal Metric Cards
function updateStats() {
  statTotalApps.textContent = applicationsData.length;
  if (applicationsData.length > 0) {
    const totalExp = applicationsData.reduce((acc, curr) => acc + Number(curr.experience || 0), 0);
    statAvgExp.textContent = (totalExp / applicationsData.length).toFixed(1) + ' yrs';
  } else {
    statAvgExp.textContent = '0 yrs';
  }
}

// Form Submission Event
function setupEventListeners() {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();
    setSubmitting(true);

    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      dob: document.getElementById('dob').value.trim(),
      jobRole: document.getElementById('jobRole').value.trim(),
      qualification: document.getElementById('qualification').value.trim(),
      experience: document.getElementById('experience').value.trim(),
      skills: document.getElementById('skills').value.trim(),
      portfolioUrl: document.getElementById('portfolioUrl').value.trim(),
      coverLetter: document.getElementById('coverLetter').value.trim(),
      termsAccepted: document.getElementById('termsAccepted').checked
    };

    if (isLiveServer) {
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        handleServerResponse(res.status, data);
        setSubmitting(false);
        return;
      } catch (err) {
        console.warn('Network error reaching live server, falling back to simulator', err);
      }
    }

    // Static Host / GitHub Pages Simulator (Express-Validator simulation)
    setTimeout(() => {
      const { status, body } = simulateExpressValidation(formData);
      handleServerResponse(status, body);
      setSubmitting(false);
    }, 250);
  });

  // Filter and Search
  registrySearch.addEventListener('input', applyRegistryFilters);
  registryRoleFilter.addEventListener('change', applyRegistryFilters);
  btnRefreshRegistry.addEventListener('click', loadApplications);

  // Copy JSON Button
  btnCopyJson.addEventListener('click', () => {
    navigator.clipboard.writeText(jsonResponseDisplay.textContent);
    btnCopyJson.textContent = 'Copied!';
    setTimeout(() => { btnCopyJson.textContent = 'Copy JSON'; }, 1500);
  });
}

function applyRegistryFilters() {
  const query = registrySearch.value.toLowerCase().trim();
  const role = registryRoleFilter.value;

  const filtered = applicationsData.filter(app => {
    const matchesQuery = !query || 
      app.fullName.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.id.toLowerCase().includes(query);

    const matchesRole = (role === 'All') || (app.jobRole === role);
    return matchesQuery && matchesRole;
  });

  renderApplicationsTable(filtered);
}

// Handle HTTP Status Code and Response JSON
function handleServerResponse(statusCode, data) {
  displayResponse(statusCode, data);

  // Switch to Server Response tab automatically
  const tabResponseBtn = document.querySelector('[data-tab="tabResponse"]');
  if (tabResponseBtn) tabResponseBtn.click();

  if (statusCode === 201) {
    // Success: 201 Created
    responseStatusBadge.className = 'status-pill-badge status-201';
    responseStatusBadge.innerHTML = '<span class="badge-code">201 CREATED</span><span>Validation Passed</span>';

    responseAlertBanner.className = 'alert-banner alert-success';
    responseAlertBanner.style.display = 'flex';
    alertHeading.textContent = 'HTTP 201 Created — Application Registered';
    alertText.textContent = data.message;
    alertErrorList.innerHTML = '';

    // If simulating, append to store
    if (!isLiveServer && data.data) {
      applicationsData.unshift(data.data);
      renderApplicationsTable(applicationsData);
      updateStats();
    } else if (isLiveServer) {
      loadApplications();
    }

    // Reset Form
    form.reset();
  } else if (statusCode === 400) {
    // Bad Request: Validation Errors
    responseStatusBadge.className = 'status-pill-badge status-400';
    responseStatusBadge.innerHTML = '<span class="badge-code">400 BAD REQUEST</span><span>Validation Failed</span>';

    responseAlertBanner.className = 'alert-banner alert-danger';
    responseAlertBanner.style.display = 'flex';
    alertHeading.textContent = `HTTP 400 Bad Request — Server-Side Validation Failed (${data.errorCount} Error${data.errorCount > 1 ? 's' : ''})`;
    alertText.textContent = 'The ExpressJS validator intercepted invalid payload fields. Review the field-level errors below:';

    alertErrorList.innerHTML = '';
    if (data.errors && Array.isArray(data.errors)) {
      data.errors.forEach(err => {
        // Highlight form field
        const group = document.getElementById(`group_${err.field}`);
        const errMsg = document.getElementById(`err_${err.field}`);
        if (group) group.classList.add('has-error');
        if (errMsg) errMsg.textContent = `✖ ${err.message}`;

        // Add to alert list
        const li = document.createElement('li');
        li.innerHTML = `<strong>${escapeHtml(err.field)}:</strong> ${escapeHtml(err.message)}`;
        alertErrorList.appendChild(li);
      });
    }
  }
}

// Display JSON Payload in Terminal
function displayResponse(statusCode, data) {
  jsonResponseDisplay.textContent = JSON.stringify(data, null, 2);
}

// Clear all form error highlights
function clearAllErrors() {
  document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error', 'is-valid'));
  document.querySelectorAll('.field-error-msg').forEach(el => el.textContent = '');
  responseAlertBanner.style.display = 'none';
}

function setSubmitting(isSubmitting) {
  btnSubmit.disabled = isSubmitting;
  submitSpinner.style.display = isSubmitting ? 'inline-block' : 'none';
}

// Presets Handler
function setupPresets() {
  // Preset 1: Valid Senior Developer (Atharv Jadhav)
  btnFillValid.addEventListener('click', () => {
    clearAllErrors();
    document.getElementById('fullName').value = 'Atharv Jadhav';
    document.getElementById('email').value = 'atharv.jadhav@engineer.dev';
    document.getElementById('phone').value = '9823456789';
    document.getElementById('dob').value = '2002-04-18';
    document.getElementById('jobRole').value = 'Full Stack Developer';
    document.getElementById('qualification').value = 'B.Tech / B.E. (Computer / IT / EnTC)';
    document.getElementById('experience').value = '3';
    document.getElementById('skills').value = 'Node.js, Express.js, React, PostgreSQL, Docker, AWS';
    document.getElementById('portfolioUrl').value = 'https://github.com/Atharv102';
    document.getElementById('coverLetter').value = 'Computer Engineering student at MIT AOE with 3 years of hands-on full-stack development experience.';
    document.getElementById('termsAccepted').checked = true;
  });

  // Preset 2: Valid Fresher Candidate
  btnFillFresher.addEventListener('click', () => {
    clearAllErrors();
    document.getElementById('fullName').value = 'Sneha Kulkarni';
    document.getElementById('email').value = 'sneha.kulkarni@freshgrad.in';
    document.getElementById('phone').value = '8765432190';
    document.getElementById('dob').value = '2005-02-10';
    document.getElementById('jobRole').value = 'Frontend Engineer';
    document.getElementById('qualification').value = 'BCA / MCA';
    document.getElementById('experience').value = '0';
    document.getElementById('skills').value = 'HTML5, CSS3, JavaScript, React, Tailwind CSS';
    document.getElementById('portfolioUrl').value = 'https://sneha-portfolio.me';
    document.getElementById('coverLetter').value = 'Passionate frontend fresher with strong foundation in responsive web design and component state architecture.';
    document.getElementById('termsAccepted').checked = true;
  });

  // Preset 3: Trigger Multi-Field Server Validation Errors
  btnFillErrors.addEventListener('click', () => {
    clearAllErrors();
    document.getElementById('fullName').value = 'Al'; // Too short (< 3 chars)
    document.getElementById('email').value = 'aarav.sharma@example.com'; // Duplicate candidate email!
    document.getElementById('phone').value = '1234567'; // Invalid phone (< 10 digits and starts with 1)
    document.getElementById('dob').value = '2015-01-01'; // Underage (age ~11 years < 18)
    document.getElementById('jobRole').value = ''; // Empty role
    document.getElementById('qualification').value = ''; // Empty degree
    document.getElementById('experience').value = '-5'; // Negative experience (< 0)
    document.getElementById('skills').value = 'OnlyOneSkill'; // Less than 2 skills
    document.getElementById('portfolioUrl').value = 'invalid-url-without-protocol'; // Invalid URL format
    document.getElementById('coverLetter').value = '';
    document.getElementById('termsAccepted').checked = false; // Terms not accepted
  });

  // Preset 4: Reset Form
  btnClearForm.addEventListener('click', () => {
    form.reset();
    clearAllErrors();
    responseStatusBadge.className = 'status-pill-badge';
    responseStatusBadge.innerHTML = '<span class="badge-code">READY</span><span>Awaiting Submission</span>';
    jsonResponseDisplay.textContent = '{\n  "status": "IDLE",\n  "message": "Form reset. Select a scenario or enter candidate details to test Express validation."\n}';
  });
}

// Fallback Express-Validator Simulation Engine (for GitHub Pages static hosting)
function simulateExpressValidation(body) {
  const errors = [];

  // 1. fullName
  const name = (body.fullName || '').trim();
  if (!name) {
    errors.push({ field: 'fullName', value: name, message: 'Full Name is required' });
  } else if (name.length < 3 || name.length > 50) {
    errors.push({ field: 'fullName', value: name, message: 'Full Name must be between 3 and 50 characters' });
  } else if (!/^[A-Za-z]+([ A-Za-z.'-]+)*$/.test(name)) {
    errors.push({ field: 'fullName', value: name, message: 'Full Name must only contain letters, spaces, hyphens, or dots' });
  }

  // 2. email
  const email = (body.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push({ field: 'email', value: email, message: 'Email address is required' });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: 'email', value: email, message: 'Please enter a valid email address (e.g., candidate@example.com)' });
  } else {
    const existing = applicationsData.find(a => a.email.toLowerCase() === email);
    if (existing) {
      errors.push({ field: 'email', value: email, message: `An application with email "${email}" has already been submitted (ID: ${existing.id})` });
    }
  }

  // 3. phone
  const phone = (body.phone || '').trim();
  if (!phone) {
    errors.push({ field: 'phone', value: phone, message: 'Phone number is required' });
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.push({ field: 'phone', value: phone, message: 'Phone number must be a valid 10-digit Indian mobile number starting with 6-9' });
  }

  // 4. dob
  const dob = (body.dob || '').trim();
  if (!dob) {
    errors.push({ field: 'dob', value: dob, message: 'Date of Birth is required' });
  } else {
    const bDate = new Date(dob);
    if (isNaN(bDate.getTime())) {
      errors.push({ field: 'dob', value: dob, message: 'Date of Birth must be in YYYY-MM-DD format' });
    } else {
      const today = new Date();
      let age = today.getFullYear() - bDate.getFullYear();
      const m = today.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) age--;

      if (age < 18) {
        errors.push({ field: 'dob', value: dob, message: `Applicant must be at least 18 years old (Current age calculated: ${age} years)` });
      } else if (age > 65) {
        errors.push({ field: 'dob', value: dob, message: `Applicant age exceeds the maximum limit of 65 years (Current age calculated: ${age} years)` });
      }
    }
  }

  // 5. jobRole
  const allowedRoles = [
    'Full Stack Developer',
    'Backend Node.js Engineer',
    'Frontend Engineer',
    'Cloud / DevOps Architect',
    'QA Automation Engineer',
    'Data Scientist / ML Engineer'
  ];
  if (!body.jobRole) {
    errors.push({ field: 'jobRole', value: body.jobRole, message: 'Job Role must be selected' });
  } else if (!allowedRoles.includes(body.jobRole)) {
    errors.push({ field: 'jobRole', value: body.jobRole, message: 'Invalid Job Role selected' });
  }

  // 6. qualification
  const allowedQualifications = [
    'B.Tech / B.E. (Computer / IT / EnTC)',
    'M.Tech / M.E. (Computer / IT)',
    'BCA / MCA',
    'B.Sc / M.Sc (Computer Science)',
    'Diploma in Engineering'
  ];
  if (!body.qualification) {
    errors.push({ field: 'qualification', value: body.qualification, message: 'Educational Qualification is required' });
  } else if (!allowedQualifications.includes(body.qualification)) {
    errors.push({ field: 'qualification', value: body.qualification, message: 'Invalid educational qualification selected from the permitted degrees' });
  }

  // 7. experience
  const expNum = parseFloat(body.experience);
  if (body.experience === '' || isNaN(expNum)) {
    errors.push({ field: 'experience', value: body.experience, message: 'Years of experience is required' });
  } else if (expNum < 0 || expNum > 40) {
    errors.push({ field: 'experience', value: body.experience, message: 'Experience must be a positive number between 0 and 40 years' });
  }

  // 8. skills
  const skills = (body.skills || '').trim();
  if (!skills) {
    errors.push({ field: 'skills', value: skills, message: 'Technical Skills are required' });
  } else {
    const list = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length < 2) {
      errors.push({ field: 'skills', value: skills, message: 'Please specify at least 2 comma-separated technical skills (e.g., JavaScript, Node.js)' });
    }
  }

  // 9. portfolioUrl
  if (body.portfolioUrl) {
    const url = body.portfolioUrl.trim();
    if (!/^https?:\/\/.+\..+/.test(url)) {
      errors.push({ field: 'portfolioUrl', value: url, message: 'Portfolio URL must be a valid web link starting with http:// or https://' });
    }
  }

  // 10. termsAccepted
  if (!body.termsAccepted) {
    errors.push({ field: 'termsAccepted', value: false, message: 'You must accept the terms, code of conduct, and accuracy declaration to apply' });
  }

  // Result Evaluation
  if (errors.length > 0) {
    return {
      status: 400,
      body: {
        success: false,
        statusCode: 400,
        statusMessage: 'Bad Request: Server-Side Validation Failed',
        errorCount: errors.length,
        errors,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Valid -> 201 Created
  const newId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
  const record = {
    id: newId,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    dob: body.dob,
    jobRole: body.jobRole,
    qualification: body.qualification,
    experience: parseFloat(body.experience),
    skills: body.skills,
    portfolioUrl: body.portfolioUrl || '',
    coverLetter: body.coverLetter || '',
    termsAccepted: true,
    status: 'Under Review',
    submittedAt: new Date().toISOString()
  };

  return {
    status: 201,
    body: {
      success: true,
      statusCode: 201,
      statusMessage: 'Created: Application Successfully Validated and Registered',
      message: `Congratulations ${record.fullName}! Your application has passed server-side validation and is registered under ID ${record.id}.`,
      applicationId: record.id,
      data: record,
      timestamp: new Date().toISOString()
    }
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
