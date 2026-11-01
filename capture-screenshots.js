/**
 * JobApply — Automated Screenshot Generator
 * Launches Express server, navigates via Puppeteer, and captures high-res figures for the report.
 */

import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './server.js';
import { jobStore } from './models/jobApplicationStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Resetting store applications to pristine state...');
  jobStore.applications = [
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

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1.5 });

  try {
    // 1. Landing Page
    console.log('Capturing Figure 1: Landing Page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig1_landing.png') });

    // 2. Trigger Multi-Field Server Validation Errors (HTTP 400 Bad Request)
    console.log('Capturing Figure 2: Validation Errors (400 Bad Request)...');
    await page.click('#btnFillErrors');
    await page.click('#btnSubmit');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig2_validation_errors.png') });

    // 3. Trigger Valid Senior Dev Submission (HTTP 201 Created)
    console.log('Capturing Figure 3: Valid Candidate Pass (201 Created)...');
    await page.click('#btnFillValid');
    await page.click('#btnSubmit');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig3_success_pass.png') });

    // 4. Registered Applicants Registry Table (Tab 2)
    console.log('Capturing Figure 4: Registered Applicants Registry...');
    await page.click('[data-tab="tabRegistry"]');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig4_attendees_list.png') });

    // 5. Validation Rules Matrix (Tab 3)
    console.log('Capturing Figure 5: Server-Side Validation Rules Matrix...');
    await page.click('[data-tab="tabMatrix"]');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig5_validation_guide.png') });

    console.log('All 5 high-resolution figures captured successfully!');
  } finally {
    await browser.close();
    process.exit(0);
  }
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
