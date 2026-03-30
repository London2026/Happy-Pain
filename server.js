const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (in production, use a database)
const patients = new Map();
const nurses = new Map();
const painReports = new Map();
const messages = new Map();

// Patient Registration
app.post('/api/register/patient', (req, res) => {
    const { name, dateOfBirth, address, postCode, medicalHistory, regularMedication, prescribedPainMedication } = req.body;
    
    if (!name || !dateOfBirth || !address || !postCode) {
        return res.status(400).json({ error: 'Required fields missing' });
    }
    
    const patientId = uuidv4();
    patients.set(patientId, {
        patientId,
        name,
        dateOfBirth,
        address,
        postCode,
        medicalHistory: medicalHistory || '',
        regularMedication: regularMedication || '',
        prescribedPainMedication: prescribedPainMedication || '',
        registeredAt: new Date().toISOString()
    });
    
    res.json({ success: true, patientId, message: 'Patient registered successfully' });
});

// Nurse Registration
app.post('/api/register/nurse', (req, res) => {
    const { name, email, phone, employeeId, department } = req.body;
    
    if (!name || !email || !employeeId) {
        return res.status(400).json({ error: 'Required fields missing' });
    }
    
    const nurseId = uuidv4();
    nurses.set(nurseId, {
        nurseId,
        name,
        email,
        phone: phone || '',
        employeeId,
        department: department || '',
        registeredAt: new Date().toISOString()
    });
    
    res.json({ success: true, nurseId, message: 'Nurse registered successfully' });
});

// Submit Pain Report
app.post('/api/pain-report', (req, res) => {
    const { patientId, painLevel, lastMedicationName, lastMedicationTime, additionalNotes } = req.body;
    
    if (!patientId || !painLevel) {
        return res.status(400).json({ error: 'Patient ID and pain level required' });
    }
    
    const patient = patients.get(patientId);
    if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    
    const reportId = uuidv4();
    const report = {
        reportId,
        patientId,
        patientName: patient.name,
        patientDOB: patient.dateOfBirth,
        patientAddress: patient.address,
        patientPostCode: patient.postCode,
        medicalHistory: patient.medicalHistory,
        regularMedication: patient.regularMedication,
        prescribedPainMedication: patient.prescribedPainMedication,
        painLevel,
        lastMedicationName: lastMedicationName || '',
        lastMedicationTime: lastMedicationTime || '',
        additionalNotes: additionalNotes || '',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        nurseResponse: null
    };
    
    painReports.set(reportId, report);
    
    // Notify nurses (in real app, send email/SMS)
    console.log(`New pain report from ${patient.name}: Pain Level ${painLevel}`);
    
    res.json({ success: true, reportId, message: 'Pain report submitted successfully. Nurse will respond shortly.' });
});

// Get All Pain Reports (for nurses)
app.get('/api/pain-reports', (req, res) => {
    const reports = Array.from(painReports.values()).sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    res.json(reports);
});

// Get Single Pain Report
app.get('/api/pain-report/:reportId', (req, res) => {
    const report = painReports.get(req.params.reportId);
    if (!report) {
        return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
});

// Nurse Responds to Pain Report
app.post('/api/pain-report/:reportId/respond', (req, res) => {
    const { reportId } = req.params;
    const { nurseId, treatmentMessage, followUpInstructions } = req.body;
    
    if (!nurseId || !treatmentMessage) {
        return res.status(400).json({ error: 'Nurse ID and treatment message required' });
    }
    
    const nurse = nurses.get(nurseId);
    if (!nurse) {
        return res.status(404).json({ error: 'Nurse not found' });
    }
    
    const report = painReports.get(reportId);
    if (!report) {
        return res.status(404).json({ error: 'Report not found' });
    }
    
    report.status = 'responded';
    report.nurseResponse = {
        nurseId,
        nurseName: nurse.name,
        treatmentMessage,
        followUpInstructions: followUpInstructions || '',
        respondedAt: new Date().toISOString()
    };
    
    painReports.set(reportId, report);
    
    res.json({ success: true, message: 'Response sent successfully' });
});

// Get Patient's Pain Reports
app.get('/api/patient/:patientId/reports', (req, res) => {
    const { patientId } = req.params;
    const patientReports = Array.from(painReports.values())
        .filter(r => r.patientId === patientId)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json(patientReports);
});

// Get All Nurses (for selection)
app.get('/api/nurses', (req, res) => {
    const nurseList = Array.from(nurses.values()).map(n => ({
        nurseId: n.nurseId,
        name: n.name,
        employeeId: n.employeeId,
        department: n.department
    }));
    res.json(nurseList);
});

// Get All Patients (for admin/nurses)
app.get('/api/patients', (req, res) => {
    const patientList = Array.from(patients.values()).map(p => ({
        patientId: p.patientId,
        name: p.name,
        dateOfBirth: p.dateOfBirth,
        postCode: p.postCode
    }));
    res.json(patientList);
});

app.listen(PORT, () => {
    console.log(`Sickle Cell Pain Management Server running on port ${PORT}`);
});
