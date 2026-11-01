# JobApply — Enterprise Online Job Application & Recruitment Portal
> **Web Technology Laboratory (Practical No. 5)**  
> **Topic:** Design, develop and deploy a web application to demonstrate server-side validation using ExpressJS  
> **Institution:** MIT Academy of Engineering, Alandi (D.), Pune  
> **Department:** Department of Computer Engineering (A.Y. 2026-27)  
> **Author:** Atharv Jadhav (PRN: `202401100102`, Div: `B`)  
> **Collaborator Copy:** Chaitanya Umbarkar (PRN: `202401100080`, Div: `B`)  

---

## 🚀 Live Deployment & Source Code
- 🌐 **Live Web Application (GitHub Pages):** [https://Atharv102.github.io/wt-expressjs-server-validation/](https://Atharv102.github.io/wt-expressjs-server-validation/)
- 💻 **GitHub Repository:** [https://github.com/Atharv102/wt-expressjs-server-validation](https://github.com/Atharv102/wt-expressjs-server-validation)

---

## 📌 Practical Objectives
1. **Develop an individual web application using ExpressJS.**
2. **Implement robust server-side validation** for all incoming user input using `express-validator` and custom middleware.
3. **Create suitable RESTful routes** (`GET`, `POST`, `DELETE`) to handle client requests.
4. **Use ExpressJS for request and response handling** with semantic HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
5. **Display proper success and error messages** with structured JSON payloads and actionable field-level diagnostics.
6. **Test the application using different valid and invalid inputs** across boundary conditions, missing fields, malformed patterns, and duplicate submissions.

---

## 🛠️ Technology Stack
- **Backend Framework:** Node.js (v20+ / v22+ LTS), ExpressJS `^4.21.2`
- **Validation Library:** `express-validator` `^7.2.0`
- **CORS Middleware:** `cors` `^2.8.5`
- **Frontend:** HTML5, Modern CSS3 (CSS Grid & Flexbox, Custom Dark Theme), Vanilla JavaScript (ES6 Modules)
- **Automated Testing:** Native Node.js `assert` test runner (14/14 automated tests)
- **UI Automation & Screenshot Capture:** `puppeteer-core` `^23.6.0`
- **Version Control & Hosting:** Git, GitHub (`Atharv102`), GitHub Pages

---

## 📂 Project Architecture & Directory Structure
```
Practical 5/
├── controllers/
│   └── jobController.js              # Request handling & HTTP response serialization
├── middleware/
│   └── jobValidator.js               # express-validator chains & error formatting middleware
├── models/
│   └── jobApplicationStore.js        # In-memory candidate application repository & seed data
├── public/
│   ├── css/
│   │   └── style.css                 # Responsive stylesheet with dark UI & validation states
│   ├── js/
│   │   └── app.js                    # Client-side API connector, presets & simulator
│   └── index.html                    # Application UI with Form, Inspector & Registry Table
├── routes/
│   └── jobRoutes.js                  # Express router mapping HTTP verbs to controllers
├── test/
│   └── app.test.js                   # 14 automated integration & validation test cases
├── capture-screenshots.js            # Puppeteer script for automated high-res report figures
├── generate_matching_report.py       # ReportLab script generating 10-page academic PDF reports
├── package.json                      # Project metadata, scripts, and dependencies
├── server.js                         # Express server entrypoint & middleware pipeline
└── README.md                         # Comprehensive documentation
```

---

## 🛡️ Server-Side Validation Specifications (express-validator)

| Field | express-validator Chain | Boundary Condition | HTTP Code on Failure |
| :--- | :--- | :--- | :---: |
| `fullName` | `trim()`, `isLength({ min: 3, max: 50 })`, `matches(/^[A-Za-z]+([ A-Za-z.'-]+)*$/)` | 3–50 chars; letters, spaces, hyphens, and dots only | `400 Bad Request` |
| `email` | `trim()`, `isEmail()`, `normalizeEmail()`, `custom(uniquenessCheck)` | Valid RFC email + Duplicate candidate prevention | `400 Bad Request` |
| `phone` | `trim()`, `matches(/^[6-9]\d{9}$/)` | Exactly 10 digits starting with 6, 7, 8, or 9 | `400 Bad Request` |
| `dob` | `isISO8601()`, `custom(age >= 18 && age <= 65)` | Age must be between 18 and 65 years at runtime | `400 Bad Request` |
| `jobRole` | `trim()`, `custom(whitelistCheck)` | Must be one of 6 predefined active engineering positions | `400 Bad Request` |
| `qualification` | `trim()`, `custom(degreeCheck)` | Must match allowed university engineering degrees | `400 Bad Request` |
| `experience` | `isFloat({ min: 0, max: 40 })` | Numeric value between 0.0 and 40.0 years | `400 Bad Request` |
| `skills` | `trim()`, `custom(min 2 comma-separated)` | At least 2 distinct technical skills | `400 Bad Request` |
| `portfolioUrl` | `optional()`, `isURL({ protocols: ['http', 'https'] })` | Optional; must be a valid HTTP/HTTPS web link if supplied | `400 Bad Request` |
| `termsAccepted` | `custom(val === true)` | Must be explicitly agreed and checked true | `400 Bad Request` |

---

## 🚦 RESTful API Routes

| HTTP Verb | Route | Description | Success Code | Error Code |
| :---: | :--- | :--- | :---: | :---: |
| `GET` | `/api/health` | Service uptime and health probe | `200 OK` | — |
| `GET` | `/api/roles` | List of 6 open engineering positions & qualifications | `200 OK` | — |
| `GET` | `/api/stats` | Aggregated applicant count and experience metrics | `200 OK` | — |
| `GET` | `/api/applications` | Retrieve all applications with optional `?search=` and `?role=` | `200 OK` | — |
| `POST` | `/api/applications` | Validate payload and register candidate application | `201 Created` | `400 Bad Request` |
| `GET` | `/api/applications/:id` | Retrieve specific candidate record by application ID | `200 OK` | `404 Not Found` |
| `DELETE` | `/api/applications/:id` | Withdraw/delete candidate record from recruitment pipeline | `200 OK` | `404 Not Found` |

---

## 🧪 Automated Integration & Validation Tests (14/14 Passed)

```bash
npm test
```

### Test Suite Execution Output:
```
======================================================
   RUNNING JOBAPPLY EXPRESSJS VALIDATION TEST SUITE   
======================================================

  ✔ PASS: T1: GET /api/health returns 200 OK with ONLINE status
  ✔ PASS: T2: GET /api/roles returns 200 OK and 6 active engineering positions
  ✔ PASS: T3: GET /api/stats returns 200 OK with aggregation metrics
  ✔ PASS: T4: GET /api/applications returns 200 OK with candidate array
  ✔ PASS: T5: POST /api/applications (Valid Candidate) returns 201 Created
  ✔ PASS: T6: POST /api/applications (Duplicate Email) returns 400 Bad Request
  ✔ PASS: T7: POST /api/applications (Name Too Short) returns 400 Bad Request
  ✔ PASS: T8: POST /api/applications (Invalid Email RFC) returns 400 Bad Request
  ✔ PASS: T9: POST /api/applications (Invalid Mobile 1234567) returns 400 Bad Request
  ✔ PASS: T10: POST /api/applications (Underage Applicant < 18) returns 400 Bad Request
  ✔ PASS: T11: POST /api/applications (Unlisted Job Role) returns 400 Bad Request
  ✔ PASS: T12: POST /api/applications (Negative Experience -5) returns 400 Bad Request
  ✔ PASS: T13: POST /api/applications (Terms Not Accepted) returns 400 Bad Request
  ✔ PASS: T14: GET & DELETE /api/applications/:id lifecycle returns 200 OK and 404 on re-fetch

======================================================
  TEST RESULTS: 14 Passed, 0 Failed
======================================================
```

---

## 💻 Installation & Local Execution

### Prerequisites
- Node.js (v20+ recommended)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Atharv102/wt-expressjs-server-validation.git
cd wt-expressjs-server-validation
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the ExpressJS server
```bash
npm start
```
Open your web browser and navigate to:
```
http://localhost:3000
```

---

## 📄 Academic Reports Generated
- **Atharv Jadhav:** `JobApply_WT_Practical_Report.pdf` (PRN: `202401100102`, Division: `B`)
- **Chaitanya Umbarkar:** `JobApply_WT_Practical_Report_Chaitanya_Umbarkar.pdf` (PRN: `202401100080`, Division: `B`)
- **Format:** Strict 10-page academic layout matching MIT AOE format (Cover, Aim, Problem Statement, Objectives, Outcomes, Requirements, Architecture, Route & Validation Matrix, HTTP Status Codes, Comprehensive Testing T1-T14, Figures 1 to 5, Security & Performance Analysis, Comparative Analysis, Conclusion, and no signature block).
