/**
 * JobApply — Automated Integration & Validation Test Suite
 * Tests ExpressJS routes, express-validator chains, and status codes.
 */

import assert from 'assert/strict';
import http from 'http';
import app from '../server.js';

let server;
let port;

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   RUNNING JOBAPPLY EXPRESSJS VALIDATION TEST SUITE   ');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✔ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✖ FAIL: ${name}`);
      console.error(`    -> ${err.message}`);
      failed++;
    }
  }

  // Start test server on random port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });

  try {
    // 1. Health check
    await test('T1: GET /api/health returns 200 OK with ONLINE status', async () => {
      const res = await request('GET', '/api/health');
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.status, 'ONLINE');
    });

    // 2. Roles list
    await test('T2: GET /api/roles returns 200 OK and 6 active engineering positions', async () => {
      const res = await request('GET', '/api/roles');
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.roles.length, 6);
      assert.ok(res.body.qualifications.length >= 5);
    });

    // 3. Stats
    await test('T3: GET /api/stats returns 200 OK with aggregation metrics', async () => {
      const res = await request('GET', '/api/stats');
      assert.equal(res.statusCode, 200);
      assert.ok(typeof res.body.stats.totalApplications === 'number');
      assert.ok(typeof res.body.stats.averageExperience === 'number');
    });

    // 4. Applications List
    await test('T4: GET /api/applications returns 200 OK with candidate array', async () => {
      const res = await request('GET', '/api/applications');
      assert.equal(res.statusCode, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 3);
    });

    // 5. Valid Candidate Application Submission (201 Created)
    let createdAppId = null;
    await test('T5: POST /api/applications (Valid Candidate) returns 201 Created', async () => {
      const validPayload = {
        fullName: 'Atharv Jadhav',
        email: 'atharv.jadhav.unique@mitcoe.ac.in',
        phone: '9823456789',
        dob: '2002-04-18',
        jobRole: 'Full Stack Developer',
        qualification: 'B.Tech / B.E. (Computer / IT / EnTC)',
        experience: 3,
        skills: 'JavaScript, Node.js, Express, React, PostgreSQL',
        portfolioUrl: 'https://github.com/Atharv102',
        coverLetter: 'Computer Engineering student with strong hands-on backend expertise.',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', validPayload);
      assert.equal(res.statusCode, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.applicationId.startsWith('APP-'));
      createdAppId = res.body.applicationId;
    });

    // 6. Duplicate Email Check (400 Bad Request)
    await test('T6: POST /api/applications (Duplicate Email) returns 400 Bad Request', async () => {
      const duplicatePayload = {
        fullName: 'Atharv Jadhav Clone',
        email: 'atharv.jadhav.unique@mitcoe.ac.in', // same email
        phone: '9823456789',
        dob: '2002-04-18',
        jobRole: 'Full Stack Developer',
        qualification: 'B.Tech / B.E. (Computer / IT / EnTC)',
        experience: 3,
        skills: 'JavaScript, Node.js',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', duplicatePayload);
      assert.equal(res.statusCode, 400);
      assert.equal(res.body.success, false);
      const emailErr = res.body.errors.find(e => e.field === 'email');
      assert.ok(emailErr);
      assert.match(emailErr.message, /already been submitted/i);
    });

    // 7. Full Name Validation (Empty & Length < 3)
    await test('T7: POST /api/applications (Name Too Short) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'Al',
        email: 'al.short@example.com',
        phone: '9823456789',
        dob: '2001-01-01',
        jobRole: 'Frontend Engineer',
        qualification: 'BCA / MCA',
        experience: 1,
        skills: 'React, Redux',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'fullName');
      assert.ok(err);
      assert.match(err.message, /between 3 and 50 characters/i);
    });

    // 8. Invalid Email Format
    await test('T8: POST /api/applications (Invalid Email RFC) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'John Doe',
        email: 'invalid-email-no-at-sign.com',
        phone: '9823456789',
        dob: '2001-01-01',
        jobRole: 'Frontend Engineer',
        qualification: 'BCA / MCA',
        experience: 1,
        skills: 'React, Redux',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'email');
      assert.ok(err);
      assert.match(err.message, /valid email address/i);
    });

    // 9. Phone Number Validation (Must start with 6-9, 10 digits)
    await test('T9: POST /api/applications (Invalid Mobile 1234567) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'John Doe',
        email: 'valid.phone.test@example.com',
        phone: '1234567',
        dob: '2001-01-01',
        jobRole: 'Frontend Engineer',
        qualification: 'BCA / MCA',
        experience: 1,
        skills: 'React, Redux',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'phone');
      assert.ok(err);
      assert.match(err.message, /10-digit Indian mobile number/i);
    });

    // 10. Age Validation (< 18 years old)
    await test('T10: POST /api/applications (Underage Applicant < 18) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'Minor Applicant',
        email: 'minor@example.com',
        phone: '9823456789',
        dob: '2016-01-01', // Age ~10 years
        jobRole: 'Frontend Engineer',
        qualification: 'BCA / MCA',
        experience: 0,
        skills: 'HTML, CSS',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'dob');
      assert.ok(err);
      assert.match(err.message, /at least 18 years old/i);
    });

    // 11. Invalid Job Role
    await test('T11: POST /api/applications (Unlisted Job Role) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '9823456789',
        dob: '2000-01-01',
        jobRole: 'Chief Executive Officer', // Invalid unlisted role
        qualification: 'BCA / MCA',
        experience: 5,
        skills: 'Leadership, Strategy',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'jobRole');
      assert.ok(err);
      assert.match(err.message, /Invalid Job Role/i);
    });

    // 12. Negative Experience
    await test('T12: POST /api/applications (Negative Experience -5) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'Jane Smith',
        email: 'jane.exp@example.com',
        phone: '9823456789',
        dob: '2000-01-01',
        jobRole: 'Full Stack Developer',
        qualification: 'BCA / MCA',
        experience: -5,
        skills: 'Node, Express',
        termsAccepted: true
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'experience');
      assert.ok(err);
      assert.match(err.message, /between 0 and 40 years/i);
    });

    // 13. Terms Not Accepted
    await test('T13: POST /api/applications (Terms Not Accepted) returns 400 Bad Request', async () => {
      const payload = {
        fullName: 'Jane Smith',
        email: 'jane.terms@example.com',
        phone: '9823456789',
        dob: '2000-01-01',
        jobRole: 'Full Stack Developer',
        qualification: 'BCA / MCA',
        experience: 2,
        skills: 'Node, Express',
        termsAccepted: false
      };

      const res = await request('POST', '/api/applications', payload);
      assert.equal(res.statusCode, 400);
      const err = res.body.errors.find(e => e.field === 'termsAccepted');
      assert.ok(err);
      assert.match(err.message, /accept the terms/i);
    });

    // 14. GET by ID & DELETE candidate application
    await test('T14: GET & DELETE /api/applications/:id lifecycle returns 200 OK and 404 on re-fetch', async () => {
      assert.ok(createdAppId, 'createdAppId should be set from T5');

      // GET by ID
      const getRes = await request('GET', `/api/applications/${createdAppId}`);
      assert.equal(getRes.statusCode, 200);
      assert.equal(getRes.body.data.id, createdAppId);

      // DELETE
      const delRes = await request('DELETE', `/api/applications/${createdAppId}`);
      assert.equal(delRes.statusCode, 200);
      assert.equal(delRes.body.success, true);

      // Re-fetch deleted (404)
      const afterRes = await request('GET', `/api/applications/${createdAppId}`);
      assert.equal(afterRes.statusCode, 404);
    });

  } finally {
    server.close();
  }

  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});

