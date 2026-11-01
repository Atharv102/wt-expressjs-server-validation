/**
 * JobApply — Job Application Data Store
 * In-memory repository for storing and managing job candidate applications.
 */

class JobApplicationStore {
  constructor() {
    this.applications = [
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
        coverLetter: 'Passionate MERN stack developer with 2 years of experience building scalable microservices.',
        termsAccepted: true,
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
        coverLetter: 'Experienced backend engineer specialized in high-throughput API gateways and event-driven architectures.',
        termsAccepted: true,
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
        coverLetter: 'AWS certified Solutions Architect with hands-on expertise in container orchestration and GitOps pipelines.',
        termsAccepted: true,
        status: 'Under Review',
        submittedAt: '2026-10-30T11:45:00.000Z'
      }
    ];

    this.availableRoles = [
      { id: 'fs-dev', title: 'Full Stack Developer', department: 'Product Engineering', minExp: 1, openings: 4 },
      { id: 'be-eng', title: 'Backend Node.js Engineer', department: 'Core Platform', minExp: 2, openings: 3 },
      { id: 'fe-eng', title: 'Frontend Engineer', department: 'UI/UX & Web Apps', minExp: 1, openings: 2 },
      { id: 'cloud-devops', title: 'Cloud / DevOps Architect', department: 'Infrastructure', minExp: 2, openings: 2 },
      { id: 'qa-auto', title: 'QA Automation Engineer', department: 'Quality Assurance', minExp: 1, openings: 1 },
      { id: 'data-ml', title: 'Data Scientist / ML Engineer', department: 'Analytics & AI', minExp: 2, openings: 2 }
    ];

    this.allowedQualifications = [
      'B.Tech / B.E. (Computer / IT / EnTC)',
      'M.Tech / M.E. (Computer / IT)',
      'BCA / MCA',
      'B.Sc / M.Sc (Computer Science)',
      'Diploma in Engineering'
    ];
  }

  getAll() {
    return this.applications;
  }

  getById(id) {
    return this.applications.find(app => app.id === id);
  }

  findByEmail(email) {
    return this.applications.find(app => app.email.toLowerCase() === email.toLowerCase());
  }

  create(applicationData) {
    const id = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApplication = {
      id,
      ...applicationData,
      status: 'Under Review',
      submittedAt: new Date().toISOString()
    };
    this.applications.unshift(newApplication);
    return newApplication;
  }

  delete(id) {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return false;
    this.applications.splice(index, 1);
    return true;
  }

  getStats() {
    const total = this.applications.length;
    const avgExp = total > 0 
      ? (this.applications.reduce((acc, curr) => acc + Number(curr.experience), 0) / total).toFixed(1)
      : 0;
    
    const byRole = {};
    for (const app of this.applications) {
      byRole[app.jobRole] = (byRole[app.jobRole] || 0) + 1;
    }

    return {
      totalApplications: total,
      averageExperience: Number(avgExp),
      byRole,
      availableRolesCount: this.availableRoles.length
    };
  }
}

export const jobStore = new JobApplicationStore();

