const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://test-frontend-self-three.vercel.app'
    ]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.post('/api/signup', async(req, res) => {
    try {
        const { name, password } = req.body;
        const newUser = new User({ name, password });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a test route to verify the server is working
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Export for Vercel
module.exports = app;
