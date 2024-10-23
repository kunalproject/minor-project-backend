const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

// Define the `/predict` route
app.get('/', (req, res) => {
    const inputData = req.query.data;

    // Check if input data is provided
    if (!inputData) {
        return res.status(400).json({ error: 'No input data provided' });
    }

    // Pass the input data to the Python script as arguments
    const inputArgs = inputData.split(',');

    // Ensure 8 inputs are provided
    if (inputArgs.length !== 8) {
        return res.status(400).json({ error: 'Input data must contain 8 values.' });
    }

    // Spawn a Python process to run the prediction script
    const pythonProcess = spawn('python', ['predict_diabetes.py', ...inputArgs]);

    // Capture the script output
    pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        res.json({ result });
    });

    // Capture any errors
    // pythonProcess.stderr.on('data', (data) => {
    //     console.error(`Python error: ${data.toString()}`);
    //     res.status(500).json({ error: 'An error occurred during prediction.' });
    // });

    // Capture the process exit
    pythonProcess.on('exit', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
