const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route for health check
app.get('/', (req, res) => {
    res.send('SOS Backend is running!');
});

// In-memory storage for the latest event
let latestEvent = null;

// POST /sos - Receive SOS event from ESP32
app.post('/sos', (req, res) => {
    const { device_id, event } = req.body;

    if (!device_id || !event) {
        return res.status(400).json({ error: "Missing device_id or event" });
    }

    console.log(`[EVENT RECEIVED] Device: ${device_id}, Event: ${event}`);

    // Update the latest event
    latestEvent = {
        device_id,
        event,
        timestamp: new Date().toISOString()
    };

    res.status(200).json({ message: "Event received successfully", data: latestEvent });
});

// GET /status - Return the latest event to the Flutter app
app.get('/status', (req, res) => {
    res.status(200).json(latestEvent || { status: "No events yet" });
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
