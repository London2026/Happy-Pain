# Sickle Cell Pain Management System

A web application for sickle cell anemia patients to report pain using the Numerical Pain Rating Scale (NPRS 0-10) and receive treatment advice from pain management nurses.

## Features

### For Patients:
- **Registration**: Register with personal details, medical history, and medication information
- **Pain Reporting**: Select pain level (0-10) using interactive NPRS scale
- **Medication Tracking**: Record last medication name and time taken
- **View Responses**: See nurse responses with treatment advice and follow-up instructions

### For Nurses:
- **Registration**: Register with professional details
- **Dashboard**: View all patient pain reports with complete medical information
- **Respond to Patients**: Send treatment messages and follow-up instructions
- **Patient Context**: See patient's medical history, regular medications, and prescribed pain medications

## Tech Stack
- **Backend**: Node.js with Express
- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Storage**: In-memory (for demo - use database in production)

## Running the Application

```bash
npm install
npm start
```

Then open http://localhost:3000/index.html in your browser.

## API Endpoints

- `POST /api/register/patient` - Register a new patient
- `POST /api/register/nurse` - Register a new nurse
- `POST /api/pain-report` - Submit a pain report
- `GET /api/pain-reports` - Get all pain reports (nurse dashboard)
- `POST /api/pain-report/:id/respond` - Nurse responds to a report
- `GET /api/patient/:id/reports` - Get patient's own reports

## Usage Flow

1. Patient registers and saves their Patient ID
2. Nurse registers and saves their Nurse ID
3. Patient submits pain report with NPRS level (0-10)
4. Nurse sees report with full patient details on dashboard
5. Nurse sends treatment response
6. Patient sees nurse's response with their name

## Note
This is a demonstration application using in-memory storage. For production use, implement a proper database and authentication system.
