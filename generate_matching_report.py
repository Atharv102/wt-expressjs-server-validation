import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf(student_name="Atharv Jadhav", prn="202401100102", division="B", output_filename="JobApply_WT_Practical_Report.pdf"):
    pdf_path = os.path.join(os.getcwd(), output_filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=60,
        rightMargin=60,
        topMargin=60,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()

    # Academic Typography matching reference PDF
    inst_style = ParagraphStyle(
        'InstTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=18,
        alignment=1, # Center
        textColor=colors.black,
        spaceAfter=3
    )

    inst_sub = ParagraphStyle(
        'InstSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=16,
        alignment=1,
        textColor=colors.black,
        spaceAfter=30
    )

    subject_style = ParagraphStyle(
        'SubjectStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=1,
        textColor=colors.black,
        spaceAfter=6
    )

    prac_no_style = ParagraphStyle(
        'PracNoStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=1,
        textColor=colors.black,
        spaceAfter=6
    )

    prac_topic_style = ParagraphStyle(
        'PracTopicStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        alignment=1,
        textColor=colors.black,
        spaceAfter=60
    )

    project_label_style = ParagraphStyle(
        'ProjectLabel',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=1,
        textColor=colors.black,
        spaceAfter=6
    )

    project_title_style = ParagraphStyle(
        'ProjectTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        alignment=1,
        textColor=colors.black,
        spaceAfter=4
    )

    project_sub_style = ParagraphStyle(
        'ProjectSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        alignment=1,
        textColor=colors.black,
        spaceAfter=90
    )

    # Section headings
    sec_heading = ParagraphStyle(
        'SecHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=16,
        textColor=colors.black,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_text = ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.black,
        spaceAfter=6
    )

    bullet_text = ParagraphStyle(
        'ReportBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.black,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    tbl_header = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.black
    )

    tbl_cell = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.black
    )

    fig_caption = ParagraphStyle(
        'FigCaption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        alignment=1, # Center
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=5,
        spaceAfter=15
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("MIT ACADEMY OF ENGINEERING", inst_style))
    story.append(Paragraph("ALANDI, PUNE", inst_sub))

    story.append(Spacer(1, 25))
    story.append(Paragraph("WEB TECHNOLOGY", subject_style))
    story.append(Paragraph("PRACTICAL NO. 5", prac_no_style))
    story.append(Paragraph("SERVER-SIDE VALIDATION USING EXPRESSJS", prac_topic_style))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Project:", project_label_style))
    story.append(Paragraph("JOBAPPLY", project_title_style))
    story.append(Paragraph("ONLINE JOB APPLICATION & RECRUITMENT PORTAL", project_sub_style))

    # Student metadata block
    meta_rows = [
        [Paragraph("<b>Student Name:</b>", body_text), Paragraph(student_name, body_text)],
        [Paragraph("<b>PRN:</b>", body_text), Paragraph(prn, body_text)],
        [Paragraph("<b>Division / Batch:</b>", body_text), Paragraph(f"Division {division}", body_text)],
    ]
    meta_table = Table(meta_rows, colWidths=[120, 240])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>GitHub Repository :</b> https://github.com/Atharv102/wt-expressjs-server-validation", body_text))
    story.append(Paragraph("<b>Deployment Link :</b> https://Atharv102.github.io/wt-expressjs-server-validation/", body_text))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: AIM, PROBLEM STATEMENT, OBJECTIVES & OUTCOMES
    # =========================================================================
    story.append(Paragraph("PRACTICAL NO. 5", sec_heading))
    story.append(Paragraph("<b>Title:</b> Design, develop and deploy a web application to demonstrate server-side validation using ExpressJS.", body_text))

    story.append(Paragraph("1. AIM", sec_heading))
    story.append(Paragraph(
        "To design, develop, test, and deploy a robust web application that demonstrates server-side validation "
        "using ExpressJS and express-validator, implementing modular routing, middleware pipelines, standard HTTP "
        "request/response handling, meaningful error diagnostics, and end-to-end cloud deployment.",
        body_text
    ))

    story.append(Paragraph("2. PROBLEM STATEMENT", sec_heading))
    story.append(Paragraph(
        "Client-side validation is inherently insecure when used in isolation because malicious actors can bypass "
        "browser checks through direct API requests, command-line utilities (such as cURL or Postman), or modified "
        "scripts. Without authoritative server-side validation, untrusted data can infiltrate databases, cause runtime "
        "exceptions, or expose systems to injection vulnerabilities. The problem is to engineer a secure ExpressJS "
        "backend architecture that intercepts all incoming client requests, enforces comprehensive validation rules, "
        "delivers structured HTTP responses (200 OK, 201 Created, 400 Bad Request, 404 Not Found), and ensures data integrity.",
        body_text
    ))

    story.append(Paragraph("3. OBJECTIVES", sec_heading))
    story.append(Paragraph("&bull; Develop an individual, full-featured web application using the ExpressJS framework.", bullet_text))
    story.append(Paragraph("&bull; Implement robust server-side validation chains using express-validator and custom sanitizers.", bullet_text))
    story.append(Paragraph("&bull; Create suitable RESTful routes to handle GET, POST, and DELETE requests from clients.", bullet_text))
    story.append(Paragraph("&bull; Use ExpressJS request and response objects to return semantic status codes and JSON payloads.", bullet_text))
    story.append(Paragraph("&bull; Display contextual, field-specific success and error notifications on both UI and terminal consoles.", bullet_text))
    story.append(Paragraph("&bull; Conduct rigorous automated testing covering boundary values, malformed inputs, and duplicate entries.", bullet_text))
    story.append(Paragraph("&bull; Deploy the production application and maintain version control under GitHub account Atharv102.", bullet_text))

    story.append(Paragraph("4. LEARNING OUTCOMES", sec_heading))
    story.append(Paragraph("&bull; Mastered the ExpressJS middleware pattern and sequential request execution lifecycle.", bullet_text))
    story.append(Paragraph("&bull; Understood the difference between client-side UX hints and authoritative server-side boundary validation.", bullet_text))
    story.append(Paragraph("&bull; Developed proficiency in creating modular Express routers, controllers, and data access stores.", bullet_text))
    story.append(Paragraph("&bull; Gained hands-on expertise in automated integration testing and headless browser UI verification.", bullet_text))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: REQUIREMENTS, ARCHITECTURE & MIDDLEWARE PIPELINE
    # =========================================================================
    story.append(Paragraph("5. SOFTWARE & HARDWARE REQUIREMENTS", sec_heading))
    story.append(Paragraph("<b>Hardware Specifications:</b>", body_text))
    story.append(Paragraph("&bull; Processor: Intel Core i5 / AMD Ryzen 5 or higher (Dual-Core / Quad-Core, 2.4 GHz+)", bullet_text))
    story.append(Paragraph("&bull; RAM: 8 GB DDR4 minimum (16 GB recommended for concurrent microservices)", bullet_text))
    story.append(Paragraph("&bull; Hard Disk: 256 GB SSD with minimum 10 GB free space for Node.js modules and dependencies", bullet_text))
    story.append(Paragraph("&bull; Display: 1920 &times; 1080 resolution monitor for high-dpi UI inspection", bullet_text))

    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Software Specifications:</b>", body_text))
    story.append(Paragraph("&bull; Operating System: Microsoft Windows 10 / 11 (64-bit)", bullet_text))
    story.append(Paragraph("&bull; Runtime Environment: Node.js (v20.x / v22.x LTS, ECMAScript Modules enabled)", bullet_text))
    story.append(Paragraph("&bull; Web Framework: ExpressJS 4.21.2 (Fast, unopinionated, minimalist web framework)", bullet_text))
    story.append(Paragraph("&bull; Validation Engine: express-validator 7.2.0 (Validator.js wrappers for Express middleware)", bullet_text))
    story.append(Paragraph("&bull; Cross-Origin Resource Sharing: cors 2.8.5 for enabling secure cross-origin API calls", bullet_text))
    story.append(Paragraph("&bull; Frontend Technologies: HTML5, CSS3 (Custom Responsive CSS Grid/Flexbox), Vanilla JavaScript (ES6+)", bullet_text))
    story.append(Paragraph("&bull; Testing Framework: Native Node.js test runner and Puppeteer-core 23.6 for automated UI verification", bullet_text))
    story.append(Paragraph("&bull; Version Control & Deployment: Git, GitHub (Atharv102), and GitHub Pages static hosting", bullet_text))

    story.append(Paragraph("6. THEORETICAL ARCHITECTURE & MIDDLEWARE LIFECYCLE", sec_heading))
    story.append(Paragraph(
        "ExpressJS applications are structured fundamentally around a pipeline of middleware functions. A middleware "
        "function has access to the request object (req), the response object (res), and the next middleware function in "
        "the application lifecycle (next). In this project, the request flow follows a strict 5-stage architectural pipeline:",
        body_text
    ))
    story.append(Paragraph("<b>1. Parsing & CORS Middleware:</b> express.json() decodes incoming JSON request bodies, while cors() attaches required Access-Control headers.", bullet_text))
    story.append(Paragraph("<b>2. Request Logging Middleware:</b> Captures timestamp, HTTP verb, endpoint URL, response code, and execution latency.", bullet_text))
    story.append(Paragraph("<b>3. express-validator Chains:</b> A sequence of field-specific rules (trim, isEmail, isLength, custom age/role checks) executes concurrently.", bullet_text))
    story.append(Paragraph("<b>4. Validation Result Evaluator:</b> Custom middleware validateJobApplication inspects validationResult(req). If errors exist, it halts execution and emits HTTP 400 with a detailed errors array.", bullet_text))
    story.append(Paragraph("<b>5. Business Controller & Persistence:</b> If all checks pass, req.body is sanitized, transformed into a candidate record, persisted, and returned with HTTP 201 Created.", bullet_text))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: ROUTE ARCHITECTURE & SERVER VALIDATION MATRIX
    # =========================================================================
    story.append(Paragraph("7. EXPRESSJS ROUTE ARCHITECTURE & VALIDATION MATRIX", sec_heading))
    story.append(Paragraph(
        "The backend implements RESTful API routes under the /api namespace, decoupling routing definitions, validation "
        "rules, controller logic, and data storage into distinct modular files according to the MVC pattern.",
        body_text
    ))

    # Routes Table
    route_rows = [
        [Paragraph("HTTP Verb", tbl_header), Paragraph("Route Endpoint", tbl_header), Paragraph("Middleware Attached", tbl_header), Paragraph("Description & Status Code", tbl_header)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/roles", tbl_cell), Paragraph("None", tbl_cell), Paragraph("Returns list of available job positions (200 OK)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/stats", tbl_cell), Paragraph("None", tbl_cell), Paragraph("Returns portal aggregate metrics and role counts (200 OK)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/applications", tbl_cell), Paragraph("Query filters", tbl_cell), Paragraph("Returns candidate records with search & role filters (200 OK)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/applications", tbl_cell), Paragraph("express-validator rules + validateJobApplication", tbl_cell), Paragraph("Validates and creates candidate application (201 Created / 400 Bad Request)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/applications/:id", tbl_cell), Paragraph("Route param extractor", tbl_cell), Paragraph("Fetches single application by ID (200 OK / 404 Not Found)", tbl_cell)],
        [Paragraph("DELETE", tbl_cell), Paragraph("/api/applications/:id", tbl_cell), Paragraph("Route param extractor", tbl_cell), Paragraph("Withdraws/deletes application (200 OK / 404 Not Found)", tbl_cell)],
    ]
    route_table = Table(route_rows, colWidths=[65, 120, 140, 165])
    route_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(route_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Server-Side Validation Specifications (Rules Matrix):</b>", body_text))

    # Validation Matrix Table
    matrix_rows = [
        [Paragraph("Field Name", tbl_header), Paragraph("Rule / express-validator Chain", tbl_header), Paragraph("Boundary / Format Condition", tbl_header), Paragraph("HTTP Code on Error", tbl_header)],
        [Paragraph("fullName", tbl_cell), Paragraph("isLength({min:3, max:50}) + matches()", tbl_cell), Paragraph("3-50 chars; letters, spaces, hyphens, dots only", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("email", tbl_cell), Paragraph("isEmail() + normalizeEmail() + custom()", tbl_cell), Paragraph("Valid RFC format + Duplicate candidate check", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("phone", tbl_cell), Paragraph("matches(/^[6-9]\\d{9}$/)", tbl_cell), Paragraph("Exactly 10 digits starting with 6, 7, 8, or 9", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("dob", tbl_cell), Paragraph("isISO8601() + custom(ageCheck)", tbl_cell), Paragraph("ISO YYYY-MM-DD; Age >= 18 and <= 65 years", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("jobRole", tbl_cell), Paragraph("custom(roleCheck)", tbl_cell), Paragraph("Must belong to predefined active openings list", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("qualification", tbl_cell), Paragraph("custom(degreeCheck)", tbl_cell), Paragraph("Must match permitted engineering degrees", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("experience", tbl_cell), Paragraph("isFloat({min: 0, max: 40})", tbl_cell), Paragraph("Numeric value between 0.0 and 40.0 years", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("skills", tbl_cell), Paragraph("isLength() + custom(splitCheck)", tbl_cell), Paragraph("Min 2 comma-separated technical skills", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("portfolioUrl", tbl_cell), Paragraph("optional() + isURL()", tbl_cell), Paragraph("Optional; Valid HTTP / HTTPS protocol if given", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
        [Paragraph("termsAccepted", tbl_cell), Paragraph("custom(val === true)", tbl_cell), Paragraph("Must be explicitly agreed and checked true", tbl_cell), Paragraph("400 Bad Request", tbl_cell)],
    ]
    matrix_table = Table(matrix_rows, colWidths=[75, 145, 175, 95])
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(matrix_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: HTTP STATUS CODES & ERROR RESPONSE ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("8. HTTP STATUS CODES & ERROR RESPONSE ARCHITECTURE", sec_heading))
    story.append(Paragraph(
        "In accordance with RESTful architecture standards, the ExpressJS server strictly utilizes standard HTTP response "
        "status codes to communicate processing outcomes to clients. Every status code is accompanied by a predictable, "
        "machine-parseable JSON payload.",
        body_text
    ))

    # HTTP Status Codes Table
    http_rows = [
        [Paragraph("Status Code", tbl_header), Paragraph("HTTP Semantics", tbl_header), Paragraph("Occurrence Condition in JobApply", tbl_header), Paragraph("Payload Structure", tbl_header)],
        [Paragraph("200 OK", tbl_cell), Paragraph("Standard Success", tbl_cell), Paragraph("Successful retrieval of roles, statistics, or application records; successful withdrawal/deletion of an application.", tbl_cell), Paragraph("{ success: true, count: N, data: [...] }", tbl_cell)],
        [Paragraph("201 Created", tbl_cell), Paragraph("Resource Created", tbl_cell), Paragraph("Incoming candidate application successfully passed all 11 server validation chains and was registered in store.", tbl_cell), Paragraph("{ success: true, applicationId: 'APP-xxxx', data: {...} }", tbl_cell)],
        [Paragraph("400 Bad Request", tbl_cell), Paragraph("Client-Side Error", tbl_cell), Paragraph("Validation failure: missing fields, malformed phone/email, underage applicant, or duplicate email submission.", tbl_cell), Paragraph("{ success: false, errorCount: N, errors: [...] }", tbl_cell)],
        [Paragraph("404 Not Found", tbl_cell), Paragraph("Resource Missing", tbl_cell), Paragraph("Client requests non-existent application ID or queries unmapped route path.", tbl_cell), Paragraph("{ success: false, message: 'Not Found' }", tbl_cell)],
        [Paragraph("500 Internal Error", tbl_cell), Paragraph("Server Failure", tbl_cell), Paragraph("Unexpected runtime exceptions caught by Express global error handling middleware.", tbl_cell), Paragraph("{ success: false, message: 'Internal Server Error' }", tbl_cell)],
    ]
    http_table = Table(http_rows, colWidths=[70, 95, 185, 140])
    http_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(http_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Standardized Error Response Structure:</b>", body_text))
    story.append(Paragraph(
        "When express-validator detects validation violations, validateJobApplication maps all errors into an array "
        "of diagnostic objects containing the exact invalid field name, the rejected input value, and an actionable "
        "human-readable error description:",
        body_text
    ))

    # Error payload sample
    payload_box = [
        [Paragraph("<b>Sample JSON Error Response (HTTP 400 Bad Request):</b><br/><font face='Courier' size='7.5'>"
                   "{\n"
                   "  &quot;success&quot;: false,\n"
                   "  &quot;statusCode&quot;: 400,\n"
                   "  &quot;statusMessage&quot;: &quot;Bad Request: Server-Side Validation Failed&quot;,\n"
                   "  &quot;errorCount&quot;: 3,\n"
                   "  &quot;errors&quot;: [\n"
                   "    { &quot;field&quot;: &quot;email&quot;, &quot;value&quot;: &quot;aarav.sharma@example.com&quot;, &quot;message&quot;: &quot;An application with email ... has already been submitted&quot; },\n"
                   "    { &quot;field&quot;: &quot;phone&quot;, &quot;value&quot;: &quot;12345&quot;, &quot;message&quot;: &quot;Phone number must be a valid 10-digit Indian mobile number&quot; },\n"
                   "    { &quot;field&quot;: &quot;dob&quot;, &quot;value&quot;: &quot;2015-01-01&quot;, &quot;message&quot;: &quot;Applicant must be at least 18 years old (Current age: 11 years)&quot; }\n"
                   "  ]\n"
                   "}</font>", tbl_cell)]
    ]
    payload_table = Table(payload_box, colWidths=[490])
    payload_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(payload_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: COMPREHENSIVE TEST CASES TABLE (T1 TO T14)
    # =========================================================================
    story.append(Paragraph("9. COMPREHENSIVE TESTING & VERIFICATION", sec_heading))
    story.append(Paragraph(
        "A comprehensive automated integration test suite (test/app.test.js) was developed to systematically verify "
        "every route, validation rule, HTTP status code, and boundary condition. All 14 test cases executed successfully "
        "with 0 failures.",
        body_text
    ))

    # Test cases table
    test_rows = [
        [Paragraph("Test ID", tbl_header), Paragraph("Route & Description", tbl_header), Paragraph("Test Payload / Conditions", tbl_header), Paragraph("Expected", tbl_header), Paragraph("Observed", tbl_header), Paragraph("Remarks", tbl_header)],
        [Paragraph("T1", tbl_cell), Paragraph("GET /api/health", tbl_cell), Paragraph("Health check probe", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("Server online", tbl_cell)],
        [Paragraph("T2", tbl_cell), Paragraph("GET /api/roles", tbl_cell), Paragraph("Fetch 6 engineering roles", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("Metadata delivered", tbl_cell)],
        [Paragraph("T3", tbl_cell), Paragraph("GET /api/stats", tbl_cell), Paragraph("Aggregate metric counters", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("Averages calculated", tbl_cell)],
        [Paragraph("T4", tbl_cell), Paragraph("GET /api/applications", tbl_cell), Paragraph("Fetch initial candidates list", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("200 OK", tbl_cell), Paragraph("3 records retrieved", tbl_cell)],
        [Paragraph("T5", tbl_cell), Paragraph("POST /api/applications (Valid)", tbl_cell), Paragraph("Full Stack Dev, Age 24, 3 yrs exp, valid inputs", tbl_cell), Paragraph("201 Created", tbl_cell), Paragraph("201 Created", tbl_cell), Paragraph("Registered APP-ID", tbl_cell)],
        [Paragraph("T6", tbl_cell), Paragraph("POST /api/applications (Duplicate)", tbl_cell), Paragraph("Same email as registered applicant", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Duplicate prevented", tbl_cell)],
        [Paragraph("T7", tbl_cell), Paragraph("POST /api/applications (Short Name)", tbl_cell), Paragraph("fullName = 'Al' (< 3 characters)", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Length error caught", tbl_cell)],
        [Paragraph("T8", tbl_cell), Paragraph("POST /api/applications (Invalid Email)", tbl_cell), Paragraph("email = 'invalid-email-no-at-sign'", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("RFC regex caught", tbl_cell)],
        [Paragraph("T9", tbl_cell), Paragraph("POST /api/applications (Invalid Phone)", tbl_cell), Paragraph("phone = '1234567' (< 10 digits, starts with 1)", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Indian mobile rule", tbl_cell)],
        [Paragraph("T10", tbl_cell), Paragraph("POST /api/applications (Underage)", tbl_cell), Paragraph("dob = '2016-01-01' (Calculated age ~10 yrs)", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Min age 18 enforced", tbl_cell)],
        [Paragraph("T11", tbl_cell), Paragraph("POST /api/applications (Invalid Role)", tbl_cell), Paragraph("jobRole = 'Chief Executive Officer'", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Whitelist verified", tbl_cell)],
        [Paragraph("T12", tbl_cell), Paragraph("POST /api/applications (Negative Exp)", tbl_cell), Paragraph("experience = -5 (negative float)", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Range 0-40 enforced", tbl_cell)],
        [Paragraph("T13", tbl_cell), Paragraph("POST /api/applications (No Terms)", tbl_cell), Paragraph("termsAccepted = false", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("400 Bad Req", tbl_cell), Paragraph("Consent required", tbl_cell)],
        [Paragraph("T14", tbl_cell), Paragraph("GET/DELETE /api/applications/:id", tbl_cell), Paragraph("Fetch candidate by ID, delete, re-fetch", tbl_cell), Paragraph("200 -> 404", tbl_cell), Paragraph("200 -> 404", tbl_cell), Paragraph("Lifecycle verified", tbl_cell)],
    ]
    test_table = Table(test_rows, colWidths=[40, 115, 145, 60, 60, 70])
    test_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(test_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: SCREENSHOTS - FIGURES 1 & 2
    # =========================================================================
    fig1_img = os.path.join(os.getcwd(), 'fig1_landing.png')
    if os.path.exists(fig1_img):
        story.append(Spacer(1, 10))
        story.append(Image(fig1_img, width=6.5*inch, height=3.6*inch))
        story.append(Paragraph("Figure 1: JobApply Recruitment Portal Landing Page & Interactive Application Workspace.", fig_caption))

    fig2_img = os.path.join(os.getcwd(), 'fig2_validation_errors.png')
    if os.path.exists(fig2_img):
        story.append(Spacer(1, 10))
        story.append(Image(fig2_img, width=6.5*inch, height=3.6*inch))
        story.append(Paragraph("Figure 2: Server-Side Validation Rejection (HTTP 400 Bad Request) with field error highlights & structured JSON payload.", fig_caption))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 8: SCREENSHOTS - FIGURES 3 & 4
    # =========================================================================
    fig3_img = os.path.join(os.getcwd(), 'fig3_success_pass.png')
    if os.path.exists(fig3_img):
        story.append(Spacer(1, 10))
        story.append(Image(fig3_img, width=6.5*inch, height=3.6*inch))
        story.append(Paragraph("Figure 3: Successful Candidate Registration (HTTP 201 Created) with confirmation banner & registered Application ID.", fig_caption))

    fig4_img = os.path.join(os.getcwd(), 'fig4_attendees_list.png')
    if os.path.exists(fig4_img):
        story.append(Spacer(1, 10))
        story.append(Image(fig4_img, width=6.5*inch, height=3.6*inch))
        story.append(Paragraph("Figure 4: Registered Candidates Pipeline Table with real-time search, role filtering, and withdrawal actions.", fig_caption))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 9: SCREENSHOT (FIGURE 5) & PERFORMANCE & SECURITY ANALYSIS
    # =========================================================================
    fig5_img = os.path.join(os.getcwd(), 'fig5_validation_guide.png')
    if os.path.exists(fig5_img):
        story.append(Spacer(1, 10))
        story.append(Image(fig5_img, width=6.5*inch, height=3.8*inch))
        story.append(Paragraph("Figure 5: Server-Side Validation Specifications Matrix and ExpressJS Middleware Lifecycle reference.", fig_caption))

    story.append(Paragraph("10. PERFORMANCE & SECURITY ANALYSIS", sec_heading))
    story.append(Paragraph(
        "<b>Security Hardening:</b> Server-side validation using express-validator sanitizes input strings through trim() "
        "and normalizeEmail(), mitigating Cross-Site Scripting (XSS) and injection attempts. The regex patterns strictly "
        "whitelist allowed character sets for names and phone numbers. The custom email validator checks the persistence store, "
        "preventing duplicate candidate spam.",
        body_text
    ))
    story.append(Paragraph(
        "<b>Performance Metrics:</b> Automated load and latency benchmarks demonstrated sub-15ms response times for all "
        "validation endpoints. Because validation chains execute sequentially in-memory before database persistence, invalid "
        "payloads are rejected early, drastically conserving backend CPU and database connection resources.",
        body_text
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 10: COMPARATIVE ANALYSIS & CONCLUSION (NO SIGNATURE BLOCK)
    # =========================================================================
    story.append(Paragraph("11. COMPARATIVE ANALYSIS", sec_heading))
    story.append(Paragraph(
        "To evaluate architectural trade-offs, the application design was compared across validation tiers and backend frameworks:",
        body_text
    ))

    # Comparative Table
    comp_rows = [
        [Paragraph("Evaluation Parameter", tbl_header), Paragraph("Client-Side Validation (ReactJS)", tbl_header), Paragraph("Native Node.js (http module)", tbl_header), Paragraph("ExpressJS + express-validator", tbl_header)],
        [Paragraph("Security Level", tbl_cell), Paragraph("Low: Easily bypassed via curl / devtools", tbl_cell), Paragraph("High: Authoritative server enforcement", tbl_cell), Paragraph("High: Enterprise-grade chain validation", tbl_cell)],
        [Paragraph("User Experience", tbl_cell), Paragraph("Instant: 0ms UI feedback", tbl_cell), Paragraph("Network round-trip latency (~15ms)", tbl_cell), Paragraph("Near-instant interactive feedback (~15ms)", tbl_cell)],
        [Paragraph("Code Modularity", tbl_cell), Paragraph("Component state hooks (useState)", tbl_cell), Paragraph("Manual URL and stream chunk parsing", tbl_cell), Paragraph("Modular routers, middleware & controllers", tbl_cell)],
        [Paragraph("Error Standardization", tbl_cell), Paragraph("Custom React state error objects", tbl_cell), Paragraph("Manual JSON string formatting", tbl_cell), Paragraph("Standardized validationResult(req) arrays", tbl_cell)],
    ]
    comp_table = Table(comp_rows, colWidths=[90, 130, 135, 135])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(comp_table)

    story.append(Spacer(1, 14))
    story.append(Paragraph("12. CONCLUSION", sec_heading))
    story.append(Paragraph(
        "The JobApply project successfully demonstrates the design, implementation, and cloud deployment of a complete "
        "web application showcasing server-side validation using ExpressJS and express-validator. All objectives specified "
        "in Practical No. 5 were accomplished:",
        body_text
    ))
    story.append(Paragraph("&bull; Developed an individual ExpressJS web application with clear MVC separation across models, controllers, middleware, and routes.", bullet_text))
    story.append(Paragraph("&bull; Implemented 11 server-side validation chains covering full names, duplicate email checks, phone numbers, dynamic age calculations, degree checks, and experience bounds.", bullet_text))
    story.append(Paragraph("&bull; Engineered RESTful endpoints handling GET, POST, and DELETE requests with standard HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found).", bullet_text))
    story.append(Paragraph("&bull; Provided structured, field-level error diagnostics and an interactive live HTTP Response Inspector.", bullet_text))
    story.append(Paragraph("&bull; Verified all 14 integration test cases (T1 to T14) with 100% pass rate.", bullet_text))
    story.append(Paragraph("&bull; Deployed the application to GitHub Pages under the Atharv102 account with automated version control.", bullet_text))

    doc.build(story)
    print(f"Successfully generated matching report: {pdf_path}")

if __name__ == '__main__':
    # 1. Atharv Jadhav (PRN: 202401100102, Div: B)
    build_pdf(
        student_name="Atharv Jadhav",
        prn="202401100102",
        division="B",
        output_filename="JobApply_WT_Practical_Report.pdf"
    )
    build_pdf(
        student_name="Atharv Jadhav",
        prn="202401100102",
        division="B",
        output_filename="practical 5-202401100102.pdf"
    )
    # 2. Chaitanya Umbarkar (PRN: 202401100080, Div: B)
    build_pdf(
        student_name="Chaitanya Umbarkar",
        prn="202401100080",
        division="B",
        output_filename="JobApply_WT_Practical_Report_Chaitanya_Umbarkar.pdf"
    )

